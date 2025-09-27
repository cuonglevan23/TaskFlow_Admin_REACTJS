import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatNumber } from '@/api/analyticsApi'

interface GeographicDataProps {
  data?: Array<{
    country: string;
    countryCode: string;
    users: number;
    percentage: number;
    flag?: string;
  }>;
  loading?: boolean;
}

export function GeographicData({ data, loading }: GeographicDataProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Geographic Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading geographic data...</div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Geographic Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No geographic data available</div>
        </CardContent>
      </Card>
    )
  }

  const getCountryFlag = (countryCode: string) => {
    // Simple flag emoji mapping for common countries
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'VN': '🇻🇳',
      'GB': '🇬🇧',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'JP': '🇯🇵',
      'KR': '🇰🇷',
      'CN': '🇨🇳',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'SG': '🇸🇬',
      'TH': '🇹🇭',
      'ID': '🇮🇩',
      'MY': '🇲🇾',
      'PH': '🇵🇭'
    };
    return flags[countryCode] || '🌐';
  };

  const maxUsers = Math.max(...data.map(item => item.users));

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Geographic Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.slice(0, 8).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-lg">
                  {item.flag || getCountryFlag(item.countryCode)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.country}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {item.percentage.toFixed(1)}%
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatNumber(item.users)}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(item.users / maxUsers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {data.length > 8 && (
            <div className="text-center pt-2">
              <span className="text-xs text-muted-foreground">
                +{data.length - 8} more countries
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}