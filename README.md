# Retail Fulfillment Performance & Logistics Dashboard

A comprehensive React-based analytics dashboard for monitoring and optimizing fulfillment operations across multiple grocery brands.

## Problem Statement

Fulfillment operations across multiple grocery brands generate fragmented data. Brand operations teams lack a "single source of truth" to understand why certain stores have higher delivery lead times or lower order accuracy. This dashboard bridges relational order data with non-relational fulfillment event logs to provide unified visibility.

## Features

### Executive Scorecard
- **KPI Cards**: Total Orders, On-Time Delivery Rate, Average Lead Time, Order Fill Rate, Total Revenue
- **Week-over-Week Comparisons**: Track performance trends with visual indicators
- **Brand Performance Table**: Compare metrics across all brands with drill-down capabilities
- **Trend Charts**: Daily order volume and on-time delivery trends
- **Fulfillment Method Distribution**: Visualize order mix by delivery method

### Bottleneck Analyzer
- **Heat Map Visualization**: Identify stores where "order-to-ready" time exceeds the 2-hour SLA
- **Severity Classification**: Critical (High), At-Risk (Medium), and Healthy (Low) store categorization
- **Interactive Store Table**: Sortable columns with expandable row details
- **Process Breakdown**: View picking delay, picking duration, and total lead time per store
- **Top 10 Charts**: SLA exceedance and picking delay visualizations

### Data Quality Monitor
- **Match Rate Tracking**: Real-time monitoring of data integrity between relational and non-relational sources
- **Status Indicators**: Healthy (≥99.9%), Warning (99-99.9%), Critical (<99%)
- **Source Integration View**: Visual representation of SQL and JSON data pipeline
- **Daily Discrepancy Reports**: Track data quality trends over time
- **Quality Rules Documentation**: Clear thresholds and escalation criteria

## Data Architecture

The dashboard implements a **Star Schema** data model:

### Fact Table
- `fact_fulfillment_performance` - Granularity: One row per order-fulfillment event

### Dimension Tables
| Table | Description |
|-------|-------------|
| `dim_brand` | Brand information (Stop & Shop, Food Lion, Giant Food, Hannaford) |
| `dim_store_location` | Store details with location and capacity data |
| `dim_time` | Time dimension with day, week, month attributes |
| `dim_fulfillment_method` | Fulfillment types (Curbside, Home Delivery, In-Store Pickup, Express) |

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Retail Fulfillment Performance and Logistics Dashboard"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard container with navigation
│   ├── ExecutiveScorecard.jsx # Executive summary view
│   ├── BottleneckAnalyzer.jsx # Store bottleneck heat map and analysis
│   ├── DataQualityMonitor.jsx # Data integrity monitoring
│   ├── FilterPanel.jsx        # Global filters (brand, store, method, date)
│   ├── KPICard.jsx            # Reusable KPI card component
│   └── Charts.jsx             # Recharts wrapper components
├── data/
│   └── sampleData.js          # Star schema data model with sample data
├── styles/
│   └── Dashboard.css          # Complete styling for all components
├── App.jsx                    # Root application component
└── index.js                   # Entry point
```

## Technologies Used

- **React 18** - UI framework
- **Recharts** - Charting library for data visualization
- **Lucide React** - Modern icon library
- **date-fns** - Date utility library
- **CSS3** - Custom styling with CSS variables and responsive design

##  Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| On-Time Delivery Rate | Orders delivered within SLA | ≥ 85% |
| Order Fill Rate | Items fulfilled vs ordered | ≥ 95% |
| Average Lead Time | Order placement to delivery | < 120 mins |
| Data Match Rate | Relational vs event log sync | ≥ 99.9% |

## Target Audience

- **Digital Product Managers**: Track success of digital fulfillment features
- **Fulfillment & Brand Operations**: Manage store-level performance and logistics
- **Data Scientists**: Access cleaned, modeled data for predictive forecasting

## Success Metrics

- **User Adoption**: Weekly active usage by brand operations managers
- **Operational Impact**: 10% reduction in average order-to-delivery lead time (Q1 target)
- **Data Integrity**: 99.9% match rate between source systems and dashboard

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server |
| `npm run build` | Create production build |
| `npm test` | Run test suite |

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
