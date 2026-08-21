const db = require('../config/database');

exports.getAllCustomers = (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers ORDER BY spent_num DESC').all();
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCustomer = (req, res) => {
  try {
    const { name, phone, email, tier, spent } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Thiếu tên hoặc số điện thoại khách hàng' });
    }

    const spentClean = String(spent || '0').replace(/[^0-9]/g, '');
    const spentNum = parseInt(spentClean, 10) || 0;
    const formattedSpent = `${spentNum.toLocaleString('vi-VN')}đ`;

    const stmt = db.prepare(`
      INSERT INTO customers (name, phone, email, tier, spent, spent_num)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(name, phone, email || '', tier || 'Đồng', formattedSpent, spentNum);
    const newCustomer = db.prepare('SELECT * FROM customers WHERE id = ?').get(info.lastInsertRowid);

    res.status(201).json({ success: true, data: newCustomer, message: 'Thêm khách hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCustomer = (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, tier, spent } = req.body;

    const existing = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng' });
    }

    let formattedSpent = existing.spent;
    let spentNum = existing.spent_num;
    if (spent !== undefined) {
      const spentClean = String(spent).replace(/[^0-9]/g, '');
      spentNum = parseInt(spentClean, 10) || 0;
      formattedSpent = `${spentNum.toLocaleString('vi-VN')}đ`;
    }

    db.prepare(`
      UPDATE customers
      SET name = ?, phone = ?, email = ?, tier = ?, spent = ?, spent_num = ?
      WHERE id = ?
    `).run(
      name || existing.name,
      phone || existing.phone,
      email !== undefined ? email : existing.email,
      tier || existing.tier,
      formattedSpent,
      spentNum,
      id
    );

    const updated = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Cập nhật khách hàng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCustomer = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM customers WHERE id = ?').run(id);
    res.json({ success: true, message: 'Đã xóa khách hàng' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
