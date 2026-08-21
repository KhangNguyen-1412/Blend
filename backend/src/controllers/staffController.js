const db = require('../config/database');

exports.getAllStaff = (req, res) => {
  try {
    const staff = db.prepare("SELECT * FROM staff WHERE LOWER(role) != 'customer' ORDER BY created_at ASC").all();
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStaff = (req, res) => {
  try {
    const { name, username, role, status, password } = req.body;
    if (!name || !username || !role) {
      return res.status(400).json({ success: false, message: 'Thiếu tên nhân viên, username hoặc vai trò' });
    }

    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');

    // Pre-check if username already exists
    const existing = db.prepare('SELECT id FROM staff WHERE LOWER(username) = ?').get(cleanUsername);
    if (existing) {
      return res.status(400).json({ success: false, message: `Tên đăng nhập "@${cleanUsername}" đã tồn tại trong hệ thống. Vui lòng chọn tên khác!` });
    }

    const initialPassword = (password && password.trim()) ? password.trim() : '123456';

    const stmt = db.prepare(`
      INSERT INTO staff (name, username, password, role, status)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = stmt.run(name, cleanUsername, initialPassword, role, status || 'Hoạt động');
    const newStaff = db.prepare('SELECT * FROM staff WHERE id = ?').get(info.lastInsertRowid);

    res.status(201).json({ success: true, data: newStaff, message: 'Cấp tài khoản nhân sự thành công (Mật khẩu mặc định: 123456)' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập (username) đã tồn tại trong hệ thống' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStaff = (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, role, status, password } = req.body;

    const existing = db.prepare('SELECT * FROM staff WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' });
    }

    const cleanUsername = username ? username.trim().toLowerCase().replace(/\s+/g, '') : existing.username;

    // Check if updating to a username that belongs to someone else
    if (cleanUsername !== existing.username) {
      const duplicate = db.prepare('SELECT id FROM staff WHERE LOWER(username) = ? AND id != ?').get(cleanUsername, id);
      if (duplicate) {
        return res.status(400).json({ success: false, message: `Tên đăng nhập "@${cleanUsername}" đã tồn tại cho nhân sự khác!` });
      }
    }

    db.prepare(`
      UPDATE staff
      SET name = ?, username = ?, role = ?, status = ?, password = ?
      WHERE id = ?
    `).run(
      name || existing.name,
      cleanUsername,
      role || existing.role,
      status || existing.status,
      password ? password.trim() : (existing.password || '123456'),
      id
    );

    const updated = db.prepare('SELECT * FROM staff WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Cập nhật thông tin nhân sự thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStaff = (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM staff WHERE id = ?').run(id);
    res.json({ success: true, message: 'Đã xóa tài khoản nhân viên' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
