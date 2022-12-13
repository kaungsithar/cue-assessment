import { useQuery } from '@tanstack/react-query';
import GHApi from '../utils/axios';

// interface Response {
//   incomplete_results: boolean;
//   items: Repo[];
//   total_count: number;
// }

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
    state: string;
}

export function usePRsQuery(q: string, ownerRepo: string, state: string) {
  return useQuery({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryKey: ['issues', q, ownerRepo,state],
    queryFn: async () => {
      const { data } = await GHApi.get<Issue[]>(
        `/repos/${ownerRepo}/issues?state=${state}`
      );
      return data;
    }
  });
}