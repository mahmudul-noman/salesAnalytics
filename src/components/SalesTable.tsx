// src/components/SalesTable.tsx
import React from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Table, SortAsc, SortDesc } from 'lucide-react';
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

  // Get current sort icon
  const getSortIcon = () => {
    if (!filters.sortBy) return null;
    return filters.sortOrder === 'asc' ?
      <SortAsc className="w-4 h-4 text-[#0074ba]" /> :
      <SortDesc className="w-4 h-4 text-[#0074ba]" />;
  };

  // Get sort label
  const getSortLabel = () => {
    if (!filters.sortBy) return 'No sort applied';
    return `Sorted by ${filters.sortBy} (${filters.sortOrder})`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[rgba(0,178,174,0.3)]">
        {/* Header with integrated sorting - Always visible */}
        <div className="p-6 border-b border-[rgba(0,178,174,0.2)] bg-gradient-to-r from-[rgba(0,178,174,0.05)] to-[rgba(0,116,186,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-[#00b2ae] to-[#0074ba] shadow-md">
                <Table className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-[#00b2ae] to-[#0074ba] text-transparent bg-clip-text">
                  Sales Data
                </h2>
                <p className="text-sm text-[#6b7280] mt-1">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-[#00b2ae] border-t-transparent rounded-full animate-spin"></div>
                    Loading data...
                  </span>
                </p>
              </div>
            </div>

            {/* Sorting Controls in Header - Always visible */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleSort('date')}
                    disabled={isLoading}
                    className={`
                      px-3 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-1
                      ${filters.sortBy === 'date'
                        ? 'bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] text-[#0074ba]'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
                    `}
                  >
                    Date
                    {filters.sortBy === 'date' && getSortIcon()}
                  </button>
                  <button
                    onClick={() => handleSort('price')}
                    disabled={isLoading}
                    className={`
                      px-3 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-1
                      ${filters.sortBy === 'price'
                        ? 'bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] text-[#0074ba]'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}
                    `}
                  >
                    Price
                    {filters.sortBy === 'price' && getSortIcon()}
                  </button>
                </div>
                {filters.sortBy && (
                  <button
                    onClick={() => handleSort('date')}
                    disabled={isLoading}
                    className="ml-2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                    title="Reset sort"
                  >
                    ↺
                  </button>
                )}
              </div>

              <div className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 font-medium border border-gray-200">
                Loading...
              </div>
            </div>
          </div>
        </div>

        {/* Table Loading Skeleton */}
        <div className="animate-pulse">
          <div className="p-6">
            <div className="space-y-4">
              {/* Table header skeleton */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] rounded"></div>
                ))}
              </div>

              {/* Table rows skeleton */}
              <div className="space-y-4">
                {[...Array(5)].map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className={`h-10 rounded-lg ${rowIndex % 2 === 0 ? 'bg-[rgba(0,178,174,0.05)]' : 'bg-[rgba(0,116,186,0.05)]'}`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[rgba(0,178,174,0.3)] hover:border-[rgba(0,178,174,0.5)] transition-all duration-300">
      {/* Header with integrated sorting controls */}
      <div className="p-6 border-b border-[rgba(0,178,174,0.2)] bg-gradient-to-r from-[rgba(0,178,174,0.05)] to-[rgba(0,116,186,0.05)]">
        <div className="flex items-center justify-between">
          {/* Left side: Title and info */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[#00b2ae] to-[#0074ba] shadow-md">
              <Table className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-[#00b2ae] to-[#0074ba] text-transparent bg-clip-text">
                Sales Data
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-[#6b7280]">
                  Showing <span className="font-medium text-[#0074ba]">{data.length} items</span>
                </p>
                {filters.sortBy && (
                  <>
                    <div className="w-px h-3 bg-gray-300"></div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {getSortIcon()}
                      <span>{getSortLabel()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Sorting controls and status */}
          <div className="flex items-center gap-3">
            {/* Sorting Controls */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                  <button
                    onClick={() => handleSort('date')}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                      ${filters.sortBy === 'date'
                        ? 'bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] text-[#0074ba] border border-[rgba(0,178,174,0.3)]'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#0074ba]'
                      }
                      hover:shadow-sm active:scale-[0.98]
                    `}
                  >
                    <span>Date</span>
                    {filters.sortBy === 'date' && (
                      <div className="flex flex-col -space-y-1">
                        <ChevronUp className={`w-3 h-3 ${filters.sortOrder === 'asc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                        <ChevronDown className={`w-3 h-3 ${filters.sortOrder === 'desc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                      </div>
                    )}
                  </button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <button
                    onClick={() => handleSort('price')}
                    className={`
                      px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                      ${filters.sortBy === 'price'
                        ? 'bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] text-[#0074ba] border border-[rgba(0,178,174,0.3)]'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#0074ba]'
                      }
                      hover:shadow-sm active:scale-[0.98]
                    `}
                  >
                    <span>Price</span>
                    {filters.sortBy === 'price' && (
                      <div className="flex flex-col -space-y-1">
                        <ChevronUp className={`w-3 h-3 ${filters.sortOrder === 'asc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                        <ChevronDown className={`w-3 h-3 ${filters.sortOrder === 'desc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                      </div>
                    )}
                  </button>
                </div>

                {filters.sortBy && (
                  <button
                    onClick={() => handleSort('date')}
                    className="ml-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
                    title="Reset to default sort"
                  >
                    <span className="text-xs">↺</span>
                    Reset
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[rgba(0,178,174,0.08)] to-[rgba(0,116,186,0.08)]">
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#374151] uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="relative group">
                    Date
                    <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-[#00b2ae] to-[#0074ba] transition-all duration-300"></span>
                  </span>
                  {filters.sortBy === 'date' && (
                    <div className="flex flex-col -space-y-1">
                      <ChevronUp className={`w-3 h-3 ${filters.sortOrder === 'asc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                      <ChevronDown className={`w-3 h-3 ${filters.sortOrder === 'desc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#374151] uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="relative group">
                    Price
                    <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-[#00b2ae] to-[#0074ba] transition-all duration-300"></span>
                  </span>
                  {filters.sortBy === 'price' && (
                    <div className="flex flex-col -space-y-1">
                      <ChevronUp className={`w-3 h-3 ${filters.sortOrder === 'asc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                      <ChevronDown className={`w-3 h-3 ${filters.sortOrder === 'desc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#374151] uppercase tracking-wider">
                <span className="relative group">
                  Customer Email
                  <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-[#00b2ae] to-[#0074ba] transition-all duration-300"></span>
                </span>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#374151] uppercase tracking-wider">
                <span className="relative group">
                  Phone Number
                  <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-[#00b2ae] to-[#0074ba] transition-all duration-300"></span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(0,178,174,0.1)]">
            {data.map((sale, index) => (
              <tr
                key={sale._id}
                className={`
                  hover:bg-gradient-to-r hover:from-[rgba(0,178,174,0.05)] hover:to-[rgba(0,116,186,0.05)] 
                  transition-all duration-300 group
                  ${index % 2 === 0 ? 'bg-white' : 'bg-[#f3f4f6]'}
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#00b2ae] to-[#0074ba]"></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#333]">
                        {format(new Date(sale.date), 'MMM dd, yyyy')}
                      </span>
                      <span className="text-xs text-[#9ca3af]">
                        {format(new Date(sale.date), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] border border-[rgba(0,178,174,0.2)]">
                    <span className="text-sm font-bold bg-gradient-to-r from-[#00b2ae] to-[#0074ba] text-transparent bg-clip-text">
                      {sale.price.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] flex items-center justify-center">
                      <span className="text-xs font-medium text-[#0074ba]">
                        {sale.customerEmail.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-[#374151] font-medium group-hover:text-[#0074ba] transition-colors">
                        {sale.customerEmail}
                      </span>
                      <span className="text-xs text-gray-500">Customer</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)]">
                      <svg className="w-4 h-4 text-[#0074ba]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#333]">
                        {sale.customerPhone}
                      </span>
                      <span className="text-xs text-gray-500">Primary</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      <div className="px-6 py-4 bg-gradient-to-r from-[rgba(0,178,174,0.05)] to-[rgba(0,116,186,0.05)] border-t border-[rgba(0,178,174,0.2)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm text-[#6b7280]">
              <span className="font-medium text-[#0074ba]">{data.length}</span> of up to 50 items per page
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#00b2ae] animate-pulse"></div>
              <span className="text-xs text-[#9ca3af]">Live Updates</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={!pagination.before}
              className={`
                px-4 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2
                transition-all duration-300 transform hover:-translate-x-1 disabled:transform-none
                ${!pagination.before
                  ? 'opacity-50 cursor-not-allowed bg-white border border-[#d1d5db] text-[#9ca3af]'
                  : 'bg-white border border-[#00b2ae] text-[#0074ba] hover:bg-gradient-to-r hover:from-[rgba(0,178,174,0.05)] hover:to-[rgba(0,116,186,0.05)] hover:shadow-md hover:border-[#0074ba] active:scale-[0.98]'
                }
              `}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-semibold">Previous</span>
            </button>
            <div className="w-px h-6 bg-gradient-to-b from-[#00b2ae] to-[#0074ba]"></div>
            <button
              onClick={handleNext}
              disabled={!pagination.after}
              className={`
                px-4 py-2.5 text-sm font-medium rounded-lg flex items-center gap-2
                transition-all duration-300 transform hover:translate-x-1 disabled:transform-none
                ${!pagination.after
                  ? 'opacity-50 cursor-not-allowed bg-white border border-[#d1d5db] text-[#9ca3af]'
                  : 'bg-white border border-[#00b2ae] text-[#0074ba] hover:bg-gradient-to-r hover:from-[rgba(0,178,174,0.05)] hover:to-[rgba(0,116,186,0.05)] hover:shadow-md hover:border-[#0074ba] active:scale-[0.98]'
                }
              `}
            >
              <span className="font-semibold">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer with subtle gradient */}
      <div className="h-1 bg-gradient-to-r from-[#00b2ae] via-[#0074ba] to-[#00b2ae] animate-gradient-x"></div>
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SalesTable;