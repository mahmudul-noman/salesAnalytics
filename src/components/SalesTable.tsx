import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Table } from 'lucide-react';
import { SalesData, FilterParams } from '../types';
import { format } from 'date-fns';

interface SalesTableProps {
  data: SalesData[];
  filters: FilterParams;
  onFiltersChange: (filters: Partial<FilterParams>) => void;
  pagination: {
    before: string;
    after: string;
  };
  isLoading: boolean;
}

const SalesTable: React.FC<SalesTableProps> = ({
  data,
  filters,
  onFiltersChange,
  pagination,
  isLoading,
}) => {
  const handleSort = (column: 'date' | 'price') => {
    const newOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({
      sortBy: column,
      sortOrder: newOrder,
      after: '',
      before: '',
    });
  };

  const handlePrevious = () => {
    onFiltersChange({
      before: pagination.before,
      after: '',
    });
  };

  const handleNext = () => {
    onFiltersChange({
      after: pagination.after,
      before: '',
    });
  };

  const getSortIcon = (column: 'date' | 'price') => {
    if (filters.sortBy !== column) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return filters.sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-600" /> : 
      <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Table className="w-5 h-5 text-blue-600" />
          Sales Data ({data.length} items)
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                >
                  Date {getSortIcon('date')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                >
                  Price {getSortIcon('price')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((sale, index) => (
              <tr key={sale._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(sale.date), 'MMM dd, yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  ${sale.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sale.customerEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sale.customerPhone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing up to 50 items per page
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!pagination.before || isLoading}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!pagination.after || isLoading}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTable;