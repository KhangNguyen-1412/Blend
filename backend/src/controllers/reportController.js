const db = require('../config/database');

exports.getReportSummary = (req, res) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const completedOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Đã hoàn thành'").get().count;
    const canceledOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Đã hủy'").get().count;
    const totalRevenue = db.prepare("SELECT SUM(total_num) as sum FROM orders WHERE status = 'Đã hoàn thành'").get().sum || 0;
    const avgOrderValue = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

    // Dynamic Category sales breakdown computed directly from products and sales database
    const categoryRows = db.prepare(`
      SELECT 
        p.category, 
        COUNT(p.id) as product_count,
        COALESCE(SUM(t.sold), 0) as items_sold,
        COALESCE(SUM(t.sold * p.price_num), 0) as revenue_num
      FROM products p
      LEFT JOIN top_items t ON t.name = p.name
      GROUP BY p.category
    `).all();

    const categories = categoryRows.map(c => ({
      category: c.category,
      items_sold: c.items_sold || 0,
      revenue: `${(c.revenue_num || 0).toLocaleString('vi-VN')}đ`
    }));

    // Inventory summary items directly from SQLite
    const inventoryItems = db.prepare('SELECT id, name, unit, qty, min, status FROM inventory LIMIT 15').all();

    res.json({
      success: true,
      data: {
        total_revenue: `${totalRevenue.toLocaleString('vi-VN')}đ`,
        total_orders: completedOrders,
        canceled_orders: canceledOrders,
        avg_order_value: `${avgOrderValue.toLocaleString('vi-VN')}đ`,
        category_breakdown: categories,
        inventory_summary: inventoryItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generates an Excel Spreadsheet (.xls) styled with Blend's Cerulean & Jasper Brand Identity
 */
exports.exportExcel = (req, res) => {
  try {
    const { type = 'full', date = new Date().toISOString().split('T')[0] } = req.query;
    const todayStr = new Date().toLocaleDateString('vi-VN');
    const timeStr = new Date().toLocaleTimeString('vi-VN');

    // Data fetching
    const orders = db.prepare('SELECT id, customer, total, time, payment, status, notes, created_at FROM orders ORDER BY id DESC').all();
    const inventory = db.prepare('SELECT id, name, unit, qty, min, status FROM inventory ORDER BY id ASC').all();
    const customers = db.prepare('SELECT id, name, phone, email, tier, spent FROM customers ORDER BY spent_num DESC').all();
    const reservations = db.prepare('SELECT id, name, phone, email, guests, date, time, area, note, status FROM reservations ORDER BY id DESC').all();

    const totalRevenueNum = db.prepare("SELECT SUM(total_num) as sum FROM orders WHERE status = 'Đã hoàn thành'").get().sum || 0;
    const totalOrdersCount = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'Đã hoàn thành'").get().count || 0;
    const avgOrderNum = totalOrdersCount > 0 ? Math.round(totalRevenueNum / totalOrdersCount) : 0;

    let excelHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>So_Cai_Blend_Roastery</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Times New Roman', 'Newsreader', Georgia, serif; color: #161413; }
          .masthead { font-size: 18pt; font-weight: bold; color: #124874; text-align: center; }
          .sub-masthead { font-size: 10pt; color: #6E675F; text-align: center; }
          .title { font-size: 14pt; font-weight: bold; color: #124874; text-align: center; text-transform: uppercase; background-color: #FAF7F2; }
          .section-title { font-size: 11pt; font-weight: bold; color: #124874; background-color: #FAF7F2; border-bottom: 2px solid #124874; }
          .th-cerulean { background-color: #124874; color: #ffffff; font-weight: bold; text-align: center; font-size: 10pt; border: 1px solid #0D3656; }
          .td-cell { font-size: 10pt; border: 1px solid #D8D1C5; }
          .td-num { font-size: 10pt; border: 1px solid #D8D1C5; text-align: right; font-family: 'Courier New', monospace; }
          .td-bold-red { font-size: 10pt; border: 1px solid #D8D1C5; text-align: right; color: #CF373D; font-weight: bold; font-family: 'Courier New', monospace; }
          .td-center { font-size: 10pt; border: 1px solid #D8D1C5; text-align: center; }
          .kpi-title { font-size: 9pt; font-weight: bold; color: #6E675F; background-color: #FAF7F2; border: 1px solid #124874; }
          .kpi-val { font-size: 13pt; font-weight: bold; color: #124874; border: 1px solid #124874; text-align: center; }
          .kpi-val-red { font-size: 13pt; font-weight: bold; color: #CF373D; border: 1px solid #124874; text-align: center; }
          .sign-box { font-size: 10pt; text-align: center; }
        </style>
      </head>
      <body>
        <table border="0" cellpadding="4" cellspacing="0" width="100%">
          <!-- Brand Masthead Header -->
          <tr>
            <td colspan="7" class="masthead">BLEND COFFEE &amp; TEA CHRONICLE &bull; SAIGON ROASTERY PRESS</td>
          </tr>
          <tr>
            <td colspan="7" class="sub-masthead">Số 88 Đồng Khởi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh &bull; Hotline: (028) 3822 8899 &bull; www.blend-roastery.vn</td>
          </tr>
          <tr><td colspan="7">&nbsp;</td></tr>

          <!-- Report Document Title -->
          <tr>
            <td colspan="7" class="title">BẢN KÊ DOANH THU &amp; ĐỐI SOÁT SỔ CÁI TÀI CHÍNH 2026</td>
          </tr>
          <tr>
            <td colspan="7" align="center" style="font-size: 9pt; color: #6E675F; font-style: italic;">
              Mã Sổ Cái: #BL-FIN-${date.replace(/-/g, '')} &bull; Ngày Kết Xuất: ${todayStr} lúc ${timeStr} &bull; Lưu trữ kế toán
            </td>
          </tr>
          <tr><td colspan="7">&nbsp;</td></tr>

          <!-- KPI Summary Strip -->
          <tr>
            <td colspan="2" class="kpi-title" align="center">TỔNG THU KỲ QUYẾT TOÁN</td>
            <td colspan="2" class="kpi-title" align="center">TỔNG SỐ ĐƠN HOÀN TẤT</td>
            <td colspan="2" class="kpi-title" align="center">GIÁ TRỊ ĐƠN BÌNH QUÂN</td>
            <td class="kpi-title" align="center">TÌNH TRẠNG KHO</td>
          </tr>
          <tr>
            <td colspan="2" class="kpi-val">${totalRevenueNum.toLocaleString('vi-VN')} VNĐ</td>
            <td colspan="2" class="kpi-val">${totalOrdersCount} Đơn</td>
            <td colspan="2" class="kpi-val-red">${avgOrderNum.toLocaleString('vi-VN')} VNĐ</td>
            <td class="kpi-val" style="color: #124874; font-size: 10pt;">ĐẦY ĐỦ AN TOÀN</td>
          </tr>
          <tr><td colspan="7">&nbsp;</td></tr>

          <!-- Section 1: Orders / Sales Ledger -->
          ${(type === 'full' || type === 'orders') ? `
            <tr>
              <td colspan="7" class="section-title">I. BẢNG KÊ CHI TIẾT ĐƠN HÀNG &amp; DOANH SỐ (SALES LEDGER)</td>
            </tr>
            <tr>
              <th class="th-cerulean" width="80">MÃ ĐƠN</th>
              <th class="th-cerulean" width="180">THỰC KHÁCH</th>
              <th class="th-cerulean" width="130">TỔNG TIỀN</th>
              <th class="th-cerulean" width="100">THỜI GIAN</th>
              <th class="th-cerulean" width="120">PHƯƠNG THỨC</th>
              <th class="th-cerulean" width="130">TRẠNG THÁI</th>
              <th class="th-cerulean" width="200">GHI CHÚ</th>
            </tr>
            ${orders.map(o => `
              <tr>
                <td class="td-center">#${o.id}</td>
                <td class="td-cell"><b>${o.customer}</b></td>
                <td class="td-bold-red">${o.total}</td>
                <td class="td-center">${o.time}</td>
                <td class="td-center">${o.payment}</td>
                <td class="td-center" style="${o.status === 'Đã hoàn thành' ? 'color: #124874; font-weight: bold;' : 'color: #CF373D;'}">${o.status}</td>
                <td class="td-cell">${o.notes || ''}</td>
              </tr>
            `).join('')}
            <tr><td colspan="7">&nbsp;</td></tr>
          ` : ''}

          <!-- Section 2: Inventory Ledger -->
          ${(type === 'full' || type === 'inventory') ? `
            <tr>
              <td colspan="7" class="section-title">II. BẢNG ĐỐI SOÁT TỒN KHO &amp; ĐỊNH MỨC NGUYÊN LIỆU (INVENTORY LEDGER)</td>
            </tr>
            <tr>
              <th class="th-cerulean" width="80">MÃ NVL</th>
              <th class="th-cerulean" colspan="2" width="250">TÊN NGUYÊN VẬT LIỆU</th>
              <th class="th-cerulean" width="100">ĐƠN VỊ</th>
              <th class="th-cerulean" width="120">TỒN THỰC TẾ</th>
              <th class="th-cerulean" width="120">ĐỊNH MỨC TỐI THIỂU</th>
              <th class="th-cerulean" width="140">TÌNH TRẠNG</th>
            </tr>
            ${inventory.map(i => `
              <tr>
                <td class="td-center">#${i.id}</td>
                <td class="td-cell" colspan="2"><b>${i.name}</b></td>
                <td class="td-center">${i.unit}</td>
                <td class="td-num">${i.qty}</td>
                <td class="td-num">${i.min}</td>
                <td class="td-center" style="${i.status === 'warning' ? 'color: #CF373D; font-weight: bold;' : 'color: #124874;'}">
                  ${i.status === 'warning' ? 'CẦN NHẬP THÊM' : 'ĐỦ ĐỊNH MỨC'}
                </td>
              </tr>
            `).join('')}
            <tr><td colspan="7">&nbsp;</td></tr>
          ` : ''}

          <!-- Section 3: Reservations Docket -->
          ${(type === 'full' || type === 'reservations') ? `
            <tr>
              <td colspan="7" class="section-title">III. SỔ GHI DANH ĐẶT CHỖ THƯỞNG THỨC &amp; VIP SALON (RESERVATIONS)</td>
            </tr>
            <tr>
              <th class="th-cerulean" width="80">MÃ ĐẶT</th>
              <th class="th-cerulean" width="180">HỌ TÊN KHÁCH</th>
              <th class="th-cerulean" width="120">SỐ ĐIỆN THOẠI</th>
              <th class="th-cerulean" width="80">SỐ KHÁCH</th>
              <th class="th-cerulean" width="120">LỊCH HẸN</th>
              <th class="th-cerulean" width="180">KHU VỰC BÀN</th>
              <th class="th-cerulean" width="120">TRẠNG THÁI</th>
            </tr>
            ${reservations.map(r => `
              <tr>
                <td class="td-center">#RES-${String(r.id).padStart(4, '0')}</td>
                <td class="td-cell"><b>${r.name}</b></td>
                <td class="td-center">${r.phone}</td>
                <td class="td-center">${r.guests} Khách</td>
                <td class="td-center">${r.date} ${r.time}</td>
                <td class="td-cell">${r.area}</td>
                <td class="td-center" style="${r.status === 'Đã xác nhận' ? 'color: #124874; font-weight: bold;' : r.status === 'Chờ xác nhận' ? 'color: #CF373D; font-weight: bold;' : ''}">${r.status}</td>
              </tr>
            `).join('')}
            <tr><td colspan="7">&nbsp;</td></tr>
          ` : ''}

          <!-- Section 4: Patrons / Customers -->
          ${(type === 'full' || type === 'customers') ? `
            <tr>
              <td colspan="7" class="section-title">IV. DANH BỘ HỘI VIÊN &amp; KHÁCH QUÝ THÂN THIẾT (PATRONS LEDGER)</td>
            </tr>
            <tr>
              <th class="th-cerulean" width="80">MÃ THẺ</th>
              <th class="th-cerulean" colspan="2" width="220">HỌ TÊN THÀNH VIÊN</th>
              <th class="th-cerulean" width="130">SỐ ĐIỆN THOẠI</th>
              <th class="th-cerulean" width="180">EMAIL LIÊN LẠC</th>
              <th class="th-cerulean" width="110">HẠNG THẺ</th>
              <th class="th-cerulean" width="130">TỔNG CHI TIÊU</th>
            </tr>
            ${customers.map(c => `
              <tr>
                <td class="td-center">#VIP-${c.id}</td>
                <td class="td-cell" colspan="2"><b>${c.name}</b></td>
                <td class="td-center">${c.phone}</td>
                <td class="td-cell">${c.email || ''}</td>
                <td class="td-center" style="font-weight: bold; color: #124874;">${c.tier}</td>
                <td class="td-bold-red">${c.spent}</td>
              </tr>
            `).join('')}
            <tr><td colspan="7">&nbsp;</td></tr>
          ` : ''}

          <!-- Official Signatures Section -->
          <tr><td colspan="7">&nbsp;</td></tr>
          <tr>
            <td colspan="2" class="sign-box"><b>NGƯỜI LẬP BIỂU</b><br><span style="font-size: 8pt; color: #6E675F;">(Ký và ghi rõ họ tên)</span><br><br><br><br><b>Nguyễn Hoàng Phúc</b></td>
            <td colspan="3" class="sign-box"><b>THỦ KHO &amp; ĐỐI SOÁT</b><br><span style="font-size: 8pt; color: #6E675F;">(Kiểm kê và xác nhận)</span><br><br><br><br><b>Bảo Trưởng Ca</b></td>
            <td colspan="2" class="sign-box" style="color: #CF373D;"><b>GIÁM ĐỐC / CHỦ BIÊN</b><br><span style="font-size: 8pt; color: #6E675F;">(Ký duyệt &amp; Đóng dấu niêm phong)</span><br><br><br><br><b>[ ĐÃ PHÊ DUYỆT 2026 ]</b></td>
          </tr>
          <tr><td colspan="7">&nbsp;</td></tr>
          <tr>
            <td colspan="7" align="center" style="font-size: 8pt; color: #888888; border-top: 1px dashed #D8D1C5;">
              Tài liệu kế toán trích xuất chính thức từ Hệ Thống Quản Trị Báo In Blend Roastery &bull; Bản quyền 2026
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const fileName = `blend-so-cai-tai-chinh-${type}-${date}.xls`;
    res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send('\uFEFF' + excelHTML);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportCSV = (req, res) => {
  try {
    const { type } = req.query; // 'orders', 'inventory', 'customers'

    if (type === 'inventory') {
      const items = db.prepare('SELECT id, name, unit, qty, min, status FROM inventory').all();
      let csv = 'Mã NVL,Tên Nguyên Liệu,Đơn Vị,Tồn Kho,Định Mức Tối Thiểu,Trạng Thái\n';
      items.forEach(i => {
        csv += `"${i.id}","${i.name}","${i.unit}",${i.qty},${i.min},"${i.status === 'warning' ? 'Cần nhập thêm' : 'Đủ dùng'}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="blend-inventory-report.csv"');
      return res.send('\uFEFF' + csv);
    }

    if (type === 'customers') {
      const customers = db.prepare('SELECT name, phone, email, tier, spent FROM customers').all();
      let csv = 'Tên Khách Hàng,Số Điện Thoại,Email,Hạng Thành Viên,Tổng Chi Tiêu\n';
      customers.forEach(c => {
        csv += `"${c.name}","${c.phone}","${c.email || ''}","${c.tier}","${c.spent}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="blend-customers-report.csv"');
      return res.send('\uFEFF' + csv);
    }

    // Default: Orders export
    const orders = db.prepare('SELECT id, customer, total, time, payment, status, notes, created_at FROM orders').all();
    let csv = 'Mã Đơn Hàng,Khách Hàng,Tổng Tiền,Thời Gian,Phương Thức TT,Trạng Thái,Ghi Chú,Ngày Tạo\n';
    orders.forEach(o => {
      csv += `"${o.id}","${o.customer}","${o.total}","${o.time}","${o.payment}","${o.status}","${o.notes || ''}","${o.created_at}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="blend-orders-report.csv"');
    res.send('\uFEFF' + csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
