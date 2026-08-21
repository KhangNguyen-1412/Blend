const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'blend.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for better concurrency and foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize database schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      icon TEXT DEFAULT 'fa-mug-hot',
      description TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price TEXT NOT NULL,
      price_num INTEGER DEFAULT 0,
      variants TEXT,
      status TEXT DEFAULT 'Còn hàng',
      image TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer TEXT NOT NULL,
      total TEXT NOT NULL,
      total_num INTEGER DEFAULT 0,
      time TEXT NOT NULL,
      status TEXT DEFAULT 'Chờ xác nhận',
      payment TEXT DEFAULT 'Tiền mặt',
      notes TEXT DEFAULT '',
      items TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      qty INTEGER NOT NULL DEFAULT 0,
      min INTEGER NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'ok',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      tier TEXT DEFAULT 'Đồng',
      spent TEXT DEFAULT '0đ',
      spent_num INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      discount TEXT NOT NULL,
      condition TEXT,
      expiry TEXT,
      status TEXT DEFAULT 'Đang chạy',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT DEFAULT '123456',
      role TEXT NOT NULL,
      status TEXT DEFAULT 'Hoạt động',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS top_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sold INTEGER NOT NULL DEFAULT 0,
      type TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weekly_revenue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_label TEXT NOT NULL,
      revenue INTEGER NOT NULL,
      day_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      guests INTEGER DEFAULT 2,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      area TEXT DEFAULT 'Khu vực đọc báo in cổ điển',
      note TEXT,
      status TEXT DEFAULT 'Chờ xác nhận',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inventory_dockets (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      item_name TEXT NOT NULL,
      qty TEXT NOT NULL,
      source TEXT NOT NULL,
      date TEXT NOT NULL,
      clerk TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT NOT NULL,
      email TEXT,
      address TEXT,
      category TEXT NOT NULL,
      status TEXT DEFAULT 'Đang hợp tác',
      debt TEXT DEFAULT '0đ',
      debt_num REAL DEFAULT 0,
      rating REAL DEFAULT 5.0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE,
      publisher TEXT NOT NULL,
      badge TEXT DEFAULT '5.0 ★ EXCELLENT',
      category TEXT NOT NULL,
      author TEXT,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      views INTEGER DEFAULT 1420,
      status TEXT DEFAULT 'Đã xuất bản',
      published_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe migration for products image column
  try {
    db.exec('ALTER TABLE products ADD COLUMN image TEXT DEFAULT "";');
  } catch (e) {
    // Column already exists
  }

  // Safe migration for staff password column
  try {
    db.exec('ALTER TABLE staff ADD COLUMN password TEXT DEFAULT "123456";');
  } catch (e) {
    // Column already exists
  }

  // Safe migration for orders items column
  try {
    db.exec('ALTER TABLE orders ADD COLUMN items TEXT DEFAULT "";');
  } catch (e) {
    // Column already exists
  }

  // Seed default media press articles if table is empty
  const articleCount = db.prepare('SELECT count(*) as count FROM articles').get().count;
  if (articleCount === 0) {
    const insertArticle = db.prepare(`
      INSERT INTO articles (title, slug, publisher, badge, category, author, summary, content, published_date, views, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertArticle.run(
      'Khi Cà Phê Muối Trở Thành Một Biểu Tượng Văn Hóa Mới Giữa Sài Gòn',
      'khi-ca-phe-muoi-tro-thanh-bieu-tuong-van-hoa',
      'THE SAIGON TIMES',
      '5.0 ★ EXCELLENT',
      'Ẩm Thực & Di Sản',
      'Chuyên mục Ẩm Thực & Di Sản',
      'Blend đã định nghĩa lại khái niệm thưởng thức cà phê muối. Không chỉ đơn thuần là đồ uống, đó là sự hòa quyện tinh tế giữa ký ức Sài Gòn xưa và kỹ nghệ pha chế hiện đại.',
      `Giữa trung tâm Sài Gòn phồn hoa và chuyển động không ngừng, việc tìm kiếm một không gian vừa tĩnh lặng, vừa lưu giữ trọn vẹn hồn cốt của những mẻ rang thủ công tưởng chừng như là điều xa xỉ. Thế nhưng, tại số 88 Đồng Khởi, Blend Roastery đã chứng minh điều ngược lại.\n\nĐiểm nhấn đầu tiên khi đặt chân đến đây chính là ly Cà Phê Muối Di Sản. Không sử dụng kem muối công nghiệp bán sẵn, đội ngũ barista tại Blend tự tay đánh bông lớp kem béo mặn từ muối hồng Himalaya và bơ tươi thượng hạng mỗi buổi sớm. Khi hòa quyện cùng cốt cà phê Robusta rang mộc đậm đà từ vùng đất Gia Lai, từng giọt cà phê mang đến hậu vị ngọt đằm sâu lắng, xóa tan hoàn toàn cảm giác gắt chát thường thấy.\n\n"Chúng tôi không muốn tạo ra một thức uống chạy theo trào lưu ngắn hạn. Cà phê muối tại Blend là bản giao hưởng giữa truyền thống thưởng thức của người Việt và kỹ nghệ chiết xuất chuẩn quốc tế," anh Nguyễn Hoàng Khang - Quản lý Trưởng kiêm Roaster tại Blend chia sẻ.\n\nBên cạnh hương vị đỉnh cao, điều níu chân giới mộ điệu chính là không gian đọc báo in đậm chất văn hóa. Từng tờ báo sáng được là phẳng phiu, thơm mùi mực mới đặt trang trọng trên những chiếc bàn gỗ sồi cổ điển, tạo nên một nghi thức khởi đầu ngày mới đầy thanh lịch cho người dân đô thị.`,
      'Tháng 06/2025',
      2450,
      'Đã xuất bản'
    );

    insertArticle.run(
      'Sự Chuẩn Xác Tuyệt Đối Trong Từng Mẻ Rang Mộc Cầu Đất',
      'su-chuan-xac-tuyet-doi-tung-me-rang-moc-cau-dat',
      'COFFEE ENTHUSIAST VIETNAM',
      'GOLD STANDARD',
      'Nghệ Thuật Rang',
      'Nhà Phê Bình Nguyễn Quang Huy • Tạp Chí Barista',
      'Rất hiếm nơi nào kiểm soát độ ẩm và quá trình degas hạt cà phê nghiêm ngặt như Blend. Mỗi shot Espresso đều giữ trọn vẹn tầng hương hoa cỏ tự nhiên.',
      `Trong thế giới cà phê đặc sản (Specialty Coffee), việc làm chủ được dải nhiệt độ trong lồng rang và kiểm soát quá trình giải phóng khí CO2 (degas) là thước đo chuẩn xác nhất cho trình độ của một Roastery. Blend Roastery đã thiết lập một tiêu chuẩn vàng thực sự cho phân khúc này tại Việt Nam.\n\nSử dụng 100% hạt Arabica Typica và Bourbon hái chín mọng từ các nông trại trứ danh Cầu Đất (Đà Lạt) ở độ cao 1.650m, Blend áp dụng biểu đồ rang sáng mộc (Light-Medium Roast) độc quyền. Thay vì lạm dụng bơ hay phụ gia tạo mùi như cách làm cà phê truyền thống cũ, từng mẻ hạt tại Blend được thăng hoa hương vị tự nhiên: nốt hương hoa nhài thoang thoảng, vị chua thanh thoát của quả lý chua đỏ và hậu vị ngọt lịm như mật ong rừng.\n\n"Khi thưởng thức một tách Espresso tại đây, bạn không chỉ uống cà phê, bạn đang nếm trọn thổ nhưỡng và sương sớm của vùng cao nguyên đại ngàn Cầu Đất," chuyên gia Nguyễn Quang Huy khẳng định trong bài thẩm định xếp hạng Gold Standard năm 2025.`,
      'Tháng 07/2025',
      1890,
      'Đã xuất bản'
    );

    insertArticle.run(
      'Không Gian Đọc Báo In Và Thưởng Trà Độc Nhất Vô Nhị',
      'khong-gian-doc-bao-in-va-thuong-tra-doc-nhat',
      'GASTRONOMY GAZETTE',
      'MUST-VISIT',
      'Văn Hóa Sài Gòn',
      'BTV Trần Mai Lan • Ấn Phẩm Sống Đẹp',
      'Bước vào Blend như bước vào một tòa soạn báo in của thập niên trước. Mùi thơm của giấy báo hòa cùng mùi trà Oolong kem phô mai tạo nên một chốn an yên tuyệt đối.',
      `Trong kỷ nguyên của những màn hình smartphone và tin tức tức thời trên mạng xã hội, Blend Roastery lựa chọn một lối đi ngược dòng đầy dũng cảm: phục hưng văn hóa đọc báo in kết hợp cùng nghệ thuật thưởng trà và cà phê thượng hạng.\n\nKiến trúc của quán được bài trí tựa như một tòa soạn báo chí cổ điển châu Âu đầu thế kỷ 20, với những bức tường màu giấy ngà, phông chữ serif đúc khuôn kim loại và tiếng gõ lách cách của chiếc máy đánh chữ Remington cổ đặt nơi sảnh đón. Khách ghé thăm có thể tự do lấy những bản nhật trình tin tức buổi sớm vừa mới in còn vương mùi mực ấm, chọn một góc bàn bên khung cửa kính nhìn ra hàng cây cổ thụ Đồng Khởi.\n\nMón Trà Oolong Kem Phô Mai Lá Dứa tại đây là một sự hòa quyện hoàn hảo: cốt trà ô long hảo hạng ủ lạnh 12 tiếng giữ trọn hương thơm thanh mát, phủ bên trên là lớp kem phô mai sánh mịn béo ngậy được chế biến thủ công mỗi ngày. Đây xứng đáng là điểm đến không thể bỏ qua (Must-Visit) của bất kỳ ai đang tìm kiếm một khoảng lặng văn hóa tinh tế giữa lòng thành phố.`,
      'Tháng 08/2025',
      3120,
      'Đã xuất bản'
    );

    insertArticle.run(
      'Top 10 Quán Cà Phê Độc Bản Đáng Trải Nghiệm Nhất Đông Nam Á',
      'top-10-quan-ca-phe-doc-ban-dong-nam-a',
      'ASIA F&B AWARDS',
      'NOMINEE 2026',
      'Vinh Danh & Giải Thưởng',
      'Hội Đồng Giám Khảo Asia Culinary Committee',
      'Được vinh danh nhờ sự kết hợp đột phá giữa di sản nông sản bản địa Việt Nam và hệ thống quản trị công nghệ vận hành chuẩn mực.',
      `Hội đồng thẩm định ẩm thực và phong cách sống Châu Á (Asia F&B Committee) đã chính thức công bố danh sách đề cử Top 10 Quán Cà Phê Độc Bản Đáng Trải Nghiệm Nhất Đông Nam Á cho niên khóa 2026. Đại diện duy nhất đến từ Việt Nam trong danh mục này chính là Blend Roastery Saigon.\n\nTiêu chí đánh giá của giải thưởng không chỉ gói gọn ở chất lượng đồ uống vượt bậc, mà còn xem xét tính bền vững trong chuỗi cung ứng nông sản, sự nhất quán trong vận hành và giá trị văn hóa độc đáo mà thương hiệu mang lại cho cộng đồng.\n\nBlend đã chinh phục hội đồng chuyên môn quốc tế nhờ mô hình "From Farm To Paper & Cup" - thu mua trực tiếp hạt cà phê từ nông dân với giá bảo trợ cao, lưu trữ và bảo quản tiêu chuẩn phòng lab, đồng thời số hóa toàn diện quy trình kiểm soát chất lượng từ khâu nhập kho đến khi phục vụ tận tay khách quý. Một mô hình chuẩn mực kết hợp giữa nghệ thuật thủ công và công nghệ quản trị F&B tân tiến.`,
      'Tháng 08/2026',
      4560,
      'Đã xuất bản'
    );
  }

  // Migrations for existing databases
  try {
    db.prepare("ALTER TABLE reservations ADD COLUMN table_number TEXT DEFAULT ''").run();
  } catch (e) {}

  try {
    db.prepare("ALTER TABLE products ADD COLUMN image TEXT DEFAULT ''").run();
  } catch (e) {}

  try {
    db.prepare("ALTER TABLE staff ADD COLUMN password TEXT DEFAULT '123456'").run();
  } catch (e) {}

  try {
    db.prepare("ALTER TABLE orders ADD COLUMN items TEXT DEFAULT ''").run();
  } catch (e) {}
}

initSchema();

module.exports = db;

