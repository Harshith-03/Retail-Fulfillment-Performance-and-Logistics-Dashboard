import React from 'react';
import { Filter } from 'lucide-react';

const FilterPanel = ({ 
  brands, 
  stores, 
  methods,
  selectedBrand, 
  selectedStore,
  selectedMethod,
  dateRange,
  onBrandChange, 
  onStoreChange,
  onMethodChange,
  onDateRangeChange 
}) => {
  return (
    <div className="filter-panel">
      <div className="filter-header">
        <Filter size={18} />
        <span>Filters</span>
      </div>
      <div className="filter-controls">
        <div className="filter-group">
          <label>Brand</label>
          <select 
            value={selectedBrand} 
            onChange={(e) => onBrandChange(e.target.value)}
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand.brand_id} value={brand.brand_id}>
                {brand.brand_name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Store</label>
          <select 
            value={selectedStore} 
            onChange={(e) => onStoreChange(e.target.value)}
          >
            <option value="all">All Stores</option>
            {stores
              .filter(store => selectedBrand === 'all' || store.brand_id === parseInt(selectedBrand))
              .map(store => (
                <option key={store.store_id} value={store.store_id}>
                  {store.store_name}
                </option>
              ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Fulfillment Method</label>
          <select 
            value={selectedMethod} 
            onChange={(e) => onMethodChange(e.target.value)}
          >
            <option value="all">All Methods</option>
            {methods.map(method => (
              <option key={method.method_id} value={method.method_id}>
                {method.method_name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Date Range</label>
          <select 
            value={dateRange} 
            onChange={(e) => onDateRangeChange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="30">Last 30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
