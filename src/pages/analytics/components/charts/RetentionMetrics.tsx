import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPercentage } from '@/api/analyticsApi'

interface RetentionMetricsProps {
  data?: {
    dailyRetention: number;
    weeklyRetention: number;
    monthlyRetention: number;
    averageSessionDuration: number;
    bounceRate: number;
    engagementScore: number;
  };
  loading?: boolean;
}

export function RetentionMetrics({ data, loading }: RetentionMetricsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Retention Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading retention metrics...</div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Retention Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No retention data available</div>
        </CardContent>
      </Card>
    )
  }

  const getRetentionColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBadgeVariant = (value: number, threshold: number) => {
    return value >= threshold ? 'default' : 'secondary';
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Retention Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Daily</span>
              <Badge variant={getBadgeVariant(data.dailyRetention, 70)}>
                {formatPercentage(data.dailyRetention)}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getRetentionColor(data.dailyRetention)}`}
                style={{ width: `${data.dailyRetention}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Weekly</span>
              <Badge variant={getBadgeVariant(data.weeklyRetention, 50)}>
                {formatPercentage(data.weeklyRetention)}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getRetentionColor(data.weeklyRetention)}`}
                style={{ width: `${data.weeklyRetention}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Monthly Retention</span>
            <Badge variant={getBadgeVariant(data.monthlyRetention, 30)}>
              {formatPercentage(data.monthlyRetention)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Avg Session</span>
            <span className="text-sm font-medium">
              {Math.round(data.averageSessionDuration / 60)}m
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Bounce Rate</span>
            <Badge variant={data.bounceRate < 50 ? 'default' : 'destructive'}>
              {formatPercentage(data.bounceRate)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Engagement</span>
            <Badge variant={getBadgeVariant(data.engagementScore, 70)}>
              {formatPercentage(data.engagementScore)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}