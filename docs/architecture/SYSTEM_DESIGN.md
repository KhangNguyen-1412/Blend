# ☕ Hồ Sơ Thiết Kế Hệ Thống Chuẩn Doanh Nghiệp (Enterprise System Architecture)
## Dự án: Blend Roastery & F&B Management System

---

## Mục Lục (Table of Contents)
1. [Tổng Quan & Cam Kết NFRs (Executive Summary & SLAs)](#1-tổng-quan--cam-kết-nfrs)
2. [Mô Hình Kiến Trúc C4 (C4 Architecture Model)](#2-mô-hình-kiến-trúc-c4)
   - [2.1 C4 Level 1: Ngữ Cảnh Hệ Thống (System Context)](#21-c4-level-1-ngữ-cảnh-hệ-thống-system-context)
   - [2.2 C4 Level 2: Vùng Chứa Hệ Thống (Container Diagram)](#22-c4-level-2-vùng-chứa-hệ-thống-container-diagram)
   - [2.3 C4 Level 3: Thành Phần Backend (Component Diagram)](#23-c4-level-3-thành-phần-backend-component-diagram)
   - [2.4 C4 Level 4: Trình Tự Nghiệp Vụ Giao Dịch (Sequence Diagram)](#24-c4-level-4-trình-tự-nghiệp-vụ-giao-dịch-sequence-diagram)
3. [Kiến Trúc Dữ Liệu & Lộ Trình Mở Rộng Quy Mô (Data Architecture)](#3-kiến-trúc-dữ-liệu--lộ-trình-mở-rộng-quy-mô)
   - [3.1 SQLite WAL Hiện Tại vs Lộ Trình PostgreSQL Aurora](#31-sqlite-wal-hiện-tại-vs-lộ-trình-postgresql-aurora)
   - [3.2 Sơ Đồ Thực Thể Liên Kết (Entity-Relationship Diagram)](#32-sơ-đồ-thực-thể-liên-kết-entity-relationship-diagram)
   - [3.3 Chiến Lược Phân Vùng (Partitioning) & Lưu Trữ Lịch Sử](#33-chiến-lược-phân-vùng-partitioning--lưu-trữ-lịch-sử)
4. [Kiến Trúc Bảo Mật & Phòng Ngừa Rủi Ro (Security & STRIDE)](#4-kiến-trúc-bảo-mật--phòng-ngừa-rủi-ro)
   - [4.1 Ma Trận Phân Quyền Vai Trò (RBAC Matrix)](#41-ma-trận-phân-quyền-vai-trò-rbac-matrix)
   - [4.2 Cơ Chế Giảm Thiểu OWASP Top 10](#42-cơ-chế-giảm-thiểu-owasp-top-10)
5. [SRE, Khả Năng Quan Sát & Ứng Phó Sự Cố (SRE & BCP)](#5-sre-khả-năng-quan-sát--ứng-phó-sự-cố)
   - [5.1 Golden Signals & Chỉ Số SLI/SLO](#51-golden-signals--chỉ-số-slislo)
   - [5.2 Phân Cấp Sự Cố & Kế Hoạch Ứng Trực (On-call Runbook)](#52-phân-cấp-sự-cố--kế-hoạch-ứng-trực-on-call-runbook)
6. [Chiến Lược DevSecOps & Release Engineering](#6-chiến-lược-devsecops--release-engineering)

---

## 1. Tổng Quan & Cam Kết NFRs

**Blend Roastery & F&B Management System** là nền tảng quản trị chuỗi F&B cao cấp kết hợp văn hóa báo chí cổ điển (Editorial Gazette). Hệ thống số hóa toàn diện từ quy trình bán hàng tại quầy (POS), định lượng trừ kho tự động, quản lý khách hàng thân thiết (CRM), kế hoạch đặt bàn VIP Salon cho đến báo cáo tài chính doanh thu.

### 🎯 Các Chỉ Số NFRs Cam Kết (Enterprise Service Level Objectives)

| Hạng Mục | Tiêu Chuẩn Cam Kết | Cơ Chế Đảm Bảo |
| :--- | :--- | :--- |
| **Tính Sẵn Sàng (Availability)** | **99.95% Uptime** (Thời gian gián đoạn < 4.38 giờ/năm) | Multi-AZ deployment, Container health probes, Zero-downtime rolling update |
| **Độ Trễ Phản Hồi (Latency)** | **P95 < 200ms**, **P99 < 500ms** | SQLite WAL mode, Prepared statements, Edge CDN Caching |
| **Bảo Đảm Khôi Phục (RPO / RTO)**| **RPO < 15 phút**, **RTO < 1 giờ** | Continuous WAL archiving, Automated Point-in-time recovery |
| **Tải Giao Dịch Đỉnh (Peak RPS)** | **1,200 RPS** tại quầy POS & Web Orders | Non-blocking Event-Loop Node.js, Dumb-init process management |
| **Tính Toàn Vẹn (Data Integrity)** | **100% ACID Compliant** | Foreign keys constraint, SQLite transactions, DB rollback |

---

## 2. Mô Hình Kiến Trúc C4

### 2.1 C4 Level 1: Ngữ Cảnh Hệ Thống (System Context)

Sơ đồ mô tả ranh giới hệ thống Blend và tương tác giữa các tác nhân người dùng với các dịch vụ bên ngoài.

```mermaid
graph TD
    subgraph Users ["Người Dùng & Tác Nhân"]
        Guest["Khách Hàng Trải Nghiệm<br/>(Duyệt thực đơn, đọc báo in, đặt bàn)"]
        Member["Hội Viên Thân Thiết<br/>(Tích điểm, sử dụng voucher)"]
        Barista["Pha Chế & Thu Ngân<br/>(POS gọi món, cập nhật trạng thái đơn)"]
        Manager["Quản Lý Chi Nhánh<br/>(Quản lý kho, nhân sự, báo cáo ca)"]
        Admin["Ban Quản Trị Trung Tâm<br/>(Cấu hình hệ thống, kiểm toán doanh thu)"]
    end

    subgraph BlendSystem ["Hệ Thống Blend Management (Enterprise Boundary)"]
        CorePlatform["Nền Tảng Quản Trị Toàn Diện Blend<br/>(React 18 SPA + Node.js Express API + SQLite)"]
    end

    subgraph ExternalServices ["Hạ Tầng Tích Hợp Bên Ngoài"]
        PaymentGateway["Cổng Thanh Toán VietQR / MoMo<br/>(Xác nhận giao dịch tức thời)"]
        WeatherAPI["Dịch Vụ Thời Tiết Live Weather<br/>(Hiển thị điều kiện khí hậu quán)"]
        ObjectCDN["Mạng Phân Phối Tĩnh CDN<br/>(Lưu trữ hình ảnh báo chí, menu đồ uống)"]
        AlertSystem["Hệ Thống Cảnh Báo SRE / Slack Webhook<br/>(Thông báo sự cố P1/P2)"]
    end

    Guest -->|Xem menu, đăng ký đặt bàn| CorePlatform
    Member -->|Tra cứu tích lũy, voucher| CorePlatform
    Barista -->|Tạo đơn POS, nhận chế biến| CorePlatform
    Manager -->|Nhập xuất kho, kiểm ca| CorePlatform
    Admin -->|Phân quyền, kiểm toán tài chính| CorePlatform

    CorePlatform -->|Khởi tạo & đối soát mã QR| PaymentGateway
    CorePlatform -->|Cập nhật nhiệt độ Sài Gòn theo ca| WeatherAPI
    CorePlatform -->|Truy xuất ảnh báo chí tối ưu WebP| ObjectCDN
    CorePlatform -->|Phát tín hiệu cảnh báo tồn kho thấp & lỗi 5xx| AlertSystem
```

---

### 2.2 C4 Level 2: Vùng Chứa Hệ Thống (Container Diagram)

Kiến trúc phân tách rõ ràng giữa lớp phân phối tĩnh (Edge CDN), lớp giao diện người dùng (SPA Client), lớp cổng kết nối API (Node.js Container) và lớp lưu trữ bền vững (Data Storage Tier).

```mermaid
graph TB
    subgraph ClientTier ["Lớp Client & Ứng Dụng Đầu Cuối"]
        Browser["Trình Duyệt Máy Tính & Tablet Quầy POS<br/>(Chrome, Safari, Edge)"]
        MobilePWA["Thiết Bị Cầm Tay Nhân Viên<br/>(Responsive PWA)"]
    end

    subgraph EdgeTier ["Lớp Biên & Cân Bằng Tải (Edge & Reverse Proxy)"]
        CloudflareCDN["Cloudflare Edge Network / Reverse Proxy<br/>(SSL/TLS 1.3 Termination, WAF, DDoS Mitigation, Gzip/Brotli)"]
    end

    subgraph ApplicationTier ["Lớp Ứng Dụng (Application Containers)"]
        ViteSPA["Frontend Container / Static Assets<br/>(React 18 + Vite + Tailwind CSS)<br/>Giao diện phong cách báo chí cổ điển"]
        ExpressAPI["Backend API Container<br/>(Node.js 22 LTS + Express.js)<br/>RESTful Endpoints, Auth Guard, Order Engine"]
    end

    subgraph DataTier ["Lớp Dữ Liệu Bền Vững (Persistence Layer)"]
        SQLiteDB["Cơ Sở Dữ Liệu SQLite (Primary DB)<br/>(WAL Mode - Write-Ahead Logging)<br/>blend.db (ACID Transactions)"]
        BackupStorage["Lưu Trữ Bản Sao Lưu (Off-site Archival)<br/>(Snapshot sao lưu định kỳ hàng giờ)"]
    end

    Browser -->|HTTPS 443| CloudflareCDN
    MobilePWA -->|HTTPS 443| CloudflareCDN
    CloudflareCDN -->|Phân phối file tĩnh HTML/JS/CSS| ViteSPA
    CloudflareCDN -->|Chuyển tiếp API calls /api/*| ExpressAPI

    ExpressAPI -->|Giao dịch đọc/ghi siêu tốc qua node:sqlite| SQLiteDB
    SQLiteDB -.->|WAL Checkpoint & Backup tự động| BackupStorage
```

---

### 2.3 C4 Level 3: Thành Phần Backend (Component Diagram)

Cấu trúc module hóa bên trong Backend Express API, tuân thủ nguyên lý Single Responsibility (SRP) và Layered Architecture.

```mermaid
graph TB
    subgraph RoutingTier ["Tầng Định Tuyến & Middleware"]
        RootRouter["Express Root Router (/api)"]
        AuthMiddleware["Auth & RBAC Guard Middleware"]
        LoggingMiddleware["Morgan & Audit Log Interceptor"]
        RateLimiter["Rate Limiting & Anti-Abuse Guard"]
    end

    subgraph ControllerTier ["Tầng Điều Phối Nghiệp Vụ (Controllers)"]
        AuthController["authController<br/>(Xác thực & cấp token phiên)"]
        OrderController["orderController<br/>(Quản lý vòng đời đơn POS)"]
        ProductController["productController<br/>(Danh mục & định giá món)"]
        InventoryController["inventoryController<br/>(Quản lý kho & cảnh báo định mức)"]
        CustomerController["customerController<br/>(Hội viên & phân hạng chi tiêu)"]
        ReportController["reportController<br/>(Thống kê doanh thu & xuất CSV)"]
        ArticleController["articleController<br/>(Xuất bản bài báo di sản & ký sự)"]
    end

    subgraph EngineTier ["Tầng Động Cơ Cốt Lõi (Core Engines)"]
        OrderStateMachine["Động cơ chuyển đổi trạng thái đơn<br/>(Chờ xác nhận -> Đang pha -> Hoàn thành)"]
        InventoryLedger["Động cơ trừ kho thời gian thực<br/>(Kiểm tra tồn -> Khóa hàng -> Trừ định mức)"]
        DiscountEngine["Động cơ tính toán khuyến mãi<br/>(Chiết khấu voucher & ưu đãi hội viên)"]
    end

    subgraph StorageEngine ["Tầng Truy Cập Dữ Liệu"]
        DatabaseDriver["node:sqlite (DatabaseSync)<br/>Prepared Statements & Parameter Binding"]
    end

    RootRouter --> LoggingMiddleware
    LoggingMiddleware --> RateLimiter
    RateLimiter --> AuthMiddleware

    AuthMiddleware --> AuthController
    AuthMiddleware --> OrderController
    AuthMiddleware --> ProductController
    AuthMiddleware --> InventoryController
    AuthMiddleware --> CustomerController
    AuthMiddleware --> ReportController
    AuthMiddleware --> ArticleController

    OrderController --> OrderStateMachine
    OrderController --> InventoryLedger
    OrderController --> DiscountEngine

    AuthController --> DatabaseDriver
    OrderStateMachine --> DatabaseDriver
    InventoryLedger --> DatabaseDriver
    DiscountEngine --> DatabaseDriver
    ProductController --> DatabaseDriver
    CustomerController --> DatabaseDriver
    ReportController --> DatabaseDriver
    ArticleController --> DatabaseDriver
```

---

### 2.4 C4 Level 4: Trình Tự Nghiệp Vụ Giao Dịch (Sequence Diagram)

Quy trình giao dịch tạo đơn hàng tại quầy POS, kiểm tra tồn kho, áp dụng chiết khấu và hoàn tất thanh toán với tính toàn vẹn dữ liệu nghiêm ngặt.

```mermaid
sequenceDiagram
    autonumber
    actor Barista as Thu Ngân / Pha Chế
    participant POS as Frontend POS (React)
    participant API as Backend (orderController)
    participant Stock as inventoryController
    participant DB as SQLite DB (WAL Mode)
    actor Customer as Khách Hàng

    Customer->>Barista: Yêu cầu đặt món (Vd: Cà Phê Muối Di Sản + Cold Brew)
    Barista->>POS: Chọn món trên màn hình POS & nhập mã giảm giá
    POS->>API: POST /api/orders { customer, items, total, payment: "VietQR" }
    
    activate API
    API->>DB: Bắt đầu giao dịch (BEGIN IMMEDIATE TRANSACTION)
    
    API->>Stock: Kiểm tra định mức nguyên liệu tồn kho cho từng món
    activate Stock
    Stock->>DB: SELECT qty, min FROM inventory WHERE id IN (...)
    DB-->>Stock: Trả về số lượng nguyên liệu khả dụng
    deactivate Stock

    alt Nguyên liệu khả dụng đủ đáp ứng
        API->>DB: INSERT INTO orders (id, customer, total, items, status, payment) VALUES (...)
        API->>DB: UPDATE inventory SET qty = qty - required_qty WHERE id = ...
        API->>DB: Ghi nhận giao dịch hoàn tất (COMMIT TRANSACTION)
        API-->>POS: HTTP 201 Created { success: true, orderId: "ORD-921" }
        POS->>Customer: Hiển thị mã VietQR động theo đơn hàng
        Customer->>POS: Chuyển khoản thành công
        POS->>API: PATCH /api/orders/ORD-921/status { status: "Đang pha chế" }
        API->>DB: UPDATE orders SET status = 'Đang pha chế' WHERE id = 'ORD-921'
        API-->>POS: HTTP 200 OK (Đã điều phối xuống quầy Bar)
    else Nguyên liệu trong kho bị thiếu hụt
        API->>DB: Khôi phục trạng thái (ROLLBACK TRANSACTION)
        API-->>POS: HTTP 400 Bad Request { success: false, message: "Hạt rang mộc Cầu Đất không đủ định mức" }
        POS-->>Barista: Báo động đỏ trên giao diện POS, yêu cầu nhập kho bổ sung
    end
    deactivate API
```

---

## 3. Kiến Trúc Dữ Liệu & Lộ Trình Mở Rộng Quy Mô

### 3.1 SQLite WAL Hiện Tại vs Lộ Trình PostgreSQL Aurora

Hệ thống Blend hiện sử dụng **SQLite 3 với WAL Mode (Write-Ahead Logging)** thông qua module chuẩn `node:sqlite` của Node.js 22+.

#### Ưu thế của SQLite WAL hiện tại:
1. **Zero-Latency Network Overhead**: Truy vấn đọc trực tiếp trong bộ nhớ/tệp tin cục bộ, độ trễ sub-millisecond (< 0.5ms).
2. **Concurrency Tối Ưu**: Độc lập giữa người đọc (Readers) và người ghi (Writers) — thao tác ghi không chặn các thao tác đọc và ngược lại.
3. **Tiết kiệm tài nguyên**: Không yêu cầu cụm máy chủ DB độc lập trong giai đoạn 1 cửa hàng.

#### Kế hoạch Di chuyển Lên Cụm PostgreSQL Doanh Nghiệp (Khi mở rộng > 5 chi nhánh):

```mermaid
graph LR
    subgraph Phase1 ["Giai Đoạn 1: Hiện Tại"]
        P1App["Node.js Backend"] -->|Embedded Direct I/O| P1DB["SQLite WAL Mode<br/>blend.db"]
    end

    subgraph Phase2 ["Giai Đoạn 2: Doanh Nghiệp Multi-Branch"]
        P2App1["Branch 1 Node Instance"] --> PgBouncer
        P2App2["Branch 2 Node Instance"] --> PgBouncer
        P2App3["E-commerce Web Cluster"] --> PgBouncer
        PgBouncer["PgBouncer Connection Pooler<br/>(Transaction Pooling Mode)"]
        PgBouncer --> AuroraWriter["PostgreSQL Aurora Primary<br/>(Write Transactions)"]
        PgBouncer --> AuroraReplica1["Aurora Read Replica 1<br/>(Reporting & Analytics)"]
        PgBouncer --> AuroraReplica2["Aurora Read Replica 2<br/>(POS Read Operations)"]
    end

    Phase1 -.->|Zero-Downtime Data Migration via pgloader| Phase2
```

---

### 3.2 Sơ Đồ Thực Thể Liên Kết (Entity-Relationship Diagram)

```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : contains
    STAFF ||--o{ ORDERS : manages
    CUSTOMERS ||--o{ ORDERS : places
    SUPPLIERS ||--o{ INVENTORY_DOCKETS : provides
    INVENTORY ||--o{ INVENTORY_DOCKETS : tracks
    PROMOTIONS ||--o{ ORDERS : applies

    CATEGORIES {
        int id PK
        string name UK
        string icon
        string description
        datetime created_at
    }

    PRODUCTS {
        string id PK
        string name
        string category FK
        string price
        int price_num
        string variants
        string status
        string image
        datetime created_at
    }

    ORDERS {
        string id PK
        string customer
        string total
        int total_num
        string time
        string status
        string payment
        string notes
        string items
        datetime created_at
    }

    INVENTORY {
        string id PK
        string name
        string unit
        int qty
        int min
        string status
        datetime created_at
    }

    INVENTORY_DOCKETS {
        string id PK
        string type
        string item_name
        string qty
        string source
        string date
        string clerk
        datetime created_at
    }

    CUSTOMERS {
        int id PK
        string name
        string phone
        string email
        string tier
        string spent
        int spent_num
        datetime created_at
    }

    PROMOTIONS {
        int id PK
        string code UK
        string discount
        string condition
        string expiry
        string status
        datetime created_at
    }

    STAFF {
        int id PK
        string name
        string username UK
        string password
        string role
        string status
        datetime created_at
    }

    RESERVATIONS {
        int id PK
        string name
        string phone
        string email
        int guests
        string date
        string time
        string area
        string table_number
        string status
        datetime created_at
    }

    ARTICLES {
        int id PK
        string title
        string slug UK
        string publisher
        string category
        string author
        string summary
        text content
        int views
        string status
        datetime created_at
    }
```

---

### 3.3 Chiến Lược Phân Vùng (Partitioning) & Lưu Trữ Lịch Sử

1. **Bảng Đơn Hàng (`orders`)**:
   - Dữ liệu đơn hàng trong vòng 90 ngày được giữ trong bảng hoạt động chính (`orders_active`) phục vụ tra cứu tức thời tại quầy POS.
   - Các đơn hàng > 90 ngày được tự động luân chuyển sang bảng lưu trữ (`orders_archive`) với chỉ mục nén theo quý (`created_at_idx`), đảm bảo hiệu năng bảng chính luôn đạt mức tối ưu.
2. **Sổ Kho & Phiếu Nhập Xuất (`inventory_dockets`)**:
   - Lưu trữ lịch sử toàn diện không bao giờ xóa (Append-Only Audit Trail) phục vụ công tác kiểm toán nội bộ và truy vết thất thoát hàng hóa.

---

## 4. Kiến Trúc Bảo Mật & Phòng Ngừa Rủi Ro

### 4.1 Ma Trận Phân Quyền Vai Trò (RBAC Matrix)

Hệ thống thiết lập 5 cấp độ vai trò nghiệp vụ với nguyên tắc phân quyền tối thiểu (Principle of Least Privilege):

| Quyền Hạn Nghiệp Vụ | Super Admin (Chủ Biên) | Store Manager (Quản Lý Chi Nhánh) | Cashier (Thu Ngân) | Barista (Pha Chế) | Inventory Clerk (Thủ Kho) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Quản lý tài khoản & Phân quyền | ✅ Toàn quyền | ❌ | ❌ | ❌ | ❌ |
| Xem báo cáo doanh thu chi tiết & Xuất CSV | ✅ Toàn quyền | ✅ Ca trực của mình | ❌ | ❌ | ❌ |
| Tạo đơn, sửa đơn & hủy đơn POS | ✅ Toàn quyền | ✅ Duyệt hủy đơn | ✅ Tạo & Thanh toán | ❌ | ❌ |
| Cập nhật tiến độ pha chế món | ✅ Toàn quyền | ✅ Toàn quyền | ✅ Xem | ✅ Cập nhật trạng thái | ❌ |
| Điều chỉnh tồn kho & Tạo phiếu nhập xuất | ✅ Toàn quyền | ✅ Duyệt phiếu | ❌ | ❌ | ✅ Toàn quyền |
| Quản lý danh mục món & giá bán | ✅ Toàn quyền | ✅ Cập nhật trạng thái hết hàng | ❌ | ❌ | ❌ |
| Quản lý bài báo chí & Ký sự truyền thông | ✅ Toàn quyền | ❌ | ❌ | ❌ | ❌ |

---

### 4.2 Cơ Chế Giảm Thiểu OWASP Top 10

```mermaid
graph TD
    subgraph OWASP_Defenses ["Phòng Tuyến Bảo Mật Toàn Diện"]
        SQLi["1. SQL Injection Defense<br/>- 100% Prepared Statements (db.prepare)<br/>- Tham số hóa dữ liệu đầu vào (?, @param)"]
        XSS["2. Cross-Site Scripting (XSS)<br/>- React Virtual DOM tự động escape ký tự<br/>- Content Security Policy (CSP) chặt chẽ"]
        BrokenAuth["3. Broken Authentication<br/>- Khóa tài khoản sau 5 lần thử sai<br/>- Kiểm tra trạng thái tài khoản 'Nghỉ việc'"]
        IDOR["4. Insecure Direct Object (IDOR)<br/>- Kiểm tra quyền sở hữu bản ghi theo chi nhánh/vai trò"]
        SecurityHeaders["5. Security Headers<br/>- Strict-Transport-Security (HSTS)<br/>- X-Content-Type-Options: nosniff<br/>- X-Frame-Options: DENY"]
    end
```

---

## 5. SRE, Khả Năng Quan Sát & Ứng Phó Sự Cố

### 5.1 Golden Signals & Chỉ Số SLI/SLO

Hệ thống giám sát liên tục 4 tín hiệu vàng (Golden Signals của Google SRE):

1. **Latency (Độ trễ)**: Thời gian xử lý yêu cầu tại endpoint `/api/orders` (SLO: 95% requests hoàn tất dưới 200ms).
2. **Traffic (Lưu lượng)**: Số lượng request/giây đo lường tại HTTP server.
3. **Errors (Tỷ lệ lỗi)**: Tỷ lệ mã phản hồi HTTP 5xx so với tổng số request (SLO: Lỗi 5xx < 0.05%).
4. **Saturation (Độ bão hòa)**: Dung lượng bộ nhớ RAM Node.js và tỷ lệ kích thước tệp WAL SQLite so với ngưỡng cảnh báo 1GB.

---

### 5.2 Phân Cấp Sự Cố & Kế Hoạch Ứng Trực (On-call Runbook)

| Cấp Độ | Định Nghĩa Sự Cố | Thời Gian Phản Hồi (SLA) | Quy Trình Xử Lý |
| :--- | :--- | :---: | :--- |
| **P1 - Blocker** | Toàn bộ quầy POS không thể tạo đơn hoặc Database bị khóa hoàn toàn. | **< 15 phút** | 1. Kích hoạt chế độ phục vụ Offline.<br/>2. Chuyển sang bản sao lưu DB gần nhất.<br/>3. Thông báo Ban Giám Đốc và kênh SRE khẩn cấp. |
| **P2 - Critical** | Tính năng thanh toán VietQR bị gián đoạn, kho không cập nhật. | **< 30 phút** | 1. Chuyển sang thanh toán tiền mặt/chuyển khoản thủ công.<br/>2. Khởi động lại dịch vụ background container. |
| **P3 - Major** | Lỗi hiển thị báo cáo doanh thu ca, lỗi bộ lọc danh mục. | **< 2 giờ** | 1. Ghi nhận issue ưu tiên cao trên GitHub.<br/>2. Triển khai bản vá hotfix qua CI/CD pipeline. |
| **P4 - Minor** | Lỗi chính tả bài báo, sai lệch icon thời tiết. | **< 24 giờ** | Xử lý trong chu kỳ phát hành định kỳ (Next Sprint Release). |

---

## 6. Chiến Lược DevSecOps & Release Engineering

### 6.1 Mô Hình Phân Nhánh & Quality Gates

```mermaid
gitGraph
    commit id: "Init"
    branch develop
    checkout develop
    commit id: "feat: POS Engine"
    branch feature/order-voucher
    checkout feature/order-voucher
    commit id: "feat: apply voucher logic"
    commit id: "test: add discount unit tests"
    checkout develop
    merge feature/order-voucher tag: "PR Merged (All Quality Gates Passed)"
    checkout main
    merge develop tag: "v1.1.0 (Production Release)"
```

### 6.2 Cổng Kiểm Soát Chất Lượng Bắt Buộc Trước Khi Merge:
1. **Gate 1 - Security Audit**: `npm audit` 0 lỗ hổng nghiêm trọng (high/critical).
2. **Gate 2 - Automated Tests**: 100% test suites vượt qua trên cả Backend Express và Frontend React (`npm test`).
3. **Gate 3 - SAST Scan**: CodeQL quét sạch các cảnh báo CWE bảo mật.
4. **Gate 4 - Secret Scan**: TruffleHog xác nhận không rò rỉ bất kỳ API key hoặc secret token nào.
5. **Gate 5 - Production Build**: Vite build hoàn tất không sinh lỗi phân tích tĩnh.
