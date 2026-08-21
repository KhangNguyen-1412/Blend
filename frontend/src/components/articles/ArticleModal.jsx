import React, { useState, useEffect } from 'react';

export const ArticleModal = ({ isOpen, onClose, onSave, article }) => {
  const [formData, setFormData] = useState({
    title: '',
    publisher: '',
    badge: '5.0 ★ EXCELLENT',
    category: 'Ẩm Thực & Di Sản',
    author: '',
    published_date: '',
    status: 'Đã xuất bản',
    summary: '',
    content: ''
  });

  const CATEGORIES = [
    'Ẩm Thực & Di Sản',
    'Nghệ Thuật Rang',
    'Văn Hóa Sài Gòn',
    'Vinh Danh & Giải Thưởng',
    'Tin Tức Sự Kiện'
  ];

  const BADGES = [
    '5.0 ★ EXCELLENT',
    'GOLD STANDARD',
    'MUST-VISIT',
    'NOMINEE 2026',
    'EDITOR CHOICE',
    'BEST SPECIALTY'
  ];

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        publisher: article.publisher || '',
        badge: article.badge || '5.0 ★ EXCELLENT',
        category: article.category || 'Ẩm Thực & Di Sản',
        author: article.author || '',
        published_date: article.published_date || '',
        status: article.status || 'Đã xuất bản',
        summary: article.summary || '',
        content: article.content || ''
      });
    } else {
      setFormData({
        title: '',
        publisher: '',
        badge: '5.0 ★ EXCELLENT',
        category: 'Ẩm Thực & Di Sản',
        author: '',
        published_date: `Tháng ${new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}`,
        status: 'Đã xuất bản',
        summary: '',
        content: ''
      });
    }
  }, [article, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161413]/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="bg-[#FCFAF6] border-4 border-[#124874] w-full max-w-2xl shadow-[8px_8px_0px_rgba(18,72,116,0.95)] my-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          style={{ backgroundColor: '#124874', color: '#ffffff' }}
          className="p-4 px-6 flex items-center justify-between border-b-2 border-[#0D3656]"
        >
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-newspaper text-[#C59B27]"></i>
            <span className="font-cinzel text-sm font-bold uppercase tracking-wider">
              {article ? 'HIỆU CHỈNH BÀI BÁO TRUYỀN THÔNG' : 'SOẠN THẢO BÀI BÁO BÁO GIỚI MỚI'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-[#CF373D] text-white transition-colors cursor-pointer text-sm"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-body text-sm max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
              Tiêu Đề Bài Báo *
            </label>
            <input
              type="text"
              required
              placeholder="VD: Khi Cà Phê Muối Trở Thành Một Biểu Tượng Văn Hóa Mới..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white border border-[#124874] px-3.5 py-2 font-display text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Tòa Soạn / Đơn Vị Báo Chí *
              </label>
              <input
                type="text"
                required
                placeholder="VD: THE SAIGON TIMES, GASTRONOMY GAZETTE..."
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-cinzel text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Huy Hiệu / Con Dấu Đánh Giá
              </label>
              <select
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3.5 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              >
                {BADGES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Chuyên Mục
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Tác Giả / Phê Bình
              </label>
              <input
                type="text"
                placeholder="VD: BTV Trần Mai Lan..."
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>

            <div>
              <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
                Ngày / Số Báo
              </label>
              <input
                type="text"
                placeholder="VD: Tháng 08/2026"
                value={formData.published_date}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="w-full bg-white border border-[#124874] px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
              />
            </div>
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
              Đoạn Trích Tóm Tắt (Lead Summary) *
            </label>
            <textarea
              required
              rows="2"
              placeholder="Đoạn văn ngắn gọn trích dẫn đánh giá của bài báo xuất hiện ở trang bìa..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full bg-white border border-[#124874] p-3 font-serif italic text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            ></textarea>
          </div>

          <div>
            <label className="block font-cinzel text-xs font-bold text-[#124874] uppercase tracking-wider mb-1">
              Toàn Văn Bài Báo Chi Tiết *
            </label>
            <textarea
              required
              rows="7"
              placeholder="Nội dung đầy đủ của bài viết phê bình ẩm thực. Phân cách các đoạn văn bằng 2 lần bấm Enter (xuống dòng)..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-white border border-[#124874] p-3 font-serif text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
            ></textarea>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-serif">
              <input
                type="checkbox"
                checked={formData.status === 'Đã xuất bản'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Đã xuất bản' : 'Bản nháp' })}
                className="w-4 h-4 accent-[#124874]"
              />
              <span className="font-bold text-[#124874]">Xuất bản công khai lên trang Báo Giới</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#D8D1C5] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="press-btn px-4 py-2 bg-white border border-[#D8D1C5] text-gray-700 font-cinzel text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              style={{ backgroundColor: '#124874', color: '#ffffff' }}
              className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              {article ? 'CẬP NHẬT BÀI BÁO' : 'XUẤT BẢN BÀI BÁO'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ArticleModal;
