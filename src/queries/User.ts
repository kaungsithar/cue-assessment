import { useMutation, useQuery } from "@tanstack/react-query";
import axios from 'axios'

export interface User {
  node_id: string;
  avatar_url: string;
  name: string;
}

export function useUser() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axios.get<User>(
        "https://jsonplaceholder.typicode.com/posts"
      );
      return data;
    },
  });
}

export function useMutateUser() {
  return useMutation({
    mutationFn: async (token: string) => {
      return axios.get<User>(`https://api.github.com/user`, { headers: { 'Authorization': 'Bearer ' + token } });
    }
  })
} 