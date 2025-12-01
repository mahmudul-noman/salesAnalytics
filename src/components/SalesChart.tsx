// import React, { useState, useMemo } from 'react';
// import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { TrendingUp } from 'lucide-react';
// import { TotalSalesData } from '../types';

// interface SalesChartProps {
//   data: TotalSalesData[];
//   isLoading: boolean;
// }

// const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading }) => {
//   const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
//   const [chartType, setChartType] = useState<'area' | 'line'>('area');

//   // Aggregate data based on view mode
//   const aggregatedData = useMemo(() => {
//     if (!data || data.length === 0) return [];

//     if (viewMode === 'daily') {
//       return data.map(item => ({
//         ...item,
//         formattedDate: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//       }));
//     }

//     const aggregated: Array<{ day: string; totalSale: number; formattedDate: string }> = [];
    
//     if (viewMode === 'weekly') {
//       for (let i = 0; i < data.length; i += 7) {
//         const week = data.slice(i, i + 7);
//         const avg = week.reduce((sum, item) => sum + item.totalSale, 0) / week.length;
//         aggregated.push({
//           day: week[0].day,
//           totalSale: Math.round(avg),
//           formattedDate: new Date(week[0].day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//         });
//       }
//     } else if (viewMode === 'monthly') {
//       const monthlyData: Record<string, { sum: number; count: number }> = {};
//       data.forEach(item => {
//         const month = item.day.substring(0, 7);
//         if (!monthlyData[month]) {
//           monthlyData[month] = { sum: 0, count: 0 };
//         }
//         monthlyData[month].sum += item.totalSale;
//         monthlyData[month].count += 1;
//       });
      
//       Object.entries(monthlyData).forEach(([month, values]) => {
//         aggregated.push({
//           day: month + '-01',
//           totalSale: Math.round(values.sum / values.count),
//           formattedDate: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
//         });
//       });
//     }
//     return aggregated;
//   }, [data, viewMode]);

//   // Reduce number of x-axis labels based on data length
//   const tickInterval = useMemo(() => {
//     const length = aggregatedData.length;
//     if (length > 200) return Math.floor(length / 10);
//     if (length > 100) return Math.floor(length / 15);
//     if (length > 50) return Math.floor(length / 20);
//     return 0;
//   }, [aggregatedData]);

//   const CustomTooltip = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-lg">
//           <p className="text-sm text-gray-600 mb-1">{payload[0].payload.formattedDate}</p>
//           <p className="text-lg font-semibold text-blue-600">
//             ${payload[0].value.toLocaleString()}
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (isLoading) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//           <p className="text-gray-500">Loading chart data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-500">No sales data available</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
//           <TrendingUp className="w-5 h-5 text-blue-600" />
//           Total Sales Over Time
//         </h2>
        
//         <div className="flex gap-2 flex-wrap">
//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button
//               onClick={() => setViewMode('daily')}
//               className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
//                 viewMode === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Daily
//             </button>
//             <button
//               onClick={() => setViewMode('weekly')}
//               className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
//                 viewMode === 'weekly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Weekly
//             </button>
//             <button
//               onClick={() => setViewMode('monthly')}
//               className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
//                 viewMode === 'monthly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Monthly
//             </button>
//           </div>

//           <div className="flex bg-gray-100 rounded-lg p-1">
//             <button
//               onClick={() => setChartType('area')}
//               className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
//                 chartType === 'area' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Area
//             </button>
//             <button
//               onClick={() => setChartType('line')}
//               className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
//                 chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Line
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="h-80">
//         <ResponsiveContainer width="100%" height="100%">
//           {chartType === 'area' ? (
//             <AreaChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//               <defs>
//                 <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
//                   <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis 
//                 dataKey="formattedDate" 
//                 stroke="#6b7280"
//                 fontSize={12}
//                 interval={tickInterval}
//                 angle={-45}
//                 textAnchor="end"
//                 height={80}
//               />
//               <YAxis 
//                 stroke="#6b7280"
//                 fontSize={12}
//                 tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Area
//                 type="monotone"
//                 dataKey="totalSale"
//                 stroke="#2563eb"
//                 strokeWidth={2}
//                 fillOpacity={1}
//                 fill="url(#colorSales)"
//               />
//             </AreaChart>
//           ) : (
//             <LineChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis 
//                 dataKey="formattedDate" 
//                 stroke="#6b7280"
//                 fontSize={12}
//                 interval={tickInterval}
//                 angle={-45}
//                 textAnchor="end"
//                 height={80}
//               />
//               <YAxis 
//                 stroke="#6b7280"
//                 fontSize={12}
//                 tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Line
//                 type="monotone"
//                 dataKey="totalSale"
//                 stroke="#2563eb"
//                 strokeWidth={2}
//                 dot={false}
//                 activeDot={{ r: 6, fill: '#1d4ed8' }}
//               />
//             </LineChart>
//           )}
//         </ResponsiveContainer>
//       </div>

//       <div className="mt-4 text-sm text-gray-500 text-center">
//         Showing {aggregatedData.length} data points • {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} average
//       </div>
//     </div>
//   );
// };

// export default SalesChart;


import React, { useState, useMemo } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { TotalSalesData } from '../types';

interface SalesChartProps {
  data: TotalSalesData[];
  isLoading: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

  // Aggregate data based on view mode
  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (viewMode === 'daily') {
      return data.map(item => ({
        ...item,
        formattedDate: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
    }

    const aggregated: Array<{ day: string; totalSale: number; formattedDate: string }> = [];
    
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
    } else if (viewMode === 'monthly') {
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

  // Reduce number of x-axis labels based on data length
  const tickInterval = useMemo(() => {
    const length = aggregatedData.length;
    if (length > 200) return Math.floor(length / 10);
    if (length > 100) return Math.floor(length / 15);
    if (length > 50) return Math.floor(length / 20);
    return 0;
  }, [aggregatedData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">{payload[0].payload.formattedDate}</p>
          <p className="text-lg font-semibold text-[#0074ba]">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

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

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#374151]">No sales data available</p>
        </div>
      </div>
    );
  }

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
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'daily' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'weekly' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'monthly' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
              }`}
            >
              Monthly
            </button>
          </div>

          <div className="flex bg-[#f3f4f6] rounded-lg p-1">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartType === 'area' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartType === 'line' ? 'bg-white text-[#0074ba] shadow-sm' : 'text-[#374151] hover:text-[#333]'
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
                  <stop offset="5%" stopColor="#0074ba" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0074ba" stopOpacity={0}/>
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
              <Tooltip content={<CustomTooltip />} />
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
              <Tooltip content={<CustomTooltip />} />
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