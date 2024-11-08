import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { AxiosError } from 'axios';

export function useApi<T>(
  key: string[], 
  url: string, 
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await api.get<T>(url);
      return data;
    },
    // retry: 1,
    // onError: (error: AxiosError) => {
    //   toast.error(`Failed to fetch data: ${error.message}`);
    // },
    // ...options,
  });
}

export function useApiMutation<T, V>(
  key: string[],
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  options?: Omit<UseMutationOptions<T, AxiosError, V>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, V>({
    mutationFn: async (variables: V) => {
      const { data } = await api[method]<T>(url, variables);
      return data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: key });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error: AxiosError, variables, context) => {
      toast.error(`Operation failed: ${error.message}`);
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

// New function for optimistic updates
export function useApiMutationOptimistic<T, V>(
  key: string[],
  url: string,
  method: 'post' | 'put' | 'patch' | 'delete' = 'post',
  updateFunction: (oldData: T | undefined, newData: V) => T,
  options?: Omit<UseMutationOptions<T, AxiosError, V>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, V>({
    mutationFn: async (variables: V) => {
      const { data } = await api[method]<T>(url, variables);
      return data;
    },
    onMutate: async (newData: V) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previousData = queryClient.getQueryData<T>(key);
      queryClient.setQueryData<T>(key, (old) => updateFunction(old, newData));
      return { previousData };
    },
    onError: (err, newData, context: any) => {
      queryClient.setQueryData(key, context.previousData);
      toast.error(`Operation failed: ${err.message}`);
      options?.onError?.(err, newData, context);
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(key, data);
      options?.onSuccess?.(data, variables, context);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
    ...options,
  });
}