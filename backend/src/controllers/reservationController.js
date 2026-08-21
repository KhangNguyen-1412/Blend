const db = require('../config/database');

exports.getAllReservations = (req, res) => {
  try {
    const { status, search, date } = req.query;
    let query = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];

    if (status && status !== 'all' && status !== 'Tất cả') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    if (search) {
      query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR note LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    query += ' ORDER BY date DESC, time DESC, id DESC';

    const reservations = db.prepare(query).all(...params);
    res.json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReservationById = (req, res) => {
  try {
    const { id } = req.params;
    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu đặt chỗ' });
    }
    res.json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReservation = (req, res) => {
  try {
    const { name, phone, email, guests, date, time, area, table_number, note, status } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Số điện thoại, Ngày và Giờ đặt bàn' 
      });
    }

    const stmt = db.prepare(`
      INSERT INTO reservations (name, phone, email, guests, date, time, area, table_number, note, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const guestsNum = parseInt(guests, 10) || 2;
    const areaVal = area || 'Khu vực đọc báo in cổ điển';
    const tableNumVal = table_number ? table_number.trim() : '';
    const statusVal = status || 'Chờ xác nhận';

    const info = stmt.run(
      name.trim(), 
      phone.trim(), 
      email ? email.trim() : '', 
      guestsNum, 
      date, 
      time, 
      areaVal, 
      tableNumVal,
      note ? note.trim() : '', 
      statusVal
    );

    const newReservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(info.lastInsertRowid);

    res.status(201).json({ 
      success: true, 
      data: newReservation, 
      message: 'Ghi danh phiếu đặt chỗ thành công! Đội ngũ Blend sẽ liên hệ sớm.' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReservation = (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, guests, date, time, area, table_number, note, status } = req.body;

    const existing = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu đặt chỗ' });
    }

    const guestsNum = guests !== undefined ? parseInt(guests, 10) || existing.guests : existing.guests;

    db.prepare(`
      UPDATE reservations
      SET name = ?, phone = ?, email = ?, guests = ?, date = ?, time = ?, area = ?, table_number = ?, note = ?, status = ?
      WHERE id = ?
    `).run(
      name !== undefined ? name.trim() : existing.name,
      phone !== undefined ? phone.trim() : existing.phone,
      email !== undefined ? email.trim() : existing.email,
      guestsNum,
      date !== undefined ? date : existing.date,
      time !== undefined ? time : existing.time,
      area !== undefined ? area : existing.area,
      table_number !== undefined ? table_number.trim() : existing.table_number || '',
      note !== undefined ? note.trim() : existing.note,
      status !== undefined ? status : existing.status,
      id
    );

    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: 'Cập nhật phiếu đặt chỗ thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReservation = (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu đặt chỗ' });
    }

    db.prepare('DELETE FROM reservations WHERE id = ?').run(id);
    res.json({ success: true, message: 'Đã xóa phiếu đặt chỗ thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
