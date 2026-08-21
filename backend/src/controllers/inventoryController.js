const db = require('../config/database');

exports.getAllInventory = (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM inventory ORDER BY created_at ASC').all();
    // Dynamically update status based on current qty vs min
    const mapped = items.map(item => ({
      ...item,
      status: item.qty <= item.min ? 'warning' : 'ok'
    }));
    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInventoryItem = (req, res) => {
  try {
    const { id, name, unit, qty, min } = req.body;
    if (!name || !unit) {
      return res.status(400).json({ success: false, message: 'Thiếu tên nguyên liệu hoặc đơn vị tính' });
    }

    const itemId = id || `I${String(Date.now()).slice(-3)}`;
    const quantity = parseInt(qty, 10) || 0;
    const minQuantity = parseInt(min, 10) || 0;
    const status = quantity <= minQuantity ? 'warning' : 'ok';

    const stmt = db.prepare(`
      INSERT INTO inventory (id, name, unit, qty, min, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(itemId, name, unit, quantity, minQuantity, status);

    const newItem = db.prepare('SELECT * FROM inventory WHERE id = ?').get(itemId);
    res.status(201).json({ success: true, data: newItem, message: 'Thêm nguyên liệu thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStock = (req, res) => {
  try {
    const { id } = req.params;
    const { qty, name, unit, min } = req.body;

    const existing = db.prepare('SELECT * FROM inventory WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nguyên liệu' });
    }

    const newQty = qty !== undefined ? parseInt(qty, 10) : existing.qty;
    const newMin = min !== undefined ? parseInt(min, 10) : existing.min;
    const newName = name || existing.name;
    const newUnit = unit || existing.unit;
    const newStatus = newQty <= newMin ? 'warning' : 'ok';

    db.prepare(`
      UPDATE inventory
      SET name = ?, unit = ?, qty = ?, min = ?, status = ?
      WHERE id = ?
    `).run(newName, newUnit, newQty, newMin, newStatus, id);

    const updated = db.prepare('SELECT * FROM inventory WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Cập nhật kho thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInventoryItem = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM inventory WHERE id = ?').run(id);
    res.json({ success: true, message: 'Đã xóa nguyên liệu khỏi kho' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Real Warehouse Import/Export Dockets
exports.getAllDockets = (req, res) => {
  try {
    const dockets = db.prepare('SELECT * FROM inventory_dockets ORDER BY created_at DESC').all();
    res.json({ success: true, data: dockets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDocket = (req, res) => {
  try {
    const { id, type, item_name, qty, source, date, clerk } = req.body;
    const docketId = id || `DK-${String(Date.now()).slice(-4)}`;
    const docketDate = date || new Date().toLocaleDateString('vi-VN');

    db.prepare(`
      INSERT INTO inventory_dockets (id, type, item_name, qty, source, date, clerk)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(docketId, type || 'NHẬP KHO', item_name, qty, source, docketDate, clerk || 'Thủ kho');

    const newDocket = db.prepare('SELECT * FROM inventory_dockets WHERE id = ?').get(docketId);
    res.status(201).json({ success: true, data: newDocket, message: 'Đã lập biên bản kho thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
