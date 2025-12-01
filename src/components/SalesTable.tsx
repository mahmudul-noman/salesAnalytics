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

// DATA TABLE COMPONENT WITH SORTING AND PAGINATION
// Displays sales records with interactive controls and visual styling
const SalesTable: React.FC<SalesTableProps> = ({
  data,
  filters,
  onFiltersChange,
  pagination,
  isLoading,
}) => {
  // SORTING HANDLERS
  // Toggle sort direction or switch column, reset pagination on sort change
  const handleSort = (column: 'date' | 'price') => {
    const newOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({
      sortBy: column,
      sortOrder: newOrder,
      after: '',
      before: '',
    });
  };

  // PAGINATION HANDLERS
  // Navigate using cursor-based pagination tokens from API
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

  // VISUAL INDICATORS FOR SORTING
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

  // LOADING STATE UI
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[rgba(0,178,174,0.3)]">
        {/* HEADER WITH DISABLED CONTROLS */}
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

  // MAIN TABLE UI
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[rgba(0,178,174,0.3)] hover:border-[rgba(0,178,174,0.5)] transition-all duration-300">
      {/* ENHANCED TABLE HEADER WITH INTEGRATED CONTROLS - RESPONSIVE */}
      <div className="p-4 md:p-6 border-b border-[rgba(0,178,174,0.2)] bg-gradient-to-r from-[rgba(0,178,174,0.05)] to-[rgba(0,116,186,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* LEFT SIDE: TITLE AND INFO */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-[#00b2ae] to-[#0074ba] shadow-md flex-shrink-0">
              <Table className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-[#00b2ae] to-[#0074ba] text-transparent bg-clip-text truncate">
                Sales Data
              </h2>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                <p className="text-xs md:text-sm text-[#6b7280] whitespace-nowrap">
                  Showing <span className="font-medium text-[#0074ba]">{data.length} items</span>
                </p>
                {filters.sortBy && (
                  <>
                    <div className="hidden md:block w-px h-3 bg-gray-300"></div>
                    <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                      {getSortIcon()}
                      <span className="truncate">{getSortLabel()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SORTING CONTROLS AND STATUS */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {/* Sorting Controls - Responsive Layout */}
            <div className="flex flex-col w-full sm:w-auto">
              <div className="flex items-center justify-between sm:justify-end gap-2">
                {/* Sort Label - Hidden on mobile, shown on sm+ */}
                <span className="hidden sm:block text-sm font-medium text-gray-700 whitespace-nowrap">Sort by:</span>

                {/* Sort Buttons Container */}
                <div className="flex items-center flex-1 sm:flex-none">
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 w-full sm:w-auto">
                    {/* Date Sort Button */}
                    <button
                      onClick={() => handleSort('date')}
                      className={`
                  px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 
                  flex items-center justify-center gap-1.5 flex-1 sm:flex-none min-w-[60px] sm:min-w-0
                  ${filters.sortBy === 'date'
                          ? 'bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] text-[#0074ba] border border-[rgba(0,178,174,0.3)]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#0074ba]'
                        }
                  hover:shadow-sm active:scale-[0.98]
                `}
                    >
                      <span className="truncate">Date</span>
                      {filters.sortBy === 'date' && (
                        <div className="hidden sm:flex flex-col -space-y-1 flex-shrink-0">
                          <ChevronUp className={`w-3 h-3 ${filters.sortOrder === 'asc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                          <ChevronDown className={`w-3 h-3 ${filters.sortOrder === 'desc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                        </div>
                      )}
                    </button>

                    {/* Divider - Hide on very small screens */}
                    <div className="w-px h-4 bg-gray-300 mx-1 sm:mx-2"></div>

                    {/* Price Sort Button */}
                    <button
                      onClick={() => handleSort('price')}
                      className={`
                  px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 
                  flex items-center justify-center gap-1.5 flex-1 sm:flex-none min-w-[60px] sm:min-w-0
                  ${filters.sortBy === 'price'
                          ? 'bg-gradient-to-r from-[rgba(0,178,174,0.1)] to-[rgba(0,116,186,0.1)] text-[#0074ba] border border-[rgba(0,178,174,0.3)]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#0074ba]'
                        }
                  hover:shadow-sm active:scale-[0.98]
                `}
                    >
                      <span className="truncate">Price</span>
                      {filters.sortBy === 'price' && (
                        <div className="hidden sm:flex flex-col -space-y-1 flex-shrink-0">
                          <ChevronUp className={`w-3 h-3 ${filters.sortOrder === 'asc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                          <ChevronDown className={`w-3 h-3 ${filters.sortOrder === 'desc' ? 'text-[#0074ba]' : 'text-gray-400'}`} />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Reset Button - Smaller on mobile */}
                  {filters.sortBy && (
                    <button
                      onClick={() => handleSort('date')}
                      className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors flex items-center gap-1 flex-shrink-0"
                      title="Reset to default sort"
                    >
                      <span className="text-xs">↺</span>
                      <span className="hidden xs:inline">Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Status - Mobile Only (shown below sort controls) */}
              {filters.sortBy && (
                <div className="sm:hidden flex items-center gap-1 text-xs text-gray-600 mt-2 pl-1">
                  {getSortIcon()}
                  <span className="truncate">Sorted by {getSortLabel()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
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
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ENHANCED PAGINATION */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[rgba(0,178,174,0.05)] to-[rgba(0,116,186,0.05)] border-t border-[rgba(0,178,174,0.2)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          {/* Left Section - Item Count & Status */}
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-xs sm:text-sm text-[#6b7280]">
                <span className="font-medium text-[#0074ba]">{data.length}</span>
                <span className="hidden xs:inline"> of up to 50 items per page</span>
                <span className="xs:hidden">/50</span>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00b2ae] animate-pulse"></div>
                <span className="text-xs text-[#9ca3af]">Live Updates</span>
              </div>
            </div>

            {/* Mobile-only Live Indicator */}
            <div className="sm:hidden flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00b2ae] animate-pulse"></div>
              <span className="text-[10px] text-[#9ca3af]">Live</span>
            </div>
          </div>

          {/* Right Section - Pagination Controls */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={!pagination.before}
              className={`
          flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium rounded-lg 
          flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 
          ${!pagination.before
                  ? 'opacity-50 cursor-not-allowed bg-white border border-[#d1d5db] text-[#9ca3af]'
                  : 'bg-white border border-[#00b2ae] text-[#0074ba] hover:bg-gradient-to-r hover:from-[rgba(0,178,174,0.05)] hover:to-[rgba(0,116,186,0.05)] active:scale-[0.98] sm:hover:shadow-md sm:hover:border-[#0074ba] sm:transform sm:hover:-translate-x-1'
                }
        `}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold hidden xs:inline">Previous</span>
              <span className="text-xs sm:text-sm font-semibold xs:hidden">Prev</span>
            </button>

            {/* Vertical Divider - Hidden on mobile */}
            <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-[#00b2ae] to-[#0074ba]"></div>

            {/* Mobile Divider */}
            <div className="sm:hidden w-2"></div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={!pagination.after}
              className={`
          flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium rounded-lg 
          flex items-center justify-center gap-1 sm:gap-2 transition-all duration-300 
          ${!pagination.after
                  ? 'opacity-50 cursor-not-allowed bg-white border border-[#d1d5db] text-[#9ca3af]'
                  : 'bg-white border border-[#00b2ae] text-[#0074ba] hover:bg-gradient-to-r hover:from-[rgba(0,178,174,0.05)] hover:to-[rgba(0,116,186,0.05)] active:scale-[0.98] sm:hover:shadow-md sm:hover:border-[#0074ba] sm:transform sm:hover:translate-x-1'
                }
        `}
            >
              <span className="text-xs sm:text-sm font-semibold">Next</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER WITH SUBTLE GRADIENT */}
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