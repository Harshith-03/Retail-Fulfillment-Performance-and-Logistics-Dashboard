import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, AlertTriangle, Database, 
  BarChart3, Settings, Menu, X 
} from 'lucide-react';

import FilterPanel from './FilterPanel';
import ExecutiveScorecard from './ExecutiveScorecard';
import BottleneckAnalyzer from './BottleneckAnalyzer';
import DataQualityMonitor from './DataQualityMonitor';

import {
  dimBrand,
  dimStoreLocation,
  dimFulfillmentMethod,
  factFulfillmentPerformance,
  getAggregatedMetrics,
  getMetricsByBrand,
  getMetricsByStore,
  getDailyTrends,
  getMetricsByMethod,
  getDataQualityMetrics,
  getWoWMetrics
} from '../data/sampleData';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('scorecard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Filter state
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  // Compute filtered and aggregated metrics
  const filteredData = useMemo(() => {
    let filtered = [...factFulfillmentPerformance];
    
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(f => f.brand_id === parseInt(selectedBrand));
    }
    if (selectedStore !== 'all') {
      filtered = filtered.filter(f => f.store_id === parseInt(selectedStore));
    }
    if (selectedMethod !== 'all') {
      filtered = filtered.filter(f => f.method_id === parseInt(selectedMethod));
    }
    
    // Date range filter
    const today = new Date('2026-02-03');
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - parseInt(dateRange));
    
    filtered = filtered.filter(f => new Date(f.date_key) >= startDate);
    
    return filtered;
  }, [selectedBrand, selectedStore, selectedMethod, dateRange]);

  // Calculate metrics based on filtered data
  const aggregatedMetrics = useMemo(() => {
    if (filteredData.length === 0) {
      return { totalOrders: 0, onTimeDeliveryRate: '0', avgLeadTimeMinutes: '0', avgFillRate: '0', totalRevenue: '0' };
    }
    const totalOrders = filteredData.length;
    const onTimeOrders = filteredData.filter(f => f.is_on_time).length;
    const avgLeadTime = filteredData.reduce((sum, f) => sum + f.total_lead_time_mins, 0) / totalOrders;
    const avgFillRate = filteredData.reduce((sum, f) => sum + f.fill_rate, 0) / totalOrders;
    const totalRevenue = filteredData.reduce((sum, f) => sum + f.order_value, 0);
    
    return {
      totalOrders,
      onTimeDeliveryRate: ((onTimeOrders / totalOrders) * 100).toFixed(1),
      avgLeadTimeMinutes: avgLeadTime.toFixed(0),
      avgFillRate: avgFillRate.toFixed(1),
      totalRevenue: totalRevenue.toFixed(2)
    };
  }, [filteredData]);

  const brandMetrics = useMemo(() => getMetricsByBrand(), []);
  const storeMetrics = useMemo(() => getMetricsByStore(), []);
  const dailyTrends = useMemo(() => getDailyTrends(), []);
  const methodMetrics = useMemo(() => getMetricsByMethod(), []);
  const dataQualityMetrics = useMemo(() => getDataQualityMetrics(), []);
  const wowMetrics = useMemo(() => getWoWMetrics(), []);

  const navItems = [
    { id: 'scorecard', label: 'Executive Scorecard', icon: LayoutDashboard },
    { id: 'bottleneck', label: 'Bottleneck Analyzer', icon: AlertTriangle },
    { id: 'dataquality', label: 'Data Quality Monitor', icon: Database },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'scorecard':
        return (
          <ExecutiveScorecard 
            aggregatedMetrics={aggregatedMetrics}
            brandMetrics={brandMetrics}
            methodMetrics={methodMetrics}
            dailyTrends={dailyTrends}
            wowMetrics={wowMetrics}
          />
        );
      case 'bottleneck':
        return (
          <BottleneckAnalyzer 
            storeMetrics={storeMetrics}
            brandMetrics={brandMetrics}
          />
        );
      case 'dataquality':
        return (
          <DataQualityMonitor 
            dataQualityMetrics={dataQualityMetrics}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <BarChart3 size={28} />
            {sidebarOpen && <span>Fulfillment Analytics</span>}
          </div>
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Retail Fulfillment Performance Dashboard</h1>
            <span className="last-updated">Last updated: Feb 3, 2026 09:45 AM</span>
          </div>
        </header>

        {/* Filters */}
        <FilterPanel 
          brands={dimBrand}
          stores={dimStoreLocation}
          methods={dimFulfillmentMethod}
          selectedBrand={selectedBrand}
          selectedStore={selectedStore}
          selectedMethod={selectedMethod}
          dateRange={dateRange}
          onBrandChange={setSelectedBrand}
          onStoreChange={setSelectedStore}
          onMethodChange={setSelectedMethod}
          onDateRangeChange={setDateRange}
        />

        {/* Content Area */}
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
