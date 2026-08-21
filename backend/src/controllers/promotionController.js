const db = require('../config/database');

exports.getAllPromotions = (req, res) => {
  try {
    const promotions = db.prepare('SELECT * FROM promotions ORDER BY created_at DESC').all();
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPromotion = (req, res) => {
  try {
    const { code, discount, condition, expiry, status } = req.body;
    if (!code || !discount) {
      return res.status(400).json({ success: false, message: 'Thiếu mã voucher hoặc mức giảm giá' });
    }

    const cleanCode = code.trim().toUpperCase();

    const stmt = db.prepare(`
      INSERT INTO promotions (code, discount, condition, expiry, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(cleanCode, discount, condition || '', expiry || 'Không thời hạn', status || 'Đang chạy');
    const newPromo = db.prepare('SELECT * FROM promotions WHERE id = ?').get(info.lastInsertRowid);

    res.status(201).json({ success: true, data: newPromo, message: 'Tạo voucher thành công' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ success: false, message: 'Mã voucher này đã tồn tại' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePromotion = (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, condition, expiry, status } = req.body;

    const existing = db.prepare('SELECT * FROM promotions WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khuyến mãi' });
    }

    db.prepare(`
      UPDATE promotions
      SET code = ?, discount = ?, condition = ?, expiry = ?, status = ?
      WHERE id = ?
    `).run(
      code ? code.trim().toUpperCase() : existing.code,
      discount || existing.discount,
      condition !== undefined ? condition : existing.condition,
      expiry !== undefined ? expiry : existing.expiry,
      status || existing.status,
      id
    );

    const updated = db.prepare('SELECT * FROM promotions WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Cập nhật khuyến mãi thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePromotion = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM promotions WHERE id = ?').run(id);
    res.json({ success: true, message: 'Đã xóa mã khuyến mãi' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
