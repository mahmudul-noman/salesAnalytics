export interface SalesData {
  _id: string;
  date: string;
  price: number;
  customerEmail: string;
  customerPhone: string;
  __v: number;
}

export interface TotalSalesData {
  day: string;
  totalSale: number;
}

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

export interface AuthResponse {
  token: string;
  expire: number;
}

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