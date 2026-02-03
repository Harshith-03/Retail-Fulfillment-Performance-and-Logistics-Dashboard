// Dimension Tables - Star Schema Implementation

// dim_brand - Brand dimension table
export const dimBrand = [
  { brand_id: 1, brand_name: "Stop & Shop", brand_code: "SS", region: "Northeast", headquarters: "Quincy, MA" },
  { brand_id: 2, brand_name: "Food Lion", brand_code: "FL", region: "Southeast", headquarters: "Salisbury, NC" },
  { brand_id: 3, brand_name: "Giant Food", brand_code: "GF", region: "Mid-Atlantic", headquarters: "Landover, MD" },
  { brand_id: 4, brand_name: "Hannaford", brand_code: "HN", region: "New England", headquarters: "Scarborough, ME" }
];

// dim_store_location - Store location dimension
export const dimStoreLocation = [
  { store_id: 101, store_name: "Stop & Shop #1245", brand_id: 1, city: "Boston", state: "MA", zip: "02101", district: "Metro Boston", capacity_orders_per_hour: 45 },
  { store_id: 102, store_name: "Stop & Shop #1387", brand_id: 1, city: "Hartford", state: "CT", zip: "06103", district: "Hartford Metro", capacity_orders_per_hour: 38 },
  { store_id: 103, store_name: "Stop & Shop #1502", brand_id: 1, city: "Providence", state: "RI", zip: "02903", district: "Providence", capacity_orders_per_hour: 42 },
  { store_id: 201, store_name: "Food Lion #2891", brand_id: 2, city: "Charlotte", state: "NC", zip: "28202", district: "Charlotte Metro", capacity_orders_per_hour: 50 },
  { store_id: 202, store_name: "Food Lion #2456", brand_id: 2, city: "Raleigh", state: "NC", zip: "27601", district: "Triangle", capacity_orders_per_hour: 48 },
  { store_id: 203, store_name: "Food Lion #2678", brand_id: 2, city: "Richmond", state: "VA", zip: "23219", district: "Central VA", capacity_orders_per_hour: 44 },
  { store_id: 301, store_name: "Giant Food #3102", brand_id: 3, city: "Washington", state: "DC", zip: "20001", district: "DC Metro", capacity_orders_per_hour: 55 },
  { store_id: 302, store_name: "Giant Food #3245", brand_id: 3, city: "Baltimore", state: "MD", zip: "21201", district: "Baltimore Metro", capacity_orders_per_hour: 52 },
  { store_id: 401, store_name: "Hannaford #4012", brand_id: 4, city: "Portland", state: "ME", zip: "04101", district: "Southern Maine", capacity_orders_per_hour: 35 },
  { store_id: 402, store_name: "Hannaford #4156", brand_id: 4, city: "Burlington", state: "VT", zip: "05401", district: "Vermont", capacity_orders_per_hour: 32 }
];

// dim_time - Time dimension (last 30 days)
export const dimTime = (() => {
  const dates = [];
  const baseDate = new Date('2026-02-03');
  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    dates.push({
      date_key: date.toISOString().split('T')[0],
      day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      week_number: Math.ceil((date.getDate()) / 7),
      month: date.toLocaleString('default', { month: 'long' }),
      year: date.getFullYear(),
      is_weekend: dayOfWeek === 0 || dayOfWeek === 6,
      fiscal_week: `FW${String(Math.ceil((date.getDate() + 3) / 7)).padStart(2, '0')}`
    });
  }
  return dates;
})();

// dim_fulfillment_method - Fulfillment method dimension
export const dimFulfillmentMethod = [
  { method_id: 1, method_name: "Curbside Pickup", method_code: "CURB", sla_hours: 2, requires_driver: false },
  { method_id: 2, method_name: "Home Delivery", method_code: "DELV", sla_hours: 4, requires_driver: true },
  { method_id: 3, method_name: "In-Store Pickup", method_code: "ISPU", sla_hours: 1, requires_driver: false },
  { method_id: 4, method_name: "Same Day Express", method_code: "EXPR", sla_hours: 2, requires_driver: true }
];

// Helper function to generate random number within range
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

// Fact Table: fact_fulfillment_performance
// Granularity: One row per order-fulfillment event
export const factFulfillmentPerformance = (() => {
  const facts = [];
  let orderId = 100000;
  
  // Generate ~2000 orders across all stores and dates
  dimTime.forEach(timeRecord => {
    dimStoreLocation.forEach(store => {
      // Random number of orders per store per day (15-60)
      const ordersForDay = randomBetween(15, 60);
      
      for (let i = 0; i < ordersForDay; i++) {
        orderId++;
        const methodId = randomBetween(1, 4);
        const method = dimFulfillmentMethod.find(m => m.method_id === methodId);
        
        // Generate realistic fulfillment times
        const orderPlacedHour = randomBetween(6, 21);
        const pickingStartDelay = randomBetween(5, 45); // minutes after order
        const pickingDuration = randomBetween(10, 60); // minutes
        const packingDuration = randomBetween(5, 20); // minutes
        
        // Calculate if order meets SLA
        const totalFulfillmentMinutes = pickingStartDelay + pickingDuration + packingDuration;
        let deliveryDelay = 0;
        
        if (method.requires_driver) {
          deliveryDelay = randomBetween(15, 90); // delivery time
        }
        
        const totalLeadTimeMinutes = totalFulfillmentMinutes + deliveryDelay;
        const slaMinutes = method.sla_hours * 60;
        const isOnTime = totalLeadTimeMinutes <= slaMinutes;
        
        // Order accuracy - simulate some issues
        const itemsOrdered = randomBetween(8, 45);
        const substitutionRate = Math.random() < 0.15 ? randomBetween(1, 3) : 0;
        const outOfStockItems = Math.random() < 0.08 ? randomBetween(1, 2) : 0;
        const itemsFulfilled = itemsOrdered - outOfStockItems;
        const fillRate = (itemsFulfilled / itemsOrdered) * 100;
        
        // Order value
        const avgItemValue = parseFloat(randomFloat(3.5, 12.5));
        const orderValue = parseFloat((itemsOrdered * avgItemValue).toFixed(2));
        
        facts.push({
          order_id: `ORD-${orderId}`,
          date_key: timeRecord.date_key,
          store_id: store.store_id,
          brand_id: store.brand_id,
          method_id: methodId,
          
          // Timestamps (stored as minutes from order placement for simplicity)
          order_placed_hour: orderPlacedHour,
          picking_start_delay_mins: pickingStartDelay,
          picking_duration_mins: pickingDuration,
          packing_duration_mins: packingDuration,
          delivery_duration_mins: deliveryDelay,
          total_lead_time_mins: totalLeadTimeMinutes,
          
          // SLA Performance
          sla_target_mins: slaMinutes,
          is_on_time: isOnTime,
          sla_variance_mins: slaMinutes - totalLeadTimeMinutes,
          
          // Order Metrics
          items_ordered: itemsOrdered,
          items_fulfilled: itemsFulfilled,
          items_substituted: substitutionRate,
          items_out_of_stock: outOfStockItems,
          fill_rate: parseFloat(fillRate.toFixed(2)),
          
          // Financial
          order_value: orderValue,
          
          // Quality Flags
          has_customer_complaint: Math.random() < 0.03,
          requires_redelivery: Math.random() < 0.02,
          
          // Source system tracking for data quality
          relational_timestamp: `${timeRecord.date_key}T${String(orderPlacedHour).padStart(2, '0')}:${String(randomBetween(0, 59)).padStart(2, '0')}:00`,
          event_log_received: Math.random() < 0.998 // 99.8% event log capture rate
        });
      }
    });
  });
  
  return facts;
})();

// Aggregated metrics for quick access
export const getAggregatedMetrics = () => {
  const totalOrders = factFulfillmentPerformance.length;
  const onTimeOrders = factFulfillmentPerformance.filter(f => f.is_on_time).length;
  const avgLeadTime = factFulfillmentPerformance.reduce((sum, f) => sum + f.total_lead_time_mins, 0) / totalOrders;
  const avgFillRate = factFulfillmentPerformance.reduce((sum, f) => sum + f.fill_rate, 0) / totalOrders;
  const totalRevenue = factFulfillmentPerformance.reduce((sum, f) => sum + f.order_value, 0);
  
  return {
    totalOrders,
    onTimeDeliveryRate: ((onTimeOrders / totalOrders) * 100).toFixed(1),
    avgLeadTimeMinutes: avgLeadTime.toFixed(0),
    avgFillRate: avgFillRate.toFixed(1),
    totalRevenue: totalRevenue.toFixed(2)
  };
};

// Get metrics by brand
export const getMetricsByBrand = () => {
  return dimBrand.map(brand => {
    const brandOrders = factFulfillmentPerformance.filter(f => f.brand_id === brand.brand_id);
    const totalOrders = brandOrders.length;
    const onTimeOrders = brandOrders.filter(f => f.is_on_time).length;
    const avgLeadTime = brandOrders.reduce((sum, f) => sum + f.total_lead_time_mins, 0) / totalOrders;
    const avgFillRate = brandOrders.reduce((sum, f) => sum + f.fill_rate, 0) / totalOrders;
    const totalRevenue = brandOrders.reduce((sum, f) => sum + f.order_value, 0);
    
    return {
      ...brand,
      totalOrders,
      onTimeDeliveryRate: ((onTimeOrders / totalOrders) * 100).toFixed(1),
      avgLeadTimeMinutes: Math.round(avgLeadTime),
      avgFillRate: avgFillRate.toFixed(1),
      totalRevenue: totalRevenue.toFixed(2),
      complaintsCount: brandOrders.filter(f => f.has_customer_complaint).length
    };
  });
};

// Get metrics by store for bottleneck analysis
export const getMetricsByStore = () => {
  return dimStoreLocation.map(store => {
    const storeOrders = factFulfillmentPerformance.filter(f => f.store_id === store.store_id);
    const totalOrders = storeOrders.length;
    const onTimeOrders = storeOrders.filter(f => f.is_on_time).length;
    const avgLeadTime = storeOrders.reduce((sum, f) => sum + f.total_lead_time_mins, 0) / totalOrders;
    const avgPickingDelay = storeOrders.reduce((sum, f) => sum + f.picking_start_delay_mins, 0) / totalOrders;
    const avgPickingDuration = storeOrders.reduce((sum, f) => sum + f.picking_duration_mins, 0) / totalOrders;
    const avgFillRate = storeOrders.reduce((sum, f) => sum + f.fill_rate, 0) / totalOrders;
    const ordersExceeding2HrSLA = storeOrders.filter(f => f.total_lead_time_mins > 120).length;
    
    const brand = dimBrand.find(b => b.brand_id === store.brand_id);
    
    return {
      ...store,
      brand_name: brand.brand_name,
      totalOrders,
      onTimeDeliveryRate: ((onTimeOrders / totalOrders) * 100).toFixed(1),
      avgLeadTimeMinutes: Math.round(avgLeadTime),
      avgPickingDelayMins: Math.round(avgPickingDelay),
      avgPickingDurationMins: Math.round(avgPickingDuration),
      avgFillRate: avgFillRate.toFixed(1),
      ordersExceeding2HrSLA,
      slaExceedanceRate: ((ordersExceeding2HrSLA / totalOrders) * 100).toFixed(1),
      bottleneckSeverity: avgLeadTime > 100 ? 'high' : avgLeadTime > 75 ? 'medium' : 'low'
    };
  });
};

// Get daily trend data
export const getDailyTrends = () => {
  return dimTime.map(day => {
    const dayOrders = factFulfillmentPerformance.filter(f => f.date_key === day.date_key);
    const totalOrders = dayOrders.length;
    const onTimeOrders = dayOrders.filter(f => f.is_on_time).length;
    const avgLeadTime = dayOrders.reduce((sum, f) => sum + f.total_lead_time_mins, 0) / (totalOrders || 1);
    const avgFillRate = dayOrders.reduce((sum, f) => sum + f.fill_rate, 0) / (totalOrders || 1);
    const totalRevenue = dayOrders.reduce((sum, f) => sum + f.order_value, 0);
    
    return {
      date: day.date_key,
      dayOfWeek: day.day_of_week,
      isWeekend: day.is_weekend,
      totalOrders,
      onTimeRate: totalOrders > 0 ? ((onTimeOrders / totalOrders) * 100).toFixed(1) : 0,
      avgLeadTime: Math.round(avgLeadTime),
      avgFillRate: avgFillRate.toFixed(1),
      revenue: totalRevenue.toFixed(2)
    };
  });
};

// Get metrics by fulfillment method
export const getMetricsByMethod = () => {
  return dimFulfillmentMethod.map(method => {
    const methodOrders = factFulfillmentPerformance.filter(f => f.method_id === method.method_id);
    const totalOrders = methodOrders.length;
    const onTimeOrders = methodOrders.filter(f => f.is_on_time).length;
    const avgLeadTime = methodOrders.reduce((sum, f) => sum + f.total_lead_time_mins, 0) / totalOrders;
    
    return {
      ...method,
      totalOrders,
      onTimeDeliveryRate: ((onTimeOrders / totalOrders) * 100).toFixed(1),
      avgLeadTimeMinutes: Math.round(avgLeadTime),
      orderShare: ((totalOrders / factFulfillmentPerformance.length) * 100).toFixed(1)
    };
  });
};

// Data Quality Metrics - comparing relational vs non-relational sources
export const getDataQualityMetrics = () => {
  const totalRecords = factFulfillmentPerformance.length;
  const recordsWithEventLog = factFulfillmentPerformance.filter(f => f.event_log_received).length;
  const matchRate = (recordsWithEventLog / totalRecords) * 100;
  
  const discrepancies = factFulfillmentPerformance.filter(f => !f.event_log_received);
  
  // Group discrepancies by date
  const discrepanciesByDate = dimTime.slice(-7).map(day => {
    const dayDiscrepancies = discrepancies.filter(d => d.date_key === day.date_key);
    const dayTotal = factFulfillmentPerformance.filter(f => f.date_key === day.date_key).length;
    return {
      date: day.date_key,
      discrepancies: dayDiscrepancies.length,
      total: dayTotal,
      matchRate: (((dayTotal - dayDiscrepancies.length) / dayTotal) * 100).toFixed(2)
    };
  });
  
  return {
    totalRecords,
    recordsWithEventLog,
    matchRate: matchRate.toFixed(2),
    totalDiscrepancies: discrepancies.length,
    discrepanciesByDate,
    dataIntegrityStatus: matchRate >= 99.9 ? 'healthy' : matchRate >= 99 ? 'warning' : 'critical'
  };
};

// Week-over-Week calculations
export const getWoWMetrics = () => {
  const today = new Date('2026-02-03');
  
  // Current week (last 7 days)
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - 6);
  
  // Previous week
  const prevWeekStart = new Date(today);
  prevWeekStart.setDate(today.getDate() - 13);
  const prevWeekEnd = new Date(today);
  prevWeekEnd.setDate(today.getDate() - 7);
  
  const currentWeekOrders = factFulfillmentPerformance.filter(f => {
    const orderDate = new Date(f.date_key);
    return orderDate >= currentWeekStart && orderDate <= today;
  });
  
  const prevWeekOrders = factFulfillmentPerformance.filter(f => {
    const orderDate = new Date(f.date_key);
    return orderDate >= prevWeekStart && orderDate < prevWeekEnd;
  });
  
  const currentOnTime = currentWeekOrders.filter(f => f.is_on_time).length / currentWeekOrders.length * 100;
  const prevOnTime = prevWeekOrders.filter(f => f.is_on_time).length / prevWeekOrders.length * 100;
  
  const currentAvgLead = currentWeekOrders.reduce((sum, f) => sum + f.total_lead_time_mins, 0) / currentWeekOrders.length;
  const prevAvgLead = prevWeekOrders.reduce((sum, f) => sum + f.total_lead_time_mins, 0) / prevWeekOrders.length;
  
  return {
    currentWeekOrders: currentWeekOrders.length,
    prevWeekOrders: prevWeekOrders.length,
    ordersGrowth: (((currentWeekOrders.length - prevWeekOrders.length) / prevWeekOrders.length) * 100).toFixed(1),
    currentOnTimeRate: currentOnTime.toFixed(1),
    prevOnTimeRate: prevOnTime.toFixed(1),
    onTimeChange: (currentOnTime - prevOnTime).toFixed(1),
    currentAvgLeadTime: Math.round(currentAvgLead),
    prevAvgLeadTime: Math.round(prevAvgLead),
    leadTimeChange: Math.round(currentAvgLead - prevAvgLead)
  };
};
