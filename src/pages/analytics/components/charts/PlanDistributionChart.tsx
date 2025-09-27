import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Cell, Pie, PieChart } from 'recharts'
import { formatPercentage } from '@/api/analyticsApi'

interface PlanDistributionChartProps {
  data?: Array<{
    label: string;
    value: number;
    percentage: number;
    color: string;
  }>;
  loading?: boolean;
}

const chartConfig = {
  plans: {
    label: "Plans",
  },
}

const DEFAULT_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green  
  "#f59e0b", // Yellow
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
]

export function PlanDistributionChart({ data, loading }: PlanDistributionChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan Distribution</CardTitle>
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
          <CardTitle>Plan Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-sm text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ensure colors are assigned
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="flex-1">
            <ChartContainer
              config={chartConfig}
              className="h-[250px] w-full"
            >
              <PieChart>
                <Pie
                  data={dataWithColors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, _, props) => [
                      `${formatPercentage(props.payload?.percentage || 0)} (${value} users)`,
                      props.payload?.label
                    ]}
                  />}
                />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="flex flex-col gap-2 lg:w-48">
            {dataWithColors.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="flex-1">{item.label}</span>
                <span className="font-medium">{formatPercentage(item.percentage)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}