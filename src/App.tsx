import React, { useState, useCallback, useEffect } from 'react';
import { BarChart3, AlertCircle, Users } from 'lucide-react';
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
          <AlertCircle className="w-12 h-12 text-[#dc3545] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#333] mb-2">Error Loading Data</h2>
          <p className="text-[#6b7280] mb-4">
            Failed to load sales data. Please check your connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gradient-to-r from-[#00b2ae] to-[#0074ba] text-white rounded-lg hover:opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 shadow-lg" style={{ 
        background: 'linear-gradient(135deg, #00b2ae 0%, #0074ba 100%)',
        borderBottomColor: 'rgba(255, 255, 255, 0.2)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AutoBizz Analytics</h1>
                <p className="text-sm text-white/90">Real-time Sales Dashboard</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/30">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">AutoBizz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="mb-8">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/* Chart */}
        <div className="mb-8">
          <SalesChart
            data={data?.results.TotalSales || []}
            isLoading={isLoading}
          />
        </div>

        {/* Table */}
        <div>
          <SalesTable
            data={data?.results.Sales || []}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            pagination={data?.pagination || { before: '', after: '' }}
            isLoading={isLoading}
          />
        </div>
      </main>

      <footer className="mt-16 bg-gradient-to-r from-[#00b2ae] to-[#0074ba]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white">
            <p className="text-sm opacity-90">© 2025 AutoBizz Sales Analytics Platform</p>
            <p className="text-xs opacity-75 mt-1">Built by Mahmudul Hasan Noman • Frontend Engineer</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <a href="https://autobizz.net/" target='_blank' className="text-xs opacity-75 hover:opacity-100 transition-opacity">
              AutoBizz
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;