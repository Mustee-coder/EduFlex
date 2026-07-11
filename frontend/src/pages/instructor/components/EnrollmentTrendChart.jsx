import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useEnrollmentTrend } from "@/hooks/useEnrollmentTrend";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const EnrollmentTrendChart = () => {
  const {
    data,
    isLoading,
    isError,
  } = useEnrollmentTrend();

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border p-6 flex justify-center items-center h-80">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border p-6 h-80 flex items-center justify-center">
        <p className="text-red-500 font-medium">
          Failed to load enrollment trend.
        </p>
      </div>
    );
  }

  const chartData = data?.data || [];

  return (
    <div className="mt-8 bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          📈 Enrollment Trend
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Monthly student enrollments for your courses.
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-72 flex items-center justify-center">
          <p className="text-gray-500">
            No enrollment data available.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="enrollments"
              stroke="#7c3aed"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EnrollmentTrendChart;