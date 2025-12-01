import { AuthResponse, ApiResponse, FilterParams } from '../types';

const API_BASE_URL = 'https://autobizz-425913.uc.r.appspot.com';

let authToken: string | null = null;
let tokenExpiry: number = 0;

export const getAuthToken = async (): Promise<string> => {
  // Check if we have a valid token
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/getAuthorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenType: 'frontEndTest',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get authorization token');
    }

    const data: AuthResponse = await response.json();
    authToken = data.token;
    tokenExpiry = Date.now() + (data.expire * 1000) - 60000; // Refresh 1 minute before expiry
    
    return authToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};

export const getSalesData = async (params: FilterParams): Promise<ApiResponse> => {
  try {
    const token = await getAuthToken();
    
    const queryParams = new URLSearchParams();
    
    // Include ALL parameters, with empty string for undefined/null values
    const allParams = {
      startDate: params.startDate || '',
      endDate: params.endDate || '',
      priceMin: params.priceMin || '',
      email: params.email || '',
      phone: params.phone || '',
      sortBy: params.sortBy || '',
      sortOrder: params.sortOrder || '',
      after: params.after || '',
      before: params.before || '',
    };
    
    // Append all parameters regardless of value
    Object.entries(allParams).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    const response = await fetch(`${API_BASE_URL}/sales?${queryParams}`, {
      headers: {
        'X-AUTOBIZZ-TOKEN': token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sales data');
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sales data:', error);
    throw error;
  }
};