import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import GHApi from './../utils/axios';
import { getNextPage } from './../utils/linkHeader';

interface SearchResponse {
  items: Issue[];
  total_count: number;
  next_page: string | undefined;
}

export interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  description: string;
  color: string;
  default: boolean;
}

export interface Issue {
  id: number;
  node_id: string;
  labels: Label[];
  comments: number;
  title: string;
  state: 'open' | 'closed';
  draft: boolean;
}

export function useIssueInfiniteQuery(q: string, ownerRepo: string, state: string, isPR: boolean) {
  return useInfiniteQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['issues', q, ownerRepo, state, isPR],
    queryFn: async ({ pageParam = 1 }) => {
      if (q) {
        let additionalParams = `+repo:${ownerRepo}`;
        additionalParams += isPR ? "+is:pull-request" : "+is:issue";

        if (state === "open" || state === "closed")
          additionalParams += `+state:${state}`

        const { data, headers } = await GHApi.get<SearchResponse>(
          `search/issues?q=${q}${additionalParams}&page=${pageParam}`
        );

        return { ...data, next_page: getNextPage(headers) };
      }

      const endpoint = isPR ? "pulls" : "issues";
      const { data, headers } = await GHApi.get<Issue[]>(
        `/repos/${ownerRepo}/${endpoint}?state=${state}&page=${pageParam}`
      );

      return {
        items: data,
        total_count: data.length,
        next_page: getNextPage(headers)
      };
    },
    getNextPageParam: (lastPage) => lastPage.next_page,
  });
}
