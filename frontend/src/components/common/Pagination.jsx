import React from 'react';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 15, 20, 50]
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate visible page numbers (max 5 page buttons)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-[#FAF7F2] px-4 py-3 border-t-2 border-[#124874] flex flex-col sm:flex-row justify-between items-center gap-3 font-body text-xs select-none">
      
      {/* Left: Range and Count info */}
      <div className="text-gray-700 font-serif italic flex items-center gap-1.5">
        <span>Hiển thị</span>
        <span className="font-mono font-bold text-[#124874] not-italic">{startItem} &mdash; {endItem}</span>
        <span>trong tổng số</span>
        <span className="font-mono font-bold text-[#CF373D] not-italic">{totalItems}</span>
        <span>mục</span>
      </div>

      {/* Center: Pagination Controls */}
      <div className="flex items-center gap-1">
        
        {/* First Page */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(1)}
          className={`px-2 py-1 border font-cinzel text-[11px] font-bold transition-colors cursor-pointer ${
            currentPage <= 1
              ? 'border-gray-300 text-gray-400 bg-white/50 cursor-not-allowed'
              : 'border-[#124874] text-[#124874] bg-white hover:bg-[#124874] hover:text-white'
          }`}
          title="Trang đầu tiên"
        >
          <i className="fa-solid fa-angles-left"></i>
        </button>

        {/* Previous Page */}
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          className={`px-2.5 py-1 border font-cinzel text-[11px] font-bold transition-colors cursor-pointer ${
            currentPage <= 1
              ? 'border-gray-300 text-gray-400 bg-white/50 cursor-not-allowed'
              : 'border-[#124874] text-[#124874] bg-white hover:bg-[#124874] hover:text-white'
          }`}
          title="Trang trước"
        >
          <i className="fa-solid fa-angle-left mr-1"></i> TRƯỚC
        </button>

        {/* Page Number Buttons */}
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange && onPageChange(pageNum)}
            className={`w-7 h-7 flex items-center justify-center border font-mono text-xs font-bold transition-colors cursor-pointer ${
              currentPage === pageNum
                ? 'bg-[#124874] text-white border-[#124874] shadow-xs'
                : 'bg-white text-gray-800 border-[#D8D1C5] hover:border-[#124874] hover:text-[#124874]'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* Next Page */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          className={`px-2.5 py-1 border font-cinzel text-[11px] font-bold transition-colors cursor-pointer ${
            currentPage >= totalPages
              ? 'border-gray-300 text-gray-400 bg-white/50 cursor-not-allowed'
              : 'border-[#124874] text-[#124874] bg-white hover:bg-[#124874] hover:text-white'
          }`}
          title="Trang tiếp theo"
        >
          SAU <i className="fa-solid fa-angle-right ml-1"></i>
        </button>

        {/* Last Page */}
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(totalPages)}
          className={`px-2 py-1 border font-cinzel text-[11px] font-bold transition-colors cursor-pointer ${
            currentPage >= totalPages
              ? 'border-gray-300 text-gray-400 bg-white/50 cursor-not-allowed'
              : 'border-[#124874] text-[#124874] bg-white hover:bg-[#124874] hover:text-white'
          }`}
          title="Trang cuối cùng"
        >
          <i className="fa-solid fa-angles-right"></i>
        </button>

      </div>

      {/* Right: Items Per Page Selector */}
      {onItemsPerPageChange && (
        <div className="flex items-center gap-2 font-serif text-xs">
          <span className="text-gray-600">Dòng/trang:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
              if (onPageChange) onPageChange(1);
            }}
            className="bg-white border border-[#124874] px-2 py-0.5 font-mono text-xs font-bold text-[#124874] focus:outline-none focus:ring-1 focus:ring-[#CF373D] cursor-pointer"
          >
            {itemsPerPageOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

    </div>
  );
};

export default Pagination;
