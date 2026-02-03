import React from 'react';
import { 
  Package, Clock, CheckCircle, TrendingUp, DollarSign, AlertTriangle 
} from 'lucide-react';
import KPICard from './KPICard';
import { TrendLineChart, BarChartComponent, DonutChart } from './Charts';

const ExecutiveScorecard = ({ 
  aggregatedMetrics, 
  brandMetrics, 
  methodMetrics,
  dailyTrends,
  wowMetrics 
}) => {
  // Prepare brand performance data for chart
  const brandChartData = brandMetrics.map(b => ({
    name: b.brand_code,
    'On-Time %': parseFloat(b.onTimeDeliveryRate),
    'Fill Rate %': parseFloat(b.avgFillRate),
    'Avg Lead Time': b.avgLeadTimeMinutes
  }));

  // Prepare method distribution data
  const methodChartData = methodMetrics.map(m => ({
    name: m.method_name,
    value: m.totalOrders
  }));

  return (
    <div className="executive-scorecard">
      <div className="section-header">
        <h2>Executive Scorecard</h2>
        <p>High-level view of fulfillment health across all brands</p>
      </div>

      {/* Primary KPIs */}
      <div className="kpi-grid primary">
        <KPICard 
          title="Total Orders"
          value={aggregatedMetrics.totalOrders.toLocaleString()}
          icon={Package}
          color="blue"
          trend={parseFloat(wowMetrics.ordersGrowth) >= 0 ? 'up' : 'down'}
          trendValue={wowMetrics.ordersGrowth}
          trendLabel="% WoW"
        />
        <KPICard 
          title="On-Time Delivery Rate"
          value={aggregatedMetrics.onTimeDeliveryRate}
          unit="%"
          icon={CheckCircle}
          color="green"
          trend={parseFloat(wowMetrics.onTimeChange) >= 0 ? 'up' : 'down'}
          trendValue={wowMetrics.onTimeChange}
          trendLabel="pts WoW"
        />
        <KPICard 
          title="Avg Lead Time"
          value={aggregatedMetrics.avgLeadTimeMinutes}
          unit=" mins"
          icon={Clock}
          color="orange"
          trend={parseInt(wowMetrics.leadTimeChange) <= 0 ? 'up' : 'down'}
          trendValue={wowMetrics.leadTimeChange}
          trendLabel="mins WoW"
        />
        <KPICard 
          title="Order Fill Rate"
          value={aggregatedMetrics.avgFillRate}
          unit="%"
          icon={TrendingUp}
          color="purple"
        />
        <KPICard 
          title="Total Revenue"
          value={`$${(parseFloat(aggregatedMetrics.totalRevenue) / 1000000).toFixed(2)}M`}
          icon={DollarSign}
          color="green"
        />
      </div>

      {/* WoW Comparison */}
      <div className="wow-comparison">
        <h3>Week-over-Week Performance</h3>
        <div className="wow-grid">
          <div className="wow-item">
            <span className="wow-label">This Week Orders</span>
            <span className="wow-value">{wowMetrics.currentWeekOrders.toLocaleString()}</span>
          </div>
          <div className="wow-item">
            <span className="wow-label">Last Week Orders</span>
            <span className="wow-value">{wowMetrics.prevWeekOrders.toLocaleString()}</span>
          </div>
          <div className="wow-item">
            <span className="wow-label">This Week On-Time</span>
            <span className="wow-value">{wowMetrics.currentOnTimeRate}%</span>
          </div>
          <div className="wow-item">
            <span className="wow-label">Last Week On-Time</span>
            <span className="wow-value">{wowMetrics.prevOnTimeRate}%</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="chart-card">
          <TrendLineChart 
            data={dailyTrends}
            dataKey="onTimeRate"
            xAxisKey="date"
            title="On-Time Delivery Trend"
            color="#10b981"
            height={280}
          />
        </div>
        <div className="chart-card">
          <TrendLineChart 
            data={dailyTrends}
            dataKey="totalOrders"
            xAxisKey="date"
            title="Daily Order Volume"
            color="#3b82f6"
            height={280}
          />
        </div>
      </div>

      {/* Brand Performance */}
      <div className="brand-performance">
        <h3>Performance by Brand</h3>
        <div className="brand-table">
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Orders</th>
                <th>On-Time %</th>
                <th>Fill Rate %</th>
                <th>Avg Lead Time</th>
                <th>Revenue</th>
                <th>Complaints</th>
              </tr>
            </thead>
            <tbody>
              {brandMetrics.map(brand => (
                <tr key={brand.brand_id}>
                  <td>
                    <div className="brand-cell">
                      <span className="brand-name">{brand.brand_name}</span>
                      <span className="brand-region">{brand.region}</span>
                    </div>
                  </td>
                  <td>{brand.totalOrders.toLocaleString()}</td>
                  <td>
                    <span className={`metric-badge ${parseFloat(brand.onTimeDeliveryRate) >= 85 ? 'good' : 'warning'}`}>
                      {brand.onTimeDeliveryRate}%
                    </span>
                  </td>
                  <td>
                    <span className={`metric-badge ${parseFloat(brand.avgFillRate) >= 95 ? 'good' : 'warning'}`}>
                      {brand.avgFillRate}%
                    </span>
                  </td>
                  <td>{brand.avgLeadTimeMinutes} mins</td>
                  <td>${(parseFloat(brand.totalRevenue) / 1000).toFixed(1)}K</td>
                  <td>
                    {brand.complaintsCount > 0 && (
                      <span className="complaint-badge">
                        <AlertTriangle size={14} />
                        {brand.complaintsCount}
                      </span>
                    )}
                    {brand.complaintsCount === 0 && <span className="no-complaints">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <BarChartComponent 
            data={brandChartData}
            dataKey="On-Time %"
            xAxisKey="name"
            title="On-Time Delivery by Brand"
            color="#3b82f6"
            height={280}
          />
        </div>
        <div className="chart-card">
          <DonutChart 
            data={methodChartData}
            dataKey="value"
            nameKey="name"
            title="Orders by Fulfillment Method"
            height={280}
          />
        </div>
      </div>
    </div>
  );
};

export default ExecutiveScorecard;
