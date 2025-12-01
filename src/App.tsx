import React, { useState, useCallback, useEffect } from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';
import FilterPanel from './components/FilterPanel';
import SalesChart from './components/SalesChart';
import SalesTable from './components/SalesTable';
import { useSalesData } from './hooks/useSalesData';
import { FilterParams } from './types';

function App() {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: '',
    endDate: '',
    priceMin: '',
    email: '',
    phone: '',
    sortBy: 'date',
    sortOrder: 'asc',
    after: '',
    before: '',
  });

  const { data, error, isLoading, refetch } = useSalesData(filters);

  const handleFiltersChange = useCallback((newFilters: Partial<FilterParams>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleSearch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Auto-fetch when filters change (except for manual pagination)
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500); // Debounce API calls

    return () => clearTimeout(timer);
  }, [filters, refetch]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">
            Failed to load sales data. Please check your connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AutoBizz Sales Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">Track and analyze your sales performance</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          isLoading={isLoading}
        />

        {/* Chart */}
        <SalesChart
          data={data?.results.TotalSales || []}
          isLoading={isLoading}
        />

        {/* Table */}
        <SalesTable
          data={data?.results.Sales || []}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          pagination={data?.pagination || { before: '', after: '' }}
          isLoading={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 AutoBizz Sales Analytics. Built by Mahmudul Hasan Noman</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;