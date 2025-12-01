import useSWR from 'swr';
import { getSalesData } from '../services/api';
import { FilterParams } from '../types';

export const useSalesData = (params: FilterParams) => {
  const cacheKey = JSON.stringify(params);
  
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => getSalesData(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // Cache for 30 seconds
    }
  );

  return {
    data,
    error,
    isLoading,
    refetch: mutate,
  };
};