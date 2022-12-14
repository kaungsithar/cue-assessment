import { useQuery } from '@tanstack/react-query';
import GHApi from '../utils/GHApi';

interface Response {
  incomplete_results: boolean;
  items: Repo[];
  total_count: number;
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

export function useRepoQuery(q: string) {
  return useQuery({
    enabled: q !== "",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['repo', q],
    queryFn: async () => {
      const { data } = await GHApi.get<Response>(
        `/search/repositories?q=${q}`
      );
      return data;
    }
  });
}