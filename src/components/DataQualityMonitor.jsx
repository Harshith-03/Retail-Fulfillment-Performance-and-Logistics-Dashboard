import React from 'react';
import { 
  Database, CheckCircle, AlertTriangle, XCircle, 
  RefreshCw, Activity, FileText, Link2 
} from 'lucide-react';
import { TrendLineChart, BarChartComponent } from './Charts';

const DataQualityMonitor = ({ dataQualityMetrics }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="status-icon healthy" size={24} />;
      case 'warning': return <AlertTriangle className="status-icon warning" size={24} />;
      default: return <XCircle className="status-icon critical" size={24} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'healthy': return 'status-healthy';
      case 'warning': return 'status-warning';
      default: return 'status-critical';
    }
  };

  // Prepare chart data for match rate trend
  const matchRateTrendData = dataQualityMetrics.discrepanciesByDate.map(d => ({
    date: d.date,
    'Match Rate': parseFloat(d.matchRate)
  }));

  // Prepare discrepancies chart data
  const discrepanciesChartData = dataQualityMetrics.discrepanciesByDate.map(d => ({
    date: d.date.slice(-5),
    Discrepancies: d.discrepancies,
    'Total Records': d.total
  }));

  return (
    <div className="data-quality-monitor">
      <div className="section-header">
        <h2>Data Quality Monitor</h2>
        <p>Tracking discrepancies between relational (Order Placed) and non-relational (Event Logs) data sources</p>
      </div>

      {/* Overall Status */}
      <div className={`overall-status ${getStatusClass(dataQualityMetrics.dataIntegrityStatus)}`}>
        <div className="status-header">
          {getStatusIcon(dataQualityMetrics.dataIntegrityStatus)}
          <div className="status-info">
            <span className="status-title">Data Integrity Status</span>
            <span className="status-label">{dataQualityMetrics.dataIntegrityStatus.toUpperCase()}</span>
          </div>
        </div>
        <div className="status-details">
          <span className="match-rate">{dataQualityMetrics.matchRate}%</span>
          <span className="match-label">Overall Match Rate</span>
        </div>
      </div>

      {/* Data Quality KPIs */}
      <div className="dq-kpi-grid">
        <div className="dq-kpi-card">
          <div className="dq-kpi-icon">
            <Database size={20} />
          </div>
          <div className="dq-kpi-content">
            <span className="dq-kpi-value">{dataQualityMetrics.totalRecords.toLocaleString()}</span>
            <span className="dq-kpi-label">Total Records</span>
          </div>
        </div>

        <div className="dq-kpi-card">
          <div className="dq-kpi-icon green">
            <Link2 size={20} />
          </div>
          <div className="dq-kpi-content">
            <span className="dq-kpi-value">{dataQualityMetrics.recordsWithEventLog.toLocaleString()}</span>
            <span className="dq-kpi-label">Matched Records</span>
          </div>
        </div>

        <div className="dq-kpi-card">
          <div className="dq-kpi-icon orange">
            <AlertTriangle size={20} />
          </div>
          <div className="dq-kpi-content">
            <span className="dq-kpi-value">{dataQualityMetrics.totalDiscrepancies}</span>
            <span className="dq-kpi-label">Total Discrepancies</span>
          </div>
        </div>

        <div className="dq-kpi-card">
          <div className="dq-kpi-icon purple">
            <Activity size={20} />
          </div>
          <div className="dq-kpi-content">
            <span className="dq-kpi-value">{dataQualityMetrics.matchRate}%</span>
            <span className="dq-kpi-label">Match Rate</span>
          </div>
        </div>
      </div>

      {/* Data Source Comparison */}
      <div className="source-comparison">
        <h3>Data Source Integration</h3>
        <div className="source-grid">
          <div className="source-card relational">
            <div className="source-header">
              <FileText size={20} />
              <span>Relational Source</span>
            </div>
            <div className="source-content">
              <p className="source-desc">SQL-based transaction and inventory records</p>
              <ul className="source-details">
                <li>Order placement timestamps</li>
                <li>Inventory levels</li>
                <li>Customer information</li>
                <li>Product catalog data</li>
              </ul>
              <div className="source-status healthy">
                <CheckCircle size={16} />
                <span>All records ingested successfully</span>
              </div>
            </div>
          </div>

          <div className="source-connector">
            <div className="connector-line"></div>
            <RefreshCw size={20} className="connector-icon" />
            <div className="connector-line"></div>
          </div>

          <div className="source-card non-relational">
            <div className="source-header">
              <Database size={20} />
              <span>Non-Relational Source</span>
            </div>
            <div className="source-content">
              <p className="source-desc">JSON event logs from delivery tracking systems</p>
              <ul className="source-details">
                <li>Fulfillment event timestamps</li>
                <li>Delivery tracking updates</li>
                <li>Driver location data</li>
                <li>Completion confirmations</li>
              </ul>
              <div className={`source-status ${dataQualityMetrics.matchRate >= 99.9 ? 'healthy' : 'warning'}`}>
                {dataQualityMetrics.matchRate >= 99.9 ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                <span>{dataQualityMetrics.matchRate}% event capture rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <TrendLineChart 
            data={matchRateTrendData}
            dataKey="Match Rate"
            xAxisKey="date"
            title="Match Rate Trend (Last 7 Days)"
            color="#10b981"
            height={280}
          />
        </div>
        <div className="chart-card">
          <BarChartComponent 
            data={discrepanciesChartData}
            dataKey="Discrepancies"
            xAxisKey="date"
            title="Daily Discrepancies"
            color="#f59e0b"
            height={280}
          />
        </div>
      </div>

      {/* Discrepancy Details Table */}
      <div className="discrepancy-details">
        <h3>Daily Discrepancy Report</h3>
        <table className="discrepancy-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Records</th>
              <th>Discrepancies</th>
              <th>Match Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dataQualityMetrics.discrepanciesByDate.map(day => {
              const status = parseFloat(day.matchRate) >= 99.9 ? 'healthy' : 
                           parseFloat(day.matchRate) >= 99 ? 'warning' : 'critical';
              return (
                <tr key={day.date}>
                  <td>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                  <td>{day.total.toLocaleString()}</td>
                  <td>
                    {day.discrepancies > 0 ? (
                      <span className="discrepancy-count">{day.discrepancies}</span>
                    ) : (
                      <span className="no-discrepancies">0</span>
                    )}
                  </td>
                  <td>
                    <div className="match-rate-bar">
                      <div 
                        className="match-rate-fill"
                        style={{ width: `${day.matchRate}%` }}
                      ></div>
                      <span>{day.matchRate}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${status}`}>
                      {status === 'healthy' && <CheckCircle size={14} />}
                      {status === 'warning' && <AlertTriangle size={14} />}
                      {status === 'critical' && <XCircle size={14} />}
                      {status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Data Quality Rules */}
      <div className="quality-rules">
        <h3>Data Quality Rules & Thresholds</h3>
        <div className="rules-grid">
          <div className="rule-card">
            <div className="rule-header healthy">
              <CheckCircle size={18} />
              <span>Healthy</span>
            </div>
            <p>Match rate ≥ 99.9%</p>
            <span className="rule-desc">All systems operating normally</span>
          </div>
          <div className="rule-card warning">
            <div className="rule-header warning">
              <AlertTriangle size={18} />
              <span>Warning</span>
            </div>
            <p>Match rate 99.0% - 99.9%</p>
            <span className="rule-desc">Minor data sync issues detected</span>
          </div>
          <div className="rule-card critical">
            <div className="rule-header critical">
              <XCircle size={18} />
              <span>Critical</span>
            </div>
            <p>Match rate &lt; 99.0%</p>
            <span className="rule-desc">Immediate investigation required</span>
          </div>
        </div>
      </div>

      {/* Background Process Status */}
      <div className="process-status">
        <h3>Data Quality Monitoring Process</h3>
        <div className="process-info">
          <div className="process-item">
            <Activity size={18} className="pulse" />
            <div>
              <span className="process-label">Monitoring Script Status</span>
              <span className="process-value running">Running</span>
            </div>
          </div>
          <div className="process-item">
            <RefreshCw size={18} />
            <div>
              <span className="process-label">Last Sync</span>
              <span className="process-value">2 minutes ago</span>
            </div>
          </div>
          <div className="process-item">
            <Database size={18} />
            <div>
              <span className="process-label">Next Scheduled Sync</span>
              <span className="process-value">In 3 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataQualityMonitor;
