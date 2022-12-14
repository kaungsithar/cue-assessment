import { useQuery } from "@tanstack/react-query";
import GHApi from "../utils/axios";

export interface Label {
    id: number;
    node_id: string;
    url: string;
    name: string;
    description: string;
    color: string;
    default: boolean;
  }

export function useLabelsQuery(ownerRepo: string) {
    return useQuery({
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      queryKey: ['labels', ownerRepo],
      queryFn: async () => {
        const { data } = await GHApi.get<Label[]>(
          `/repos/${ownerRepo}/labels?per_page=100`
        );
        return data;
      }
    });
  }