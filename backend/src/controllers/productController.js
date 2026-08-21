const db = require('../config/database');

exports.getAllProducts = (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'Tất cả danh mục') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const products = db.prepare(query).all(...params);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = (req, res) => {
  try {
    const { id, name, category, price, variants, status, image } = req.body;
    
    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc (Tên, Danh mục, Giá)' });
    }

    // Auto generate ID if not provided
    const productId = id || `P${String(Date.now()).slice(-4)}`;
    const priceClean = String(price).replace(/[^0-9]/g, '');
    const priceNum = parseInt(priceClean, 10) || 0;
    const formattedPrice = isNaN(priceNum) ? price : `${priceNum.toLocaleString('vi-VN')}đ`;

    const stmt = db.prepare(`
      INSERT INTO products (id, name, category, price, price_num, variants, status, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(productId, name, category, formattedPrice, priceNum, variants || '', status || 'Còn hàng', image || '');

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    res.status(201).json({ success: true, data: newProduct, message: 'Thêm sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, variants, status, image } = req.body;

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    const priceClean = String(price || existing.price).replace(/[^0-9]/g, '');
    const priceNum = parseInt(priceClean, 10) || existing.price_num;
    const formattedPrice = isNaN(priceNum) ? (price || existing.price) : `${priceNum.toLocaleString('vi-VN')}đ`;

    const stmt = db.prepare(`
      UPDATE products
      SET name = ?, category = ?, price = ?, price_num = ?, variants = ?, status = ?, image = ?
      WHERE id = ?
    `);

    stmt.run(
      name || existing.name,
      category || existing.category,
      formattedPrice,
      priceNum,
      variants !== undefined ? variants : existing.variants,
      status || existing.status,
      image !== undefined ? image : (existing.image || ''),
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
