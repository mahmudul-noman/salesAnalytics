// DATA FETCHING HOOK WITH SWR CACHING
import useSWR from 'swr';
import { getSalesData } from '../services/api';
import { FilterParams } from '../types';

export const useSalesData = (params: FilterParams) => {
  // CACHE KEY GENERATION
  const cacheKey = JSON.stringify(params);

  // SWR DATA FETCHING WITH CACHING CONFIGURATION
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    () => getSalesData(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // Cache for 30 seconds
    }
  );
  // RETURN VALUE INTERFACE
  return {
    data,
    error,
    isLoading,
    refetch: mutate,
  };
};