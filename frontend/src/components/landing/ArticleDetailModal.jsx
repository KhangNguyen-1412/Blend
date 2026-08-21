import React from 'react';
import { useToast } from '../../context/ToastContext';

export const ArticleDetailModal = ({ article, onClose, onBookingNavigate }) => {
  const { addToast } = useToast();

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Đã sao chép liên kết bài báo vào bộ nhớ tạm!', 'success');
    } else {
      addToast('Chia sẻ bài báo thành công!', 'info');
    }
  };

  const paragraphs = article.content ? article.content.split('\n\n') : [];
  const firstChar = paragraphs[0] ? paragraphs[0].charAt(0) : '';
  const firstParagraphRemaining = paragraphs[0] ? paragraphs[0].slice(1) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161413]/75 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="bg-[#FCFAF6] border-4 border-[#124874] w-full max-w-3xl shadow-[10px_10px_0px_rgba(18,72,116,0.95)] my-8 relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Newspaper Masthead Top Bar */}
        <div 
          style={{ backgroundColor: '#124874', color: '#ffffff' }}
          className="p-3 sm:px-6 flex items-center justify-between border-b-2 border-[#0D3656] select-none"
        >
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-xs uppercase tracking-[0.25em] font-bold text-[#C59B27]">
              &mdash; TRÍCH DẪN ẤN PHẨM BÁO CHÍ &mdash;
            </span>
            <span className="ink-stamp stamp-jasper text-[8px] font-bold py-0.5">
              OFFICIAL PRESS
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-[#CF373D] text-white transition-colors cursor-pointer text-sm"
            title="Đóng ấn bản"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 font-body text-[#161413]">
          
          {/* Article Header & Publisher Identity */}
          <div className="border-b-2 border-[#124874] pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-sm font-black text-[#124874] tracking-wider uppercase">
                  {article.publisher}
                </span>
                <span className="text-gray-400 font-serif">•</span>
                <span className="font-serif italic text-xs text-[#6E675F]">
                  Chuyên mục: <strong className="text-[#124874]">{article.category}</strong>
                </span>
              </div>

              {article.badge && (
                <span className="ink-stamp stamp-jasper text-[9px] font-bold">
                  {article.badge}
                </span>
              )}
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#124874] leading-[1.2] tracking-tight">
              "{article.title}"
            </h1>

            {/* Author Byline & Date */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#6E675F] pt-1">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-pen-nib text-[#CF373D]"></i>
                <span className="font-serif italic text-sm text-gray-800">
                  {article.author || article.publisher}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span>
                  <i className="fa-regular fa-calendar mr-1.5 text-[#124874]"></i>
                  {article.published_date}
                </span>
                <span>
                  <i className="fa-regular fa-eye mr-1.5 text-[#124874]"></i>
                  {article.views ? article.views.toLocaleString('vi-VN') : '1.420'} lượt đọc
                </span>
              </div>
            </div>
          </div>

          {/* Lead Quote Paragraph Box */}
          <div className="bg-[#FAF7F2] p-5 border-l-4 border-[#CF373D] border-y border-r border-[#D8D1C5] shadow-xs">
            <span className="font-cinzel text-[10px] text-[#CF373D] font-bold uppercase tracking-wider block mb-1">
              &mdash; TRÍCH DẪN TỰA ĐỀ NỔI BẬT:
            </span>
            <p className="font-serif italic text-base sm:text-lg text-gray-800 leading-relaxed font-medium">
              "{article.summary}"
            </p>
          </div>

          {/* Full Article Content with Drop Cap */}
          <div className="space-y-4 font-serif text-sm sm:text-base text-gray-800 leading-relaxed text-justify">
            {paragraphs.length > 0 && (
              <p>
                <span 
                  style={{ color: '#124874', borderColor: '#124874' }}
                  className="float-left text-4xl sm:text-5xl font-display font-black pr-2 pt-1 pb-0 leading-none mr-2 font-bold"
                >
                  {firstChar}
                </span>
                {firstParagraphRemaining}
              </p>
            )}

            {paragraphs.slice(1).map((para, idx) => (
              <p key={idx} className="indent-6">
                {para}
              </p>
            ))}
          </div>

          {/* Editorial Stamp of Authentication */}
          <div className="border-t-2 border-dashed border-[#D8D1C5] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#FAF7F2] p-4 border">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-cinzel text-[10px] uppercase font-bold text-[#124874] tracking-widest block">
                BLEND SAIGON ROASTERY &bull; ARCHIVE BUREAU
              </span>
              <p className="font-serif italic text-xs text-gray-600">
                Bản lưu trữ báo chí chính thức được số hóa phục vụ độc giả và quý khách yêu cà phê.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="press-btn px-3.5 py-1.5 bg-white border border-[#124874] text-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-solid fa-share-nodes text-xs"></i> CHIA SẺ
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#FAF7F2] p-4 sm:px-8 border-t-2 border-[#124874] flex flex-wrap justify-between items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="press-btn px-5 py-2 bg-white border border-[#D8D1C5] text-gray-700 font-cinzel text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left mr-1.5"></i> QUAY LẠI MỤC BÁO GIỚI
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onBookingNavigate) onBookingNavigate();
            }}
            style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
            className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <i className="fa-solid fa-calendar-check"></i> ĐẶT BÀN TRẢI NGHIỆM NGAY
          </button>
        </div>

      </div>
    </div>
  );
};

export default ArticleDetailModal;
