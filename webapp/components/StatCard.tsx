import { LucideIcon } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  format?: 'currency' | 'percentage' | 'number';
  trend?: number;
  description?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  format = 'number',
  trend,
  description 
}: StatCardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return value.toLocaleString('de-DE');
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{formatValue()}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
          {trend !== undefined && (
            <p className={`mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}%
            </p>
          )}
        </div>
        <div className="rounded-full bg-blue-100 p-3">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
