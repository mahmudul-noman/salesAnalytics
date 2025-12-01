// src\components\SalesChart.tsx
import React, { useState, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { TotalSalesData } from '../types';

interface SalesChartProps {
  data: TotalSalesData[];
  isLoading: boolean;
}

// SALES VISUALIZATION CHART COMPONENT
// Displays sales data in area or line chart format with time aggregation
const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading }) => {
  // CHART VIEW CONFIGURATION STATE
  // Controls time aggregation level (daily/weekly/monthly) and chart type
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  // DATA AGGREGATION LOGIC
  // Transforms raw daily data into aggregated views based on selected time period
  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    // DAILY VIEW: Format dates for display, keep all data points
    if (viewMode === 'daily') {
      return data.map(item => ({
        ...item,
        formattedDate: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
    }

    const aggregated: Array<{ day: string; totalSale: number; formattedDate: string }> = [];

    // WEEKLY AGGREGATION
    if (viewMode === 'weekly') {
      for (let i = 0; i < data.length; i += 7) {
        const week = data.slice(i, i + 7);
        const avg = week.reduce((sum, item) => sum + item.totalSale, 0) / week.length;
        aggregated.push({
          day: week[0].day,
          totalSale: Math.round(avg),
          formattedDate: new Date(week[0].day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
    }

    // MONTHLY AGGREGATION
    else if (viewMode === 'monthly') {
      const monthlyData: Record<string, { sum: number; count: number }> = {};
      data.forEach(item => {
        const month = item.day.substring(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = { sum: 0, count: 0 };
        }
        monthlyData[month].sum += item.totalSale;
        monthlyData[month].count += 1;
      });

      Object.entries(monthlyData).forEach(([month, values]) => {
        aggregated.push({
          day: month + '-01',
          totalSale: Math.round(values.sum / values.count),
          formattedDate: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        });
      });
    }
    return aggregated;
  }, [data, viewMode]);

  // TICK INTERVAL CALCULATION
  // Reduces number of x-axis labels for better readability based on data length
  const tickInterval = useMemo(() => {
    const length = aggregatedData.length;
    if (length > 200) return Math.floor(length / 10);
    if (length > 100) return Math.floor(length / 15);
    if (length > 50) return Math.floor(length / 20);
    return 0;
  }, [aggregatedData]);

  // CUSTOM TOOLTIP COMPONENT
  // Displays formatted date and total sales value in a tooltip
  const CustomTooltip = ({ active, payload }: { active: boolean, payload: Array<{ value: number, payload: { formattedDate: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">{payload[0].payload.formattedDate}</p>
          <p className="text-lg font-semibold text-[#0074ba]">
            ${payload[0].value.toLocaleString('en-US')}
          </p>
        </div>
      );
    }
    return null;
  };

  // LOADING STATE
  // Displays loading spinner and message while data is being fetched
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0074ba] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#374151]">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // NO DATA STATE
  // Displays message when no sales data is available
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#374151]">No sales data available</p>
        </div>
      </div>
    );
  }

  // MAIN CHART COMPONENT
  // Renders the chart based on selected view mode and chart type
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-[#333] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 bg-gradient-to-r from-[#00b2ae] to-[#0074ba] text-transparent bg-clip-text" />
          Total Sales Over Time
        </h2>

        <div className="flex gap-2 flex-wrap">
          <div className="flex bg-[#f3f4f6] rounded-lg p-1">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'daily' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
                }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'weekly' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
                }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'monthly' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
                }`}
            >
              Monthly
            </button>
          </div>

          <div className="flex bg-[#f3f4f6] rounded-lg p-1">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${chartType === 'area' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
                }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${chartType === 'line' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
                }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0074ba" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0074ba" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="formattedDate"
                stroke="#6b7280"
                fontSize={12}
                interval={tickInterval}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip active={true} payload={[]} />} />
              <Area
                type="monotone"
                dataKey="totalSale"
                stroke="#0074ba"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          ) : (
            <LineChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="formattedDate"
                stroke="#6b7280"
                fontSize={12}
                interval={tickInterval}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip active={true} payload={[]} />} />
              <Line
                type="monotone"
                dataKey="totalSale"
                stroke="url(#lineGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#00b2ae' }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00b2ae" />
                  <stop offset="100%" stopColor="#0074ba" />
                </linearGradient>
              </defs>
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-[#6b7280] text-center">
        Showing {aggregatedData.length} data points • {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} average
      </div>
    </div>
  );
};

export default SalesChart;