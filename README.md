# ☕ Blend Management System — Fullstack Web Application

Hệ thống quản trị chuyên biệt dành cho thương hiệu đồ uống & cà phê **Blend**, được thiết kế theo phong cách báo chí cổ điển (Editorial Design) độc đáo. Hệ thống được xây dựng hoàn chỉnh với mô hình **Fullstack tách biệt Frontend (FE) và Backend (BE)**, sử dụng cơ sở dữ liệu **SQLite thật** (Persistent Database), không sử dụng dữ liệu tĩnh (mockData).

---

## 📁 1. Cấu Trúc Thư Mục Dự Án (Folder Structure)

```text
Blend/
├── backend/                           # Máy chủ API Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js            # Khởi tạo SQLite DB (WAL Mode) & tạo các bảng
│   │   ├── controllers/               # Xử lý logic nghiệp vụ và truy vấn DB
│   │   │   ├── statsController.js     # API thống kê tổng quan & biểu đồ
│   │   │   ├── productController.js   # CRUD Sản phẩm & Danh mục
│   │   │   ├── orderController.js     # CRUD & Điều phối trạng thái đơn hàng
│   │   │   ├── inventoryController.js # CRUD Kho & cảnh báo tồn thấp
│   │   │   ├── customerController.js  # CRUD Khách hàng & xếp hạng thành viên
│   │   │   ├── promotionController.js # CRUD Khuyến mãi & voucher
│   │   │   ├── staffController.js     # CRUD Nhân viên & phân quyền RBAC
│   │   │   └── reportController.js    # Báo cáo doanh thu & xuất CSV thật
│   │   ├── routes/                    # Định tuyến API endpoints
│   │   │   ├── index.js               # Root Router gom tất cả modules
│   │   │   ├── statsRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   ├── promotionRoutes.js
│   │   │   ├── staffRoutes.js
│   │   │   └── reportRoutes.js
│   │   ├── utils/
│   │   │   └── seedData.js            # Nạp dữ liệu hạt giống ban đầu vào DB nếu trống
│   │   ├── server.js                  # Điểm khởi động Express server (Port 5000)
│   │   └── data/
│   │       └── blend.db               # Tệp cơ sở dữ liệu SQLite thật (Persistent)
│   ├── .env                           # Biến môi trường Backend
│   └── package.json
│
├── frontend/                          # Giao diện người dùng (React 18 + Vite)
│   ├── src/
│   │   ├── components/                # Các UI components tái sử dụng
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx         # Thanh điều hướng trên cùng & cảnh báo real-time
│   │   │   │   ├── Sidebar.jsx        # Menu điều hướng bên trái
│   │   │   │   ├── SectionHeader.jsx  # Header tiêu đề cho từng phân hệ
│   │   │   │   ├── StatusBadge.jsx    # Huy hiệu trạng thái tiêu chuẩn
│   │   │   │   ├── Modal.jsx          # Popup Modal động
│   │   │   │   └── Toast.jsx          # Hệ thống Toast thông báo kết quả
│   │   │   ├── products/
│   │   │   │   └── ProductModal.jsx   # Modal Thêm & Sửa món
│   │   │   ├── orders/
│   │   │   │   └── OrderModal.jsx     # Modal Tạo đơn hàng
│   │   │   ├── inventory/
│   │   │   │   └── InventoryModal.jsx # Modal Thêm & Điều chỉnh tồn kho
│   │   │   ├── customers/
│   │   │   │   └── CustomerModal.jsx  # Modal Thêm & Sửa thành viên
│   │   │   ├── promotions/
│   │   │   │   └── PromoModal.jsx     # Modal Tạo & Sửa voucher
│   │   │   └── staff/
│   │   │       └── StaffModal.jsx     # Modal Phân quyền & Nhân sự
│   │   ├── views/                     # Các trang màn hình chính
│   │   │   ├── DashboardView.jsx      # Bảng điều khiển, biểu đồ động & cảnh báo
│   │   │   ├── ProductsView.jsx       # Quản lý danh mục & menu sản phẩm
│   │   │   ├── OrdersView.jsx         # Quản lý & điều phối đơn hàng
│   │   │   ├── InventoryView.jsx      # Quản lý kho, nguyên liệu & recipe
│   │   │   ├── CustomersView.jsx      # Quản lý khách hàng thân thiết
│   │   │   ├── PromotionsView.jsx     # Quản lý voucher & chiến dịch ưu đãi
│   │   │   ├── StaffView.jsx          # Quản lý tài khoản & phân quyền
│   │   │   └── ReportsView.jsx        # Báo cáo & xuất file CSV dữ liệu thật
│   │   ├── services/
│   │   │   └── api.js                 # HTTP Client gọi trực tiếp RESTful API Backend
│   │   ├── context/
│   │   │   └── ToastContext.jsx       # Quản lý Toast Notification toàn cục
│   │   ├── App.jsx                    # Layout chính và bộ điều hướng
│   │   ├── main.jsx                   # Entry point của React
│   │   └── index.css                  # Toàn bộ design token, typography, borders
│   ├── index.html
│   ├── vite.config.js                 # Cấu hình Vite & Reverse Proxy sang Backend
│   ├── tailwind.config.js             # Cấu hình theme Tailwind chuẩn cho Blend
│   └── package.json
│
├── package.json                       # Script điều phối khởi chạy toàn bộ hệ thống
└── README.md                          # Tài liệu dự án
```

---

## 🚀 2. Hướng Dẫn Cài Đặt & Khởi Chạy

### Cách 1: Khởi chạy nhanh toàn bộ dự án với 1 câu lệnh (Khuyên Dùng)

1. Mở terminal tại thư mục gốc `Blend/`:
```bash
# Cài đặt tất cả dependencies cho root, backend và frontend
npm run install:all

# Khởi chạy đồng thời cả Backend (port 5000) và Frontend (port 5173)
npm run dev
```

Sau đó mở trình duyệt và truy cập: **`http://localhost:5173`**

---

### Cách 2: Khởi chạy độc lập từng phân hệ

#### 1. Khởi chạy Backend API
```bash
cd backend
npm install
npm run dev
```
*Backend sẽ chạy tại: `http://localhost:5000` (API endpoint: `http://localhost:5000/api`)*

#### 2. Khởi chạy Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend sẽ chạy tại: `http://localhost:5173`*

---

## 🔌 3. Danh Mục RESTful API Đầy Đủ

| Module | Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- | :--- |
| **Thống Kê** | `GET` | `/api/stats/overview` | Lấy doanh thu, số đơn, top món và cảnh báo |
| **Sản Phẩm** | `GET` | `/api/products` | Danh sách món (hỗ trợ lọc danh mục & tìm kiếm) |
| | `POST` | `/api/products` | Thêm món mới vào DB |
| | `PUT` | `/api/products/:id` | Cập nhật thông tin món |
| | `DELETE` | `/api/products/:id` | Xóa món khỏi DB |
| **Đơn Hàng** | `GET` | `/api/orders` | Danh sách đơn hàng (lọc theo trạng thái) |
| | `POST` | `/api/orders` | Tạo đơn hàng mới |
| | `PATCH` | `/api/orders/:id/advance` | Chuyển tiếp quy trình: Chờ -> Pha chế -> Giao -> Hoàn thành |
| | `PATCH` | `/api/orders/:id/refund` | Hoàn tiền đơn hàng (chuyển Đã hủy + ghi chú Refund) |
| | `DELETE` | `/api/orders/:id` | Xóa đơn hàng |
| **Kho** | `GET` | `/api/inventory` | Lấy danh sách tồn kho & tự động tính cảnh báo tồn thấp |
| | `POST` | `/api/inventory` | Thêm nguyên vật liệu mới |
| | `PUT` | `/api/inventory/:id` | Điều chỉnh số lượng và định mức tối thiểu |
| | `DELETE` | `/api/inventory/:id` | Xóa nguyên vật liệu |
| **Khách Hàng** | `GET` | `/api/customers` | Lấy danh sách khách hàng & hạng thành viên |
| | `POST` | `/api/customers` | Thêm khách hàng mới |
| | `PUT` | `/api/customers/:id` | Cập nhật thông tin / chi tiêu khách |
| | `DELETE` | `/api/customers/:id` | Xóa hồ sơ khách |
| **Khuyến Mãi** | `GET` | `/api/promotions` | Danh sách voucher |
| | `POST` | `/api/promotions` | Tạo voucher mới |
| | `PUT` | `/api/promotions/:id` | Sửa voucher |
| | `DELETE` | `/api/promotions/:id` | Xóa voucher |
| **Nhân Sự** | `GET` | `/api/staff` | Danh sách tài khoản nhân viên |
| | `POST` | `/api/staff` | Thêm tài khoản nhân sự |
| | `PUT` | `/api/staff/:id` | Sửa thông tin & phân quyền |
| | `DELETE` | `/api/staff/:id` | Xóa nhân sự |
| **Báo Cáo** | `GET` | `/api/reports/summary` | Tổng kết tài chính & tỷ trọng mặt hàng |
| | `GET` | `/api/reports/export?type=orders` | Xuất file CSV dữ liệu thật |

---

## 🎨 4. Điểm Nổi Bật Về Thiết Kế & Tính Năng

- **Thực tế 100%**: Mọi thao tác Thêm / Sửa / Xóa / Chuyển trạng thái / Hoàn tiền đều được lưu trực tiếp vào cơ sở dữ liệu SQLite `backend/src/data/blend.db`.
- **Phong Cách Thẩm Mỹ Báo Chí (Editorial Design)**:
  - Font chữ tiêu đề: **Playfair Display**
  - Font chữ nội dung: **Newsreader**
  - Bảng màu: `blend-blue (#124874)`, `blend-red (#CF373D)`, `blend-paper (#F9F8F6)`
  - Đường viền kiểu biên tập báo in (*Editorial Borders*).
- **Hệ thống cảnh báo thời gian thực**: Tự động phát hiện khi tồn kho nguyên liệu xuống thấp hơn định mức và hiển thị cảnh báo lên Header & Dashboard.
- **Xuất file CSV trực tiếp**: Nút "Xuất CSV Thật" tải về file `.csv` chứa số liệu thực tế được kết xuất từ database.
