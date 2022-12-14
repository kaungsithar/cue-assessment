import { useInfiniteQuery, } from '@tanstack/react-query';
import GHApi from '../utils/GHApi';
import { getNextPage } from './../utils/linkHeader';

interface Response {
  incomplete_results: boolean;
  items: Repo[];
  total_count: number;
  next_page: number;
}

export interface Repo {
  id: number;
  name: string;
  stargazers_count: number;
  forks: number;
  owner: Owner;
}

interface Owner {
  login: string;
}

export function useRepoInfiniteQuery(q: string, perPage: number = 40) {
  return useInfiniteQuery({
    enabled: q !== "",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['repo', q],
    queryFn: async ({ pageParam }) => {
      const { data, headers } = await GHApi.get<Response>(
        `/search/repositories?q=${q}&per_page=${perPage}&page=${pageParam}`
      );
      return { ...data, next_page: getNextPage(headers) };
    },
    getNextPageParam: (lastPage) => lastPage.next_page
  });
}