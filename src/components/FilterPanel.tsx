// src\components\FilterPanel.tsx
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Mail,
  Phone,
  Search,
  Calendar as CalendarIcon,
  X,
  Filter,
} from "lucide-react";
import { FilterParams } from "../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FilterPanelProps {
  filters: FilterParams;
  onFiltersChange: (filters: Partial<FilterParams>) => void;
  onSearch: () => void;
  isLoading: boolean;
}

// Custom header component with month/year dropdowns
const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: any) => {
  const years = Array.from(
    { length: 20 },
    (_, i) => new Date().getFullYear() - 10 + i
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div
      style={{
        margin: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: prevMonthButtonDisabled ? "not-allowed" : "pointer",
          color: "white",
          fontSize: "1rem",
          padding: "4px 8px",
          borderRadius: "4px",
          opacity: prevMonthButtonDisabled ? 0.5 : 1,
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => !prevMonthButtonDisabled && (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        {"<"}
      </button>
      <div style={{ display: "flex", gap: "10px" }}>
        <select
          value={months[date.getMonth()]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
          style={{
            border: "1px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "4px",
            padding: "4px 8px",
            backgroundColor: "white",
            color: "#0074BA",
            fontWeight: "500",
            cursor: "pointer",
            outline: "none",
            minWidth: "100px",
          }}
        >
          {months.map((option) => (
            <option key={option} value={option} style={{ color: "#0074BA" }}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={date.getFullYear()}
          onChange={({ target: { value } }) => changeYear(value)}
          style={{
            border: "1px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "4px",
            padding: "4px 8px",
            backgroundColor: "white",
            color: "#0074BA",
            fontWeight: "500",
            cursor: "pointer",
            outline: "none",
            minWidth: "80px",
          }}
        >
          {years.map((option) => (
            <option key={option} value={option} style={{ color: "#0074BA" }}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: nextMonthButtonDisabled ? "not-allowed" : "pointer",
          color: "white",
          fontSize: "1rem",
          padding: "4px 8px",
          borderRadius: "4px",
          opacity: nextMonthButtonDisabled ? 0.5 : 1,
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => !nextMonthButtonDisabled && (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
      >
        {">"}
      </button>
    </div>
  );
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  isLoading,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterParams>(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const gradientStyle = {
    background: "linear-gradient(90deg, rgb(0, 178, 174), rgb(0, 116, 186))",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
  };

  const borderFocusStyle = {
    borderColor: "#0074ba",
    boxShadow: "0 0 0 2px rgba(0, 116, 186, 0.2)",
  };

  const inputBaseStyle = {
    borderColor: "rgba(0, 178, 174, 0.3)",
  };

  // Handle local filter changes
  const handleLocalFilterChange = (newFilters: Partial<FilterParams>) => {
    setLocalFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Handle search button click
  const handleSearchClick = () => {
    // Apply all local filters at once
    onFiltersChange(localFilters);
    // Trigger search
    onSearch();
  };

  // Check if any filter is active (using local filters for UI display)
  const hasActiveFilters = () => {
    return (
      localFilters.startDate ||
      localFilters.endDate ||
      localFilters.priceMin ||
      localFilters.email ||
      localFilters.phone
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      startDate: "",
      endDate: "",
      priceMin: "",
      email: "",
      phone: "",
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  // Remove individual filter
  const handleRemoveFilter = (filterKey: keyof FilterParams) => {
    const updatedFilters = { ...localFilters, [filterKey]: "" };
    setLocalFilters(updatedFilters);
    onFiltersChange({ [filterKey]: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <style>
        {`
        /* Custom styles for react-datepicker */
        .react-datepicker-wrapper {
          width: 100%;
          z-index: 1000;
        }

        .react-datepicker__input-container input {
          width: 100%;
          height: 42px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid rgba(0, 178, 174, 0.3);
          background-color: transparent;
          font-size: 0.9rem;
          color: #333;
          cursor: pointer;
          z-index: 1001;
          transition: all 0.2s ease;
        }

        .react-datepicker__input-container input:focus {
          outline: none;
          border-color: #0074ba !important;
          box-shadow: 0 0 0 2px rgba(0, 116, 186, 0.2) !important;
          z-index: 1001;
        }

        .react-datepicker__input-container input:hover {
          border-color: rgba(0, 178, 174, 0.5);
        }

        .react-datepicker {
          font-family: inherit;
          border-radius: 8px;
          border: 1px solid rgba(0, 178, 174, 0.3);
          box-shadow: 0 4px 20px rgba(0, 116, 186, 0.15);
          background: white;
          position: relative;
          z-index: 99999 !important;
        }

        .react-datepicker__header {
          background: linear-gradient(90deg, rgb(0, 178, 174), rgb(0, 116, 186));
          border-bottom: none;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          padding-top: 10px;
          position: relative;
          z-index: 99999;
        }

        .react-datepicker__current-month {
          color: white;
          font-weight: bold;
          display: none; /* Hide default month display since we have dropdowns */
        }

        .react-datepicker__day-name {
          color: white;
        }

        .react-datepicker__day--selected {
          background-color: #00b2ae;
          border-radius: 50%;
          color: white;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: rgba(0, 178, 174, 0.2);
          border-radius: 50%;
        }

        .react-datepicker__day:hover {
          background-color: rgba(0, 178, 174, 0.1);
          border-radius: 50%;
        }

        .react-datepicker__navigation {
          top: 10px;
          z-index: 99999;
          display: none; /* Hide default arrows since we have custom ones */
        }

        .react-datepicker__navigation-icon::before {
          border-color: white;
        }

        .react-datepicker__navigation:hover *::before {
          border-color: rgba(255, 255, 255, 0.8);
        }

        .react-datepicker-popper {
          z-index: 99999 !important;
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(0, 0);
        }

        .react-datepicker-popper[data-placement^="bottom"] {
          margin-top: 10px;
        }

        .react-datepicker-popper[data-placement^="top"] {
          margin-bottom: 10px;
        }

        .react-datepicker__tab-loop {
          position: absolute;
          z-index: 99999 !important;
        }

        .react-datepicker__month-container {
          position: relative;
          z-index: 99999;
        }

        .react-datepicker__month {
          position: relative;
          z-index: 99999;
        }

        .react-datepicker__week {
          position: relative;
          z-index: 99999;
        }

        .react-datepicker__day {
          position: relative;
          z-index: 99999;
        }

        .date-filter-container {
          animation: fadeIn 0.5s ease-out forwards;
          position: relative;
          z-index: 100;
        }

        .date-picker-container {
          position: relative;
          z-index: 1000;
        }

        .date-picker-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          position: relative;
          z-index: 1001;
        }

        .date-range-error {
          position: absolute;
          bottom: -20px;
          left: 0;
          font-size: 0.75rem;
          color: #dc3545;
          z-index: 1001;
        }

        .MuiPaper-root {
          z-index: auto !important;
        }

        .MuiTableContainer-root {
          z-index: auto !important;
        }

        .MuiTable-root {
          z-index: auto !important;
        }

        .MuiTableCell-root {
          z-index: auto !important;
        }

        .react-datepicker__portal {
          z-index: 99999 !important;
        }

        /* Calendar icon inside datepicker input */
        .react-datepicker__input-container {
          position: relative;
        }

        .react-datepicker__input-container::after {
          content: '';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          background: linear-gradient(90deg, rgb(0, 178, 174), rgb(0, 116, 186));
          -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E") no-repeat center;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E") no-repeat center;
          pointer-events: none;
        }

        /* Custom styles for all input fields */
        .filter-input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(0, 178, 174, 0.3);
          background-color: transparent;
          font-size: 0.9rem;
          color: #333;
          transition: all 0.2s ease;
        }

        .filter-input:focus {
          outline: none;
          border-color: #0074ba;
          box-shadow: 0 0 0 2px rgba(0, 116, 186, 0.2);
        }

        .filter-input:hover {
          border-color: rgba(0, 178, 174, 0.5);
        }

        .filter-input::placeholder {
          color: #9ca3af;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-bottom: 0.375rem;
          font-size: 0.875rem;
          fontWeight: 500,
          color: #374151,
        }

        .filter-icon {
          width: 16px;
          height: 16px;
        }

        /* Active filter tags */
        .filter-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: linear-gradient(90deg, rgba(0, 178, 174, 0.1), rgba(0, 116, 186, 0.1));
          border: 1px solid rgba(0, 178, 174, 0.2);
          border-radius: 6px;
          font-size: 0.8rem;
          color: #0074ba;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          transition: all 0.2s ease;
        }

        .filter-tag:hover {
          background: linear-gradient(90deg, rgba(0, 178, 174, 0.15), rgba(0, 116, 186, 0.15));
          border-color: rgba(0, 178, 174, 0.3);
        }

        .filter-tag-remove {
          background: none;
          border: none;
          color: #0074ba;
          cursor: pointer;
          padding: 0.125rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .filter-tag-remove:hover {
          background-color: rgba(0, 178, 174, 0.1);
          color: #00b2ae;
        }

        .clear-all-btn {
          background: none;
          border: 1px solid #e5e7eb;
          color: #6b7280;
          padding: 0.375rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .clear-all-btn:hover {
          background-color: #f3f4f6;
          border-color: #d1d5db;
          color: #374151;
        }

        /* Visual indicator for unsaved filters */
        .unsaved-filter {
          border-color: #f59e0b !important;
        }

        .unsaved-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 12px;
          height: 12px;
          background-color: #f59e0b;
          border-radius: 50%;
          border: 2px solid white;
        }
        `}
      </style>

      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Search className="w-5 h-5" style={gradientStyle} />
        <span style={gradientStyle}>Filters</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Date Range - Start Date */}
        <div className="space-y-1 relative">
          <label className="filter-label">
            <CalendarIcon
              className="filter-icon"
              style={{ color: "rgb(0, 116, 186)" }}
            />
            Start Date
          </label>
          <div className="date-filter-container">
            <DatePicker
              selected={localFilters.startDate ? new Date(localFilters.startDate) : null}
              onChange={(date: Date | null) => {
                handleLocalFilterChange({
                  startDate: date ? date.toISOString().split("T")[0] : "",
                });
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select start date"
              className="filter-input"
              maxDate={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
              renderCustomHeader={CustomHeader}
              showPopperArrow={false}
            />
          </div>
        </div>

        {/* Date Range - End Date */}
        <div className="space-y-1 relative">
          <label className="filter-label">
            <CalendarIcon
              className="filter-icon"
              style={{ color: "rgb(0, 116, 186)" }}
            />
            End Date
          </label>
          <div className="date-filter-container">
            <DatePicker
              selected={localFilters.endDate ? new Date(localFilters.endDate) : null}
              onChange={(date: Date | null) => {
                handleLocalFilterChange({
                  endDate: date ? date.toISOString().split("T")[0] : "",
                });
              }}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select end date"
              className="filter-input"
              minDate={
                localFilters.startDate ? new Date(localFilters.startDate) : undefined
              }
              renderCustomHeader={CustomHeader}
              showPopperArrow={false}
            />
          </div>
        </div>

        {/* Additional Filters */}
        <div className="space-y-1 relative">
          <label className="filter-label">
            <DollarSign
              className="filter-icon"
              style={{ color: "rgb(0, 116, 186)" }}
            />
            Min Price
          </label>
          <input
            type="number"
            placeholder="Enter min price"
            value={localFilters.priceMin}
            onChange={(e) => handleLocalFilterChange({ priceMin: e.target.value })}
            className="filter-input"
            style={inputBaseStyle}
          />
        </div>

        <div className="space-y-1 relative">
          <label className="filter-label">
            <Mail
              className="filter-icon"
              style={{ color: "rgb(0, 116, 186)" }}
            />
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={localFilters.email}
            onChange={(e) => handleLocalFilterChange({ email: e.target.value })}
            className="filter-input"
            style={inputBaseStyle}
          />
        </div>

        <div className="space-y-1 relative">
          <label className="filter-label">
            <Phone
              className="filter-icon"
              style={{ color: "rgb(0, 116, 186)" }}
            />
            Phone
          </label>
          <input
            type="tel"
            placeholder="Enter phone"
            value={localFilters.phone}
            onChange={(e) => handleLocalFilterChange({ phone: e.target.value })}
            className="filter-input"
            style={inputBaseStyle}
          />
        </div>

        {/* Search Button in the same row */}
        <div className="flex flex-col justify-end">
          <label className="filter-label opacity-0">
            <Search className="filter-icon" />
            Action
          </label>
          <button
            onClick={handleSearchClick}
            disabled={isLoading}
            className="px-6 py-2.5 text-white font-medium rounded-lg focus:ring-2 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] h-[42px]"
            style={{
              background:
                "linear-gradient(90deg, rgb(0, 178, 174), rgb(0, 116, 186))",
              boxShadow: "0 4px 12px rgba(0, 116, 186, 0.2)",
            }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isLoading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
            </div>
            <button
              onClick={handleClearFilters}
              className="clear-all-btn"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {localFilters.startDate && (
              <div className="filter-tag">
                <span>Start: {formatDate(localFilters.startDate)}</span>
                <button
                  onClick={() => handleRemoveFilter("startDate")}
                  className="filter-tag-remove"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {localFilters.endDate && (
              <div className="filter-tag">
                <span>End: {formatDate(localFilters.endDate)}</span>
                <button
                  onClick={() => handleRemoveFilter("endDate")}
                  className="filter-tag-remove"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {localFilters.priceMin && (
              <div className="filter-tag">
                <span>Min Price: ${localFilters.priceMin}</span>
                <button
                  onClick={() => handleRemoveFilter("priceMin")}
                  className="filter-tag-remove"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {localFilters.email && (
              <div className="filter-tag">
                <span>Email: {localFilters.email}</span>
                <button
                  onClick={() => handleRemoveFilter("email")}
                  className="filter-tag-remove"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {localFilters.phone && (
              <div className="filter-tag">
                <span>Phone: {localFilters.phone}</span>
                <button
                  onClick={() => handleRemoveFilter("phone")}
                  className="filter-tag-remove"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;