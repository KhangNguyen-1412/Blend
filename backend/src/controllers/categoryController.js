const db = require('../config/database');

exports.getAll = (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT 
        c.id,
        c.name,
        c.icon,
        c.description,
        c.created_at,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON LOWER(p.category) = LOWER(c.name)
      GROUP BY c.id
      ORDER BY c.id ASC
    `).all();

    res.json({
      success: true,
      data: categories,
      total: categories.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = (req, res) => {
  try {
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Tên danh mục không được để trống' });
    }

    const cleanName = name.trim();
    const existing = db.prepare('SELECT * FROM categories WHERE LOWER(name) = ?').get(cleanName.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Danh mục này đã tồn tại trong thực đơn' });
    }

    const stmt = db.prepare(`
      INSERT INTO categories (name, icon, description)
      VALUES (?, ?, ?)
    `);

    const info = stmt.run(cleanName, icon || 'fa-mug-hot', description || '');
    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: newCategory,
      message: `Đã khai báo danh mục "${cleanName}" vào thực đơn!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const categoryId = req.params.id;

    const oldCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);
    if (!oldCategory) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }

    const cleanName = name ? name.trim() : oldCategory.name;

    // If renaming, check uniqueness
    if (cleanName.toLowerCase() !== oldCategory.name.toLowerCase()) {
      const duplicate = db.prepare('SELECT * FROM categories WHERE LOWER(name) = ? AND id != ?').get(cleanName.toLowerCase(), categoryId);
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Tên danh mục mới bị trùng với danh mục khác' });
      }

      // Cascade update category name in products table
      db.prepare('UPDATE products SET category = ? WHERE category = ?').run(cleanName, oldCategory.name);
    }

    const stmt = db.prepare(`
      UPDATE categories
      SET name = ?, icon = ?, description = ?
      WHERE id = ?
    `);

    stmt.run(cleanName, icon || oldCategory.icon, description !== undefined ? description : oldCategory.description, categoryId);
    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);

    res.json({
      success: true,
      data: updated,
      message: `Đã cập nhật thông tin danh mục "${cleanName}"!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
    }

    // Check if there are active products
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE LOWER(category) = ?').get(category.name.toLowerCase()).count;
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục "${category.name}" vì đang có ${productCount} món đồ uống trực thuộc. Vui lòng chuyển hoặc xóa món trước!`
      });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(categoryId);

    res.json({
      success: true,
      message: `Đã xóa danh mục "${category.name}" khỏi hệ thống!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
