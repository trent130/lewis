import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../services/api';

export function useApi<T>(key: string[], url: string) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
    retry: 1,
    onError: (error: Error) => {
      toast.error(`Failed to fetch data: ${error.message}`);
    },
  });
}

export function useApiMutation<T, V>(
  key: string[],
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: V) => {
      const { data } = await api[method]<T>(url, variables);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: key });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
}