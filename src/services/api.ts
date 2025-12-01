// API SERVICE LAYER
// Manages API interactions and authentication for sales data
import { AuthResponse, ApiResponse, FilterParams } from '../types';

const API_BASE_URL = 'https://autobizz-425913.uc.r.appspot.com';

// AUTHENTICATION STATE
// Manages token storage and expiry
let authToken: string | null = null;
let tokenExpiry: number = 0;

// AUTHENTICATION FUNCTION
// Retrieves or generates an authentication token
export const getAuthToken = async (): Promise<string> => {
  // Check if we have a valid token
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  try {
    // FETCH TOKEN FROM API
    const response = await fetch(`${API_BASE_URL}/getAuthorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenType: 'frontEndTest',
      }),
    });

    // ERROR HANDLING
    if (!response.ok) {
      throw new Error('Failed to get authorization token');
    }

    // PARSE RESPONSE
    const data: AuthResponse = await response.json();
    authToken = data.token;
    tokenExpiry = Date.now() + (data.expire * 1000) - 60000; // Refresh 1 minute before expiry

    // RETURN TOKEN
    return authToken;
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};

// SALES DATA FETCH FUNCTION
// Retrieves sales data from the API with filtering and sorting
export const getSalesData = async (params: FilterParams): Promise<ApiResponse> => {
  try {
    // GET AUTHENTICATION TOKEN
    const token = await getAuthToken();

    // BUILD QUERY PARAMETERS
    const queryParams = new URLSearchParams();

    // INCLUDE ALL PARAMETERS, WITH EMPTY STRING FOR UNDEFINED/NULL VALUES
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

    // APPEND ALL PARAMETERS REGARDLESS OF VALUE
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