import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useDashboard } from '../context/dashboard-context'

export function Overview() {
  const { monthlyData, chartLoading } = useDashboard()

  if (chartLoading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={monthlyData}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey='revenue' fill='#adfa1d' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
