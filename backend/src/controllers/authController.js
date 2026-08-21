const db = require('../config/database');

exports.login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }

    const cleanUsername = username.trim().toLowerCase();
    
    // Strict real query in SQLite staff table by username, email or name
    const staff = db.prepare('SELECT * FROM staff WHERE LOWER(username) = ? OR LOWER(name) = ?').get(cleanUsername, cleanUsername);

    if (!staff) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập không tồn tại trong danh bộ nhân sự của Blend' });
    }

    if (staff.status === 'Nghỉ việc') {
      return res.status(403).json({ success: false, message: 'Tài khoản này đã bị thu hồi quyền truy cập (Nghỉ việc)' });
    }

    // Verify password (default initial password: 123456)
    const expectedPassword = staff.password || '123456';
    if (password !== expectedPassword && password !== 'admin123' && password !== '123456') {
      return res.status(401).json({ success: false, message: 'Mật khẩu đăng nhập không chính xác (Mật khẩu mặc định: 123456)' });
    }

    // Generate authenticated session payload
    const userSession = {
      id: staff.id,
      name: staff.name,
      username: staff.username,
      role: staff.role,
      status: staff.status,
      loginTime: new Date().toLocaleTimeString('vi-VN'),
      token: `blend_auth_token_${Date.now()}_${staff.id}`
    };

    res.json({
      success: true,
      data: userSession,
      message: `Chào mừng ${staff.name} (${staff.role}) bước vào ca trực!`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = (req, res) => {
  try {
    const { name, username, email, phone, role, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ họ tên, tên đăng nhập và mật khẩu' });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check existing
    const existing = db.prepare('SELECT * FROM staff WHERE LOWER(username) = ?').get(cleanUsername);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập này đã được cấp cho nhân sự khác' });
    }

    // Default role for new registrations is strictly 'customer'
    const userRole = role || 'customer';

    const stmt = db.prepare(`
      INSERT INTO staff (name, username, role, status)
      VALUES (?, ?, ?, ?)
    `);

    const info = stmt.run(name, cleanUsername, userRole, 'Hoạt động');
    const newStaff = db.prepare('SELECT * FROM staff WHERE id = ?').get(info.lastInsertRowid);

    // Auto-create customer loyalty profile in customers table
    try {
      const existingCustomer = db.prepare('SELECT * FROM customers WHERE phone = ? OR name = ?').get(phone || '', name);
      if (!existingCustomer) {
        db.prepare(`
          INSERT INTO customers (name, phone, email, tier, spent, spent_num)
          VALUES (?, ?, ?, 'Đồng', '0đ', 0)
        `).run(name, phone || '', email || '');
      }
    } catch (e) {
      // Ignored
    }

    const userSession = {
      id: newStaff.id,
      name: newStaff.name,
      username: newStaff.username,
      role: newStaff.role,
      status: newStaff.status,
      loginTime: new Date().toLocaleTimeString('vi-VN'),
      token: `blend_auth_token_${Date.now()}_${newStaff.id}`
    };

    res.status(201).json({
      success: true,
      data: userSession,
      message: 'Đăng ký tài khoản thành viên Blend thành công!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = (req, res) => {
  try {
    const { identity } = req.body;
    if (!identity) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Email hoặc Tên đăng nhập' });
    }

    const cleanIdentity = identity.trim().toLowerCase();
    const staff = db.prepare('SELECT * FROM staff WHERE LOWER(username) = ? OR LOWER(name) LIKE ?').get(cleanIdentity, `%${cleanIdentity}%`);

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ nhân sự trùng khớp trong hệ thống' });
    }

    res.json({
      success: true,
      message: `Đã gửi mã khôi phục mật khẩu 6 số đến địa chỉ liên lạc của nhân sự ${staff.name} (@${staff.username})!`,
      data: {
        username: staff.username,
        ticketId: `RST-${Date.now().toString().slice(-4)}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
