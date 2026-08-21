const db = require('../config/database');

function seedDatabase() {
  // 1. Initialize master categories if empty
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
  if (catCount === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (name, icon, description)
      VALUES (?, ?, ?)
    `);

    const initialCategories = [
      { name: "Cà phê", icon: "fa-mug-hot", description: "Cà phê rang mộc, cà phê pha máy & ủ lạnh truyền thống" },
      { name: "Trà sữa", icon: "fa-glass-water", description: "Trà sữa đậm vị lá trà tự nhiên kết hợp kem phô mai béo ngậy" },
      { name: "Trà trái cây", icon: "fa-lemon", description: "Trà tươi thanh mát kết hợp hoa quả nhiệt đới tươi mới" },
      { name: "Topping", icon: "fa-layer-group", description: "Phụ liệu trân châu, thạch củ năng, kem macchiato tự làm" },
      { name: "Bánh ngọt", icon: "fa-cake-candles", description: "Bánh ngọt tươi ngon dùng kèm trà và cà phê mỗi ngày" },
    ];

    for (const c of initialCategories) {
      try {
        insertCat.run(c.name, c.icon, c.description);
      } catch (err) {
        // Ignored
      }
    }
  }

  // 2. Ensure default admin account exists
  const adminExists = db.prepare('SELECT * FROM staff WHERE username = ?').get('admin_khang');
  if (!adminExists) {
    db.prepare(`
      INSERT INTO staff (name, username, role, status)
      VALUES (?, ?, ?, ?)
    `).run('Admin Khang (Chủ Biên Quản Trị)', 'admin_khang', 'Quản lý', 'Hoạt động');
  }

  const thukhoExists = db.prepare('SELECT * FROM staff WHERE username = ?').get('thukho');
  if (!thukhoExists) {
    db.prepare(`
      INSERT INTO staff (name, username, role, status)
      VALUES (?, ?, ?, ?)
    `).run('Đặng Gia Bảo (Thủ Kho Trưởng)', 'thukho', 'Thủ kho', 'Hoạt động');
  }
}

module.exports = { seedDatabase };
