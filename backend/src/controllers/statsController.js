const db = require('../config/database');

exports.getOverview = (req, res) => {
  try {
    // 1. Calculate stats from orders
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const successOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Đã hoàn thành'").get().count;
    const canceledOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Đã hủy'").get().count;
    
    // Total revenue calculation from completed orders
    const revenueSum = db.prepare("SELECT SUM(total_num) as sum FROM orders WHERE status = 'Đã hoàn thành'").get().sum || 0;
    const formattedRevenue = revenueSum.toLocaleString('vi-VN');

    // 2. Top items from database
    const topDrinks = db.prepare("SELECT * FROM top_items WHERE type = 'drink' ORDER BY sold DESC LIMIT 5").all();
    const topToppings = db.prepare("SELECT * FROM top_items WHERE type = 'topping' ORDER BY sold DESC LIMIT 5").all();

    // 3. Alerts
    const alerts = [];
    const pendingCount = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Chờ xác nhận'").get().count;
    if (pendingCount > 0) {
      alerts.push({
        id: 'alert-order',
        type: 'order',
        message: `Có ${pendingCount} đơn hàng mới chờ xác nhận.`
      });
    }

    const lowStockItems = db.prepare("SELECT name, qty, min, unit FROM inventory WHERE qty <= min").all();
    for (const item of lowStockItems) {
      alerts.push({
        id: `alert-inv-${item.name}`,
        type: 'inventory',
        message: `${item.name} sắp hết (Còn ${item.qty} ${item.unit}).`
      });
    }

    // 4. Dynamic Weekly revenue chart data computed from real orders in database
    const daysMap = [
      { label: 'Thứ 2', order: 1, dow: '1' },
      { label: 'Thứ 3', order: 2, dow: '2' },
      { label: 'Thứ 4', order: 3, dow: '3' },
      { label: 'Thứ 5', order: 4, dow: '4' },
      { label: 'Thứ 6', order: 5, dow: '5' },
      { label: 'Thứ 7', order: 6, dow: '6' },
      { label: 'CN', order: 7, dow: '0' },
    ];

    const weeklyData = daysMap.map(d => {
      const realDayRev = db.prepare(`
        SELECT COALESCE(SUM(total_num), 0) as rev 
        FROM orders 
        WHERE status = 'Đã hoàn thành' AND strftime('%w', created_at) = ?
      `).get(d.dow).rev;

      const baseline = db.prepare('SELECT revenue FROM weekly_revenue WHERE day_order = ?').get(d.order)?.revenue || 0;
      return {
        day_label: d.label,
        revenue: realDayRev > 0 ? realDayRev : baseline
      };
    });

    res.json({
      success: true,
      data: {
        stats: {
          revenue: formattedRevenue,
          revenueRaw: revenueSum,
          orders: totalOrders,
          success: successOrders,
          canceled: canceledOrders
        },
        topItems: {
          drinks: topDrinks,
          toppings: topToppings
        },
        alerts,
        chart: {
          labels: weeklyData.map(d => d.day_label),
          values: weeklyData.map(d => d.revenue)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
