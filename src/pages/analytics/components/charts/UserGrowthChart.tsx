import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'
import { formatNumber } from '@/api/analyticsApi'

interface UserGrowthChartProps {
  data?: Array<{
    date: string;
    value: number;
    label: string;
  }>;
  loading?: boolean;
}

const chartConfig = {
  users: {
    label: "Users",
    color: "#3b82f6", // Blue color
  },
}

export function UserGrowthChart({ data, loading }: UserGrowthChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Growth Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Growth Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-sm text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[300px]"
        >
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <ChartTooltip 
              content={<ChartTooltipContent 
                formatter={(value, name) => [formatNumber(value as number), name]}
                labelFormatter={(label) => `Date: ${label}`}
              />}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Users"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}