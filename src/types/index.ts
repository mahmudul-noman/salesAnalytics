// DATA TYPES INTERFACE
export interface SalesData {
  _id: string;
  date: string;
  price: number;
  customerEmail: string;
  customerPhone: string;
  __v: number;
}

// TOTAL SALES DATA INTERFACE
// Aggregated daily sales data for chart visualization
export interface TotalSalesData {
  day: string;
  totalSale: number;
}

// API RESPONSE INTERFACE
// Structure of the response from the API
export interface ApiResponse {
  results: {
    TotalSales: TotalSalesData[];
    Sales: SalesData[];
  };
  pagination: {
    before: string;
    after: string;
  };
}

// AUTH RESPONSE INTERFACE
// Structure of the response from the authentication API
export interface AuthResponse {
  token: string;
  expire: number;
}

// FILTER PARAMETERS INTERFACE
// Structure of the filter parameters for the API
export interface FilterParams {
  startDate: string;
  endDate: string;
  priceMin: string;
  email: string;
  phone: string;
  sortBy: 'date' | 'price';
  sortOrder: 'asc' | 'desc';
  after?: string;
  before?: string;
}