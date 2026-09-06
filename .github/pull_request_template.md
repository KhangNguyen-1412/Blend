## 📋 Enterprise Pull Request Description

### 1. Phân loại Thay đổi (Type of Change)
- [ ] 🚀 **feat**: Tính năng mới hoặc cải tiến nghiệp vụ
- [ ] 🐛 **fix**: Sửa lỗi hệ thống
- [ ] 📚 **docs**: Cập nhật tài liệu kỹ thuật / kiến trúc
- [ ] 💅 **style**: Định dạng, chuẩn hóa mã nguồn
- [ ] ♻️ **refactor**: Tái cấu trúc mã không thay đổi hành vi
- [ ] ⚡ **perf**: Tối ưu hiệu năng / giảm latency
- [ ] 🧪 **test**: Thêm hoặc cập nhật bộ kiểm thử tự động
- [ ] 🤖 **ci**: Thay đổi cấu hình GitHub Actions / DevOps pipeline
- [ ] 📦 **chore**: Cập nhật dependencies / build tooling

---

### 2. Tóm tắt Nội dung (Summary & Context)
<!-- Mô tả ngắn gọn vấn đề cần giải quyết và giải pháp kỹ thuật đã triển khai -->
- **Mục tiêu**: 
- **Giải pháp**: 
- **Liên kết Issue**: Closes #

---

### 3. Phân hệ Bị Ảnh Hưởng (Impacted Modules)
- [ ] Backend Express API (`/backend`)
- [ ] SQLite Schema / Database Migration (`/backend/src/config/database.js`)
- [ ] Frontend React SPA (`/frontend`)
- [ ] Design System & Styling (`/frontend/src/index.css`, Tailwind)
- [ ] CI/CD Workflows & DevOps (`/.github`, `Dockerfile`)

---

### 4. Enterprise Quality & Security Checklist
- [ ] **Automated Tests**: Toàn bộ unit và integration tests đều vượt qua (`npm test`).
- [ ] **Test Coverage**: Tỷ lệ bao phủ kiểm thử đạt ngưỡng quy định, không suy giảm so với baseline.
- [ ] **Lint & Style**: Mã nguồn tuân thủ coding conventions, không có cảnh báo/lỗi ESLint (`npm run lint`).
- [ ] **Security Review**: Không hardcode API keys, mật khẩu, JWT secrets, hoặc thông tin nhạy cảm.
- [ ] **ACID & Concurrency**: Các thao tác cơ sở dữ liệu xử lý an toàn với WAL mode, tránh table locks.
- [ ] **Documentation**: Đã cập nhật `README.md` hoặc `docs/architecture/` nếu có thay đổi kiến trúc/API.
- [ ] **Backwards Compatibility**: Không gây breaking change cho các client/endpoint hiện hữu.
