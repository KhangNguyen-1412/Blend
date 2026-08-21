import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { articlesApi } from '../services/api';
import ArticleModal from '../components/articles/ArticleModal';
import ArticleDetailModal from '../components/landing/ArticleDetailModal';
import Pagination from '../components/common/Pagination';

export const ArticlesView = () => {
  const { addToast } = useToast();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [previewArticle, setPreviewArticle] = useState(null);

  const CATEGORIES = [
    'Tất cả',
    'Ẩm Thực & Di Sản',
    'Nghệ Thuật Rang',
    'Văn Hóa Sài Gòn',
    'Vinh Danh & Giải Thưởng',
    'Tin Tức Sự Kiện'
  ];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await articlesApi.getAll();
      if (res.success && res.data) {
        setArticles(res.data);
      }
    } catch (err) {
      addToast('Không thể tải danh sách bài báo truyền thông', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingArticle) {
        const res = await articlesApi.update(editingArticle.id, formData);
        if (res.success) {
          addToast('Đã cập nhật bài báo truyền thông thành công!', 'success');
          setIsModalOpen(false);
          setEditingArticle(null);
          fetchArticles();
        }
      } else {
        const res = await articlesApi.create(formData);
        if (res.success) {
          addToast('Đã xuất bản bài báo mới thành công!', 'success');
          setIsModalOpen(false);
          fetchArticles();
        }
      }
    } catch (err) {
      addToast(err.message || 'Lỗi khi lưu bài báo', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài báo "${title}" khỏi hệ thống?`)) {
      return;
    }
    try {
      const res = await articlesApi.delete(id);
      if (res.success) {
        addToast('Đã xóa bài báo thành công!', 'info');
        fetchArticles();
      }
    } catch (err) {
      addToast('Lỗi khi xóa bài báo', 'error');
    }
  };

  // Filtered list
  const filteredArticles = articles.filter(art => {
    const matchesCategory = selectedCategory === 'Tất cả' || art.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      (art.title && art.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.publisher && art.publisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.author && art.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate Statistics
  const totalArticles = articles.length;
  const publishedCount = articles.filter(a => a.status === 'Đã xuất bản').length;
  const publishersCount = new Set(articles.map(a => a.publisher)).size;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 font-body text-[#161413]">
      
      {/* Header Broadside Section */}
      <div className="bg-[#FCFAF6] border-2 border-[#124874] p-6 shadow-[4px_4px_0px_rgba(18,72,116,0.9)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-[10px] uppercase tracking-widest text-[#6E675F] font-bold">
              MỤC VI &bull; TRUYỀN THÔNG &amp; QUAN HỆ BÁO CHÍ
            </span>
            <span className="ink-stamp stamp-cerulean text-[8px] font-bold">
              MEDIA PRESS DESK
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#124874] tracking-tight mt-1">
            Quản Lý Bài Báo &amp; Đánh Giá Báo Giới
          </h1>
          <p className="font-serif italic text-xs text-gray-600 mt-1">
            Biên tập, lưu trữ các bài bình luận ẩm thực, phóng sự báo chí và vinh danh thương hiệu Blend Roastery.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingArticle(null);
            setIsModalOpen(true);
          }}
          style={{ backgroundColor: '#124874', color: '#ffffff' }}
          className="press-btn px-5 py-2.5 font-cinzel text-xs font-bold hover:bg-[#CF373D] transition-colors shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <i className="fa-solid fa-pen-nib"></i>
          <span>+ SOẠN BÀI BÁO MỚI</span>
        </button>
      </div>

      {/* Statistics Stat Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F2] p-4 border border-[#124874] shadow-xs">
          <span className="font-cinzel text-[10px] uppercase text-[#6E675F] font-bold block">TỔNG BÀI BÁO ĐÃ LƯU</span>
          <span className="font-mono text-2xl font-bold text-[#124874] mt-1 block">{totalArticles}</span>
        </div>
        <div className="bg-[#FAF7F2] p-4 border border-[#124874] shadow-xs">
          <span className="font-cinzel text-[10px] uppercase text-[#6E675F] font-bold block">ĐANG XUẤT BẢN CÔNG KHAI</span>
          <span className="font-mono text-2xl font-bold text-emerald-800 mt-1 block">{publishedCount}</span>
        </div>
        <div className="bg-[#FAF7F2] p-4 border border-[#124874] shadow-xs">
          <span className="font-cinzel text-[10px] uppercase text-[#6E675F] font-bold block">TÒA SOẠN &amp; ẤN PHẨM</span>
          <span className="font-mono text-2xl font-bold text-[#CF373D] mt-1 block">{publishersCount}</span>
        </div>
        <div className="bg-[#FAF7F2] p-4 border border-[#124874] shadow-xs">
          <span className="font-cinzel text-[10px] uppercase text-[#6E675F] font-bold block">TỔNG LƯỢT ĐỌC GHI NHẬN</span>
          <span className="font-mono text-2xl font-bold text-amber-900 mt-1 block">{totalViews.toLocaleString('vi-VN')}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#D8D1C5] p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xs">
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 font-cinzel text-xs font-bold transition-colors cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#124874] text-white border-[#124874]'
                  : 'bg-[#FAF7F2] text-gray-700 border-[#D8D1C5] hover:border-[#124874]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tòa soạn, tác giả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FCFAF6] border border-[#124874] pl-9 pr-4 py-1.5 font-serif text-xs focus:outline-none focus:ring-2 focus:ring-[#CF373D]"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-2 text-[#124874] text-xs"></i>
        </div>

      </div>

      {/* Articles Editorial Table List */}
      <div className="bg-white border-2 border-[#124874] shadow-[4px_4px_0px_rgba(18,72,116,0.9)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-serif italic">
            <i className="fa-solid fa-spinner fa-spin mr-2 text-[#124874]"></i>
            Đang tải dữ liệu hồ sơ bài báo truyền thông...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-serif italic">
            Không tìm thấy bài báo nào phù hợp với bộ lọc tìm kiếm.
          </div>
        ) : (
          <div>
            <div className="editorial-table-scroll">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr 
                    style={{ backgroundColor: '#124874', color: '#ffffff' }}
                    className="font-cinzel text-[11px] uppercase tracking-wider border-b border-[#0D3656]"
                  >
                    <th className="py-3 px-4">TÒA SOẠN &amp; HUY HIỆU</th>
                    <th className="py-3 px-4">TIÊU ĐỀ BÀI VIẾT</th>
                    <th className="py-3 px-4">CHUYÊN MỤC</th>
                    <th className="py-3 px-4">NGÀY ĐĂNG &bull; LƯỢT ĐỌC</th>
                    <th className="py-3 px-4">TRẠNG THÁI</th>
                    <th className="py-3 px-4 text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D1C5]">
                  {filteredArticles
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((art) => (
                    <tr 
                      key={art.id}
                      className="hover:bg-[#FAF7F2] transition-colors font-body"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-cinzel font-bold text-[#124874] tracking-wide">
                          {art.publisher}
                        </div>
                        {art.badge && (
                          <span className="ink-stamp stamp-jasper text-[8px] font-bold mt-1 inline-block">
                            {art.badge}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-display text-sm font-bold text-gray-900 leading-snug">
                          "{art.title}"
                        </div>
                        <p className="font-serif italic text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                          {art.summary}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 font-serif text-gray-700">
                        {art.category}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-gray-600">
                        <div>{art.published_date}</div>
                        <span className="text-[10px] text-gray-400">
                          {art.views ? art.views.toLocaleString('vi-VN') : '0'} lượt đọc
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold ${
                          art.status === 'Đã xuất bản' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {art.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setPreviewArticle(art)}
                          className="px-2.5 py-1 bg-white border border-[#124874] text-[#124874] font-cinzel text-[10px] font-bold hover:bg-[#124874] hover:text-white transition-colors cursor-pointer"
                          title="Xem trước bài báo như độc giả"
                        >
                          <i className="fa-solid fa-eye mr-1"></i> XEM
                        </button>

                        <button
                          onClick={() => {
                            setEditingArticle(art);
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-white border border-[#D8D1C5] text-gray-700 font-cinzel text-[10px] font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Chỉnh sửa bài báo"
                        >
                          <i className="fa-solid fa-pen-to-square mr-1 text-[#124874]"></i> SỬA
                        </button>

                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          className="px-2.5 py-1 bg-white border border-[#CF373D] text-[#CF373D] font-cinzel text-[10px] font-bold hover:bg-[#CF373D] hover:text-white transition-colors cursor-pointer"
                          title="Xóa bài báo"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredArticles.length / itemsPerPage) || 1}
              totalItems={filteredArticles.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemsPerPageOptions={[4, 8, 12, 20]}
            />
          </div>
        )}
      </div>

      {/* Editor Modal for Adding / Editing Articles */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingArticle(null);
        }}
        onSave={handleCreateOrUpdate}
        article={editingArticle}
      />

      {/* Reader Preview Modal */}
      <ArticleDetailModal
        article={previewArticle}
        onClose={() => setPreviewArticle(null)}
      />

    </div>
  );
};

export default ArticlesView;
