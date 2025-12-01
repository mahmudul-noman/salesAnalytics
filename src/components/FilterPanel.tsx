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
import "../components/styles/FilterPanel.css";

interface FilterPanelProps {
  filters: FilterParams;
  onFiltersChange: (filters: Partial<FilterParams>) => void;
  onSearch: () => void;
  isLoading: boolean;
}

// CUSTOM DATE PICKER HEADER COMPONENT
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

// MAIN FILTER PANEL COMPONENT
const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  isLoading,
}) => {
  // LOCAL STATE MANAGEMENT
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

  const inputBaseStyle = {
    borderColor: "rgba(0, 178, 174, 0.3)",
  };

  // HELPER FUNCTIONS
  // Handle individual filter changes without committing to parent
  const handleLocalFilterChange = (newFilters: Partial<FilterParams>) => {
    setLocalFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Apply all local filters and trigger search
  const handleSearchClick = () => {
    // Apply all local filters at once
    onFiltersChange(localFilters);
    // Trigger search
    onSearch();
  };

  // Check if any filters are currently set (for UI display)
  const hasActiveFilters = () => {
    return (
      localFilters.startDate ||
      localFilters.endDate ||
      localFilters.priceMin ||
      localFilters.email ||
      localFilters.phone
    );
  };

  // Format dates for user-friendly display in active filters section
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Clear all filters and reset state
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

  // Remove individual filter while keeping others
  const handleRemoveFilter = (filterKey: keyof FilterParams) => {
    const updatedFilters = { ...localFilters, [filterKey]: "" };
    setLocalFilters(updatedFilters);
    onFiltersChange({ [filterKey]: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      {/* FILTER PANEL HEADER */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Search className="w-5 h-5" style={gradientStyle} />
        <span style={gradientStyle}>Filters</span>
      </h2>

      {/* FILTER INPUTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* DATE RANGE - START DATE */}
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
              maxDate={localFilters.endDate ? new Date(localFilters.endDate) : new Date()}
              renderCustomHeader={CustomHeader}
              showPopperArrow={false}
            />
          </div>
        </div>

        {/* DATE RANGE - END DATE */}
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
              maxDate={new Date()}
              startDate={localFilters.startDate ? new Date(localFilters.startDate) : undefined}
              endDate={localFilters.endDate ? new Date(localFilters.endDate) : undefined}
              selectsEnd={!!localFilters.startDate}
              highlightDates={localFilters.startDate ? [new Date(localFilters.startDate)] : []}
              renderCustomHeader={CustomHeader}
              showPopperArrow={false}
            />
          </div>
        </div>

        {/* MIN PRICE FILTER */}
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

        {/* EMAIL FILTER */}
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

        {/* PHONE FILTER */}
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

        {/* SEARCH BUTTON */}
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

      {/* ACTIVE FILTERS DISPLAY */}
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