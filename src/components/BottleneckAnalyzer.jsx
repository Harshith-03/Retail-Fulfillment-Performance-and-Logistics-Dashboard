import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChartComponent } from './Charts';

const BottleneckAnalyzer = ({ storeMetrics, brandMetrics }) => {
  const [expandedStore, setExpandedStore] = useState(null);
  const [sortBy, setSortBy] = useState('slaExceedanceRate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Sort stores by selected metric
  const sortedStores = [...storeMetrics].sort((a, b) => {
    const aVal = parseFloat(a[sortBy]) || 0;
    const bVal = parseFloat(b[sortBy]) || 0;
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  // Get severity background
  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      default: return 'severity-low';
    }
  };

  // Heat map data for visualization
  const heatMapData = sortedStores.map(store => ({
    name: store.store_name.replace(/.*#/, '#'),
    'SLA Exceedance %': parseFloat(store.slaExceedanceRate),
    'Avg Lead Time': store.avgLeadTimeMinutes,
    severity: store.bottleneckSeverity
  }));

  // Prepare picking delay data
  const pickingDelayData = sortedStores.map(store => ({
    name: store.store_name.replace(/.*#/, '#'),
    'Picking Delay': store.avgPickingDelayMins,
    'Picking Duration': store.avgPickingDurationMins
  }));

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />;
  };

  return (
    <div className="bottleneck-analyzer">
      <div className="section-header">
        <h2>Bottleneck Analyzer</h2>
        <p>Identify stores where "order-to-ready" time exceeds the 2-hour SLA</p>
      </div>

      {/* Summary Cards */}
      <div className="bottleneck-summary">
        <div className="summary-card critical">
          <AlertTriangle size={24} />
          <div>
            <span className="summary-value">
              {storeMetrics.filter(s => s.bottleneckSeverity === 'high').length}
            </span>
            <span className="summary-label">Critical Stores</span>
          </div>
        </div>
        <div className="summary-card warning">
          <Clock size={24} />
          <div>
            <span className="summary-value">
              {storeMetrics.filter(s => s.bottleneckSeverity === 'medium').length}
            </span>
            <span className="summary-label">At-Risk Stores</span>
          </div>
        </div>
        <div className="summary-card good">
          <MapPin size={24} />
          <div>
            <span className="summary-value">
              {storeMetrics.filter(s => s.bottleneckSeverity === 'low').length}
            </span>
            <span className="summary-label">Healthy Stores</span>
          </div>
        </div>
      </div>

      {/* Heat Map Visual */}
      <div className="heatmap-container">
        <h3>Store Performance Heat Map</h3>
        <p className="heatmap-subtitle">Showing SLA exceedance rate by store (darker = worse performance)</p>
        <div className="heatmap-grid">
          {sortedStores.map(store => (
            <div 
              key={store.store_id}
              className={`heatmap-cell ${getSeverityBg(store.bottleneckSeverity)}`}
              onClick={() => setExpandedStore(expandedStore === store.store_id ? null : store.store_id)}
              title={`${store.store_name}: ${store.slaExceedanceRate}% SLA exceedance`}
            >
              <span className="cell-store">{store.store_name.replace(/.*#/, '#')}</span>
              <span className="cell-value">{store.slaExceedanceRate}%</span>
              <span className="cell-brand">{store.brand_name}</span>
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#dcfce7' }}></span>
            Low (&lt;10%)
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#fef3c7' }}></span>
            Medium (10-20%)
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#fee2e2' }}></span>
            High (&gt;20%)
          </span>
        </div>
      </div>

      {/* Detailed Store Table */}
      <div className="store-details-section">
        <h3>Store-Level Bottleneck Details</h3>
        <div className="store-table-container">
          <table className="store-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Brand</th>
                <th 
                  className="sortable" 
                  onClick={() => toggleSort('avgLeadTimeMinutes')}
                >
                  Avg Lead Time <SortIcon column="avgLeadTimeMinutes" />
                </th>
                <th 
                  className="sortable"
                  onClick={() => toggleSort('avgPickingDelayMins')}
                >
                  Picking Delay <SortIcon column="avgPickingDelayMins" />
                </th>
                <th 
                  className="sortable"
                  onClick={() => toggleSort('slaExceedanceRate')}
                >
                  SLA Exceedance <SortIcon column="slaExceedanceRate" />
                </th>
                <th>Orders Affected</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {sortedStores.map(store => (
                <React.Fragment key={store.store_id}>
                  <tr 
                    className={`store-row ${expandedStore === store.store_id ? 'expanded' : ''}`}
                    onClick={() => setExpandedStore(expandedStore === store.store_id ? null : store.store_id)}
                  >
                    <td>
                      <div className="store-info">
                        <MapPin size={14} />
                        <span>{store.store_name}</span>
                      </div>
                    </td>
                    <td>{store.brand_name}</td>
                    <td>
                      <span className={`time-badge ${store.avgLeadTimeMinutes > 100 ? 'high' : store.avgLeadTimeMinutes > 75 ? 'medium' : 'low'}`}>
                        {store.avgLeadTimeMinutes} mins
                      </span>
                    </td>
                    <td>{store.avgPickingDelayMins} mins</td>
                    <td>
                      <div className="sla-bar">
                        <div 
                          className="sla-fill"
                          style={{ 
                            width: `${Math.min(parseFloat(store.slaExceedanceRate), 100)}%`,
                            backgroundColor: getSeverityColor(store.bottleneckSeverity)
                          }}
                        ></div>
                        <span>{store.slaExceedanceRate}%</span>
                      </div>
                    </td>
                    <td>{store.ordersExceeding2HrSLA.toLocaleString()}</td>
                    <td>
                      <span className={`severity-badge ${getSeverityBg(store.bottleneckSeverity)}`}>
                        {store.bottleneckSeverity.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  {expandedStore === store.store_id && (
                    <tr className="expanded-row">
                      <td colSpan="7">
                        <div className="expanded-content">
                          <div className="expanded-stats">
                            <div className="stat-item">
                              <span className="stat-label">Location</span>
                              <span className="stat-value">{store.city}, {store.state} {store.zip}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">District</span>
                              <span className="stat-value">{store.district}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Capacity</span>
                              <span className="stat-value">{store.capacity_orders_per_hour} orders/hr</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Total Orders</span>
                              <span className="stat-value">{store.totalOrders.toLocaleString()}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">On-Time Rate</span>
                              <span className="stat-value">{store.onTimeDeliveryRate}%</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Fill Rate</span>
                              <span className="stat-value">{store.avgFillRate}%</span>
                            </div>
                          </div>
                          <div className="bottleneck-breakdown">
                            <h4>Fulfillment Process Breakdown</h4>
                            <div className="process-flow">
                              <div className="process-step">
                                <span className="step-label">Picking Delay</span>
                                <span className="step-value">{store.avgPickingDelayMins} mins</span>
                              </div>
                              <ArrowRight size={16} />
                              <div className="process-step">
                                <span className="step-label">Picking Duration</span>
                                <span className="step-value">{store.avgPickingDurationMins} mins</span>
                              </div>
                              <ArrowRight size={16} />
                              <div className="process-step">
                                <span className="step-label">Ready for Pickup/Delivery</span>
                                <span className="step-value">{store.avgLeadTimeMinutes} mins total</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <BarChartComponent 
            data={heatMapData.slice(0, 10)}
            dataKey="SLA Exceedance %"
            xAxisKey="name"
            title="Top 10 Stores by SLA Exceedance"
            color="#ef4444"
            height={300}
          />
        </div>
        <div className="chart-card">
          <BarChartComponent 
            data={pickingDelayData.slice(0, 10)}
            dataKey="Picking Delay"
            xAxisKey="name"
            title="Picking Delay by Store (Top 10)"
            color="#f59e0b"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default BottleneckAnalyzer;
