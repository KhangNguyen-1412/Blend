const db = require('../config/database');

exports.getAllOrders = (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM orders';
    const params = [];

    if (status && status !== 'Tất cả') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const orders = db.prepare(query).all(...params);
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = (req, res) => {
  try {
    const { id, customer, total, payment, notes, items, status } = req.body;
    if (!customer || !total) {
      return res.status(400).json({ success: false, message: 'Thiếu tên khách hàng hoặc tổng tiền' });
    }

    const orderId = id || `ORD-${String(Date.now()).slice(-3)}`;
    const totalClean = String(total).replace(/[^0-9]/g, '');
    const totalNum = parseInt(totalClean, 10) || 0;
    const formattedTotal = `${totalNum.toLocaleString('vi-VN')}đ`;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const itemsStr = typeof items === 'object' ? JSON.stringify(items) : (items || '');

    const stmt = db.prepare(`
      INSERT INTO orders (id, customer, total, total_num, time, status, payment, notes, items)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      orderId, 
      customer, 
      formattedTotal, 
      totalNum, 
      timeStr, 
      status || 'Đang pha chế', 
      payment || 'Tiền mặt', 
      notes || '',
      itemsStr
    );

    const newOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    res.status(201).json({ success: true, data: newOrder, message: 'Tạo đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.advanceOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    // Progression workflow:
    // Chờ xác nhận -> Đang pha chế -> Đang giao -> Đã hoàn thành
    let nextStatus = order.status;
    if (order.status === 'Chờ xác nhận') {
      nextStatus = 'Đang pha chế';
    } else if (order.status === 'Đang pha chế') {
      nextStatus = 'Đang giao';
    } else if (order.status === 'Đang giao') {
      nextStatus = 'Đã hoàn thành';

      // Automatically accumulate customer spending & upgrade loyalty tier in real-time
      try {
        const cust = db.prepare('SELECT * FROM customers WHERE LOWER(name) = LOWER(?)').get(order.customer);
        if (cust) {
          const newSpentNum = (cust.spent_num || 0) + (order.total_num || 0);
          const newSpentFormatted = `${newSpentNum.toLocaleString('vi-VN')}đ`;
          
          let newTier = 'Đồng';
          if (newSpentNum >= 5000000) newTier = 'Kim Cương';
          else if (newSpentNum >= 2000000) newTier = 'Vàng';
          else if (newSpentNum >= 500000) newTier = 'Bạc';

          db.prepare('UPDATE customers SET spent = ?, spent_num = ?, tier = ? WHERE id = ?')
            .run(newSpentFormatted, newSpentNum, newTier, cust.id);
        }
      } catch (e) {
        // Ignored
      }
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(nextStatus, id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    res.json({ success: true, data: updated, message: `Đã chuyển trạng thái sang "${nextStatus}"` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    const newStatus = status || existing.status;
    const newNotes = notes !== undefined ? notes : existing.notes;

    db.prepare('UPDATE orders SET status = ?, notes = ? WHERE id = ?').run(newStatus, newNotes, id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    res.json({ success: true, data: updated, message: 'Cập nhật trạng thái đơn thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.refundOrder = (req, res) => {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    const noteAppend = order.notes ? `${order.notes} (Đã Refund)` : 'Đã hoàn tiền (Refund)';
    db.prepare("UPDATE orders SET status = 'Đã hủy', notes = ? WHERE id = ?").run(noteAppend, id);

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Đã hoàn tiền (Refund) và chuyển đơn sang trạng thái Đã hủy' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM orders WHERE id = ?').run(id);
    res.json({ success: true, message: 'Đã xóa đơn hàng' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
