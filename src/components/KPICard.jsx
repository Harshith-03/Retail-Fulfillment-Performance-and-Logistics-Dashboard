import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPICard = ({ 
  title, 
  value, 
  unit = '', 
  trend = null, 
  trendValue = null, 
  trendLabel = 'vs last week',
  icon: Icon,
  color = 'blue',
  size = 'medium'
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  };

  const iconBgClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={14} />;
    if (trend === 'down') return <TrendingDown size={14} />;
    return <Minus size={14} />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className={`kpi-card ${size}`}>
      <div className="kpi-header">
        {Icon && (
          <div className={`kpi-icon ${iconBgClasses[color]}`}>
            <Icon size={20} />
          </div>
        )}
        <span className="kpi-title">{title}</span>
      </div>
      <div className="kpi-value">
        <span className="value">{value}</span>
        {unit && <span className="unit">{unit}</span>}
      </div>
      {trend !== null && trendValue !== null && (
        <div className={`kpi-trend ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="trend-value">{trendValue > 0 ? '+' : ''}{trendValue}</span>
          <span className="trend-label">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
