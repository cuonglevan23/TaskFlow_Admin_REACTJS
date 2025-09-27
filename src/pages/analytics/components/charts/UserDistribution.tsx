import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatNumber, formatPercentage } from '@/api/analyticsApi'

interface UserDistributionProps {
  data?: {
    byRole: Array<{
      role: string;
      count: number;
      percentage: number;
    }>;
    byStatus: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
  };
  loading?: boolean;
}

export function UserDistribution({ data, loading }: UserDistributionProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>User Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading user distribution...</div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>User Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No distribution data available</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>User Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">By Role</h4>
          <div className="space-y-2">
            {data.byRole.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.role}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{formatNumber(item.count)}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatPercentage(item.percentage)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">By Status</h4>
          <div className="space-y-2">
            {data.byStatus.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{item.status}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(item.count)} ({formatPercentage(item.percentage)})
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}