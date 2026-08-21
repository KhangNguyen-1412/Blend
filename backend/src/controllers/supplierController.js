const db = require('../config/database');

// GET /api/suppliers
exports.getAll = (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = 'SELECT * FROM suppliers WHERE 1=1';
    const params = [];

    if (category && category !== 'Tất cả') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (status && status !== 'Tất cả') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR code LIKE ? OR phone LIKE ? OR contact_person LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY id DESC';
    const suppliers = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: suppliers,
      count: suppliers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/suppliers/:id
exports.getById = (req, res) => {
  try {
    const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(req.params.id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/suppliers
exports.create = (req, res) => {
  try {
    const { name, code, contact_person, phone, email, address, category, status, debt, debt_num, rating, notes } = req.body;
    if (!name || !phone || !category) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Tên đối tác, Số điện thoại và Nhóm cung ứng' });
    }

    const supplierCode = code || `NCC-${Date.now().toString().slice(-4)}`;
    const formattedDebt = debt || '0đ';
    const numDebt = debt_num || 0;

    const stmt = db.prepare(`
      INSERT INTO suppliers (name, code, contact_person, phone, email, address, category, status, debt, debt_num, rating, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      name,
      supplierCode,
      contact_person || '',
      phone,
      email || '',
      address || '',
      category,
      status || 'Đang hợp tác',
      formattedDebt,
      numDebt,
      rating || 5.0,
      notes || ''
    );

    const newSupplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(info.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: newSupplier,
      message: `Đã thiết lập hồ sơ nhà cung cấp "${name}" vào danh bộ đối tác!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/suppliers/:id
exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, contact_person, phone, email, address, category, status, debt, debt_num, rating, notes } = req.body;

    const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }

    const stmt = db.prepare(`
      UPDATE suppliers
      SET name = ?, code = ?, contact_person = ?, phone = ?, email = ?, address = ?, category = ?, status = ?, debt = ?, debt_num = ?, rating = ?, notes = ?
      WHERE id = ?
    `);

    stmt.run(
      name || supplier.name,
      code || supplier.code,
      contact_person !== undefined ? contact_person : supplier.contact_person,
      phone || supplier.phone,
      email !== undefined ? email : supplier.email,
      address !== undefined ? address : supplier.address,
      category || supplier.category,
      status || supplier.status,
      debt !== undefined ? debt : supplier.debt,
      debt_num !== undefined ? debt_num : supplier.debt_num,
      rating !== undefined ? rating : supplier.rating,
      notes !== undefined ? notes : supplier.notes,
      id
    );

    const updated = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id);
    res.json({
      success: true,
      data: updated,
      message: 'Cập nhật thông tin đối tác cung ứng thành công!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/suppliers/:id
exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id);
    if (!supplier) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
    }

    db.prepare('DELETE FROM suppliers WHERE id = ?').run(id);
    res.json({
      success: true,
      message: `Đã thu hồi hồ sơ đối tác "${supplier.name}" khỏi danh bộ!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
