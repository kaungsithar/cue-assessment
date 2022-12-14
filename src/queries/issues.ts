import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import GHApi from "../utils/GHApi";
import { getNextPage } from "../utils/linkHeader";
import { Label } from "./labels";

interface SearchResponse {
  items: Issue[];
  total_count: number;
  next_page: string | undefined;
}

export interface Issue {
  id: number;
  node_id: string;
  labels: Label[];
  comments: number;
  title: string;
  state: "open" | "closed";
  draft: boolean;
  pull_request?: any;
}

export interface IssueQuery {
  q: string;
  ownerRepo: string;
  state: "open" | "closed" | null;
  labels: string[];
  isPR: boolean;
}

export function useIssueInfiniteQuery(query: IssueQuery) {
  return useInfiniteQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ["issues", query],
    queryFn: async ({ pageParam = 1 }) => {
      
      const queries = createSearchQueries(query);
      const { data, headers } = await GHApi.get<SearchResponse>(
        `search/issues?q=${queries}&page=${pageParam}`
      );

      return { ...data, next_page: getNextPage(headers) };
    },
    getNextPageParam: (lastPage) => lastPage.next_page,
  });
}

function createSearchQueries({
  q,
  ownerRepo,
  state,
  labels,
  isPR,
}: IssueQuery) {
  let queries = `${q}+repo:${ownerRepo}`;

  queries += labels.map((l) => `+label:"${l.replaceAll(" ", "+")}"`).join();

  queries += isPR ? "+is:pull-request" : "+is:issue";

  if(state !== null)
    queries += `+state:${state}`;

  return queries;
}
