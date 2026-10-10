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

const EnrollmentTrendChart = () => {
  const { data, isLoading, isError, refetch } = useEnrollmentTrend();

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Loading enrollment trend">
        <div className="h-full w-full animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm" role="alert">
        <p className="font-medium text-slate-900">Enrollment trend couldn’t load.</p>
        <button type="button" onClick={() => refetch()} className="mt-3 rounded-lg px-3 py-2 text-sm font-semibold text-[#5749C8] transition-colors hover:bg-[#F0EDFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]">Try again</button>
      </div>
    );
  }

  const chartData = (data?.data || []).map((point) => ({
    ...point,
    label: `${point.month} '${String(point.year).slice(-2)}`,
  }));

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="enrollment-trend-title">
      <div className="mb-5">
        <h2 id="enrollment-trend-title" className="text-lg font-semibold text-slate-950">Monthly successful enrollments</h2>
        <p className="mt-1 text-sm text-slate-500">Successful payment records grouped by month.</p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl bg-slate-50 px-4 text-center">
          <p className="text-sm text-slate-600">No successful enrollment data is available yet.</p>
        </div>
      ) : (
        <div className="h-64 w-full" role="img" aria-label="Line chart of successful monthly enrollments">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 4, left: -18 }}>
              <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#64748B" }} tickLine={false} axisLine={false} minTickGap={16} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748B" }} tickLine={false} axisLine={false} width={42} />
              <Tooltip formatter={(value) => [value, "Successful enrollments"]} contentStyle={{ borderRadius: 12, borderColor: "#E2E8F0", boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)" }} />
              <Line type="monotone" dataKey="enrollments" stroke="#6C5CE7" strokeWidth={2.5} dot={{ r: 3, fill: "#6C5CE7", strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default EnrollmentTrendChart;
