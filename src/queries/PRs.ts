import { useQuery } from '@tanstack/react-query';
import GHApi from '../utils/axios';
import { Label } from './labels';


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