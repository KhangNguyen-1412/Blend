import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import StatusBadge from '../components/common/StatusBadge';
import ProductModal from '../components/products/ProductModal';
import CategoryManagerModal from '../components/products/CategoryManagerModal';
import Pagination from '../components/common/Pagination';
import { productsApi, categoriesApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả danh mục');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { addToast } = useToast();

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      if (res.success) {
        setCategoriesList(res.data);
      }
    } catch (err) {
      console.error('Lỗi tải danh mục:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'Tất cả danh mục') params.category = selectedCategory;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await productsApi.getAll(params);
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi khi tải danh sách sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const handleSaveProduct = async (formData) => {
    try {
      if (editingProduct) {
        await productsApi.update(editingProduct.id, formData);
        addToast('Đã lưu chỉnh sửa sản phẩm vào thực đơn!', 'success');
      } else {
        await productsApi.create(formData);
        addToast('Đã thêm món mới vào thực đơn!', 'success');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
      fetchCategories();
    } catch (err) {
      addToast(err.message || 'Có lỗi xảy ra khi lưu sản phẩm', 'error');
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn gạch bỏ món "${name}" khỏi thực đơn?`)) return;
    try {
      await productsApi.delete(id);
      addToast(`Đã xóa món ${name}`, 'success');
      fetchProducts();
      fetchCategories();
    } catch (err) {
      addToast(err.message || 'Không thể xóa sản phẩm', 'error');
    }
  };

  return (
    <div className="font-body animate-editorial-in text-brand-dark space-y-6">
      <SectionHeader 
        sectionNo="MỤC II &bull; DANH MỤC THỰC ĐƠN & BẢNG GIÁ" 
        title="Thực Đơn Sản Phẩm & Biến Thể Pha Chế" 
        subtitle="Quản lý cấu hình công thức, phân loại đồ uống, bảng định giá và tình trạng phục vụ tại quầy." 
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="press-btn px-4 py-2.5 bg-white text-[#124874] border-2 border-[#124874] font-cinzel text-xs font-bold hover:bg-[#124874] hover:text-white transition-colors flex items-center gap-2 shadow-xs"
            >
              <i className="fa-solid fa-folder-tree text-[#CF373D]"></i> QUẢN LÝ DANH MỤC
            </button>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setIsModalOpen(true);
              }}
              style={{ backgroundColor: '#CF373D', color: '#ffffff' }}
              className="press-btn px-5 py-2.5 font-cinzel text-xs font-bold hover:bg-[#AB282D] transition-colors flex items-center gap-2 shadow-xs"
            >
              <i className="fa-solid fa-plus"></i> KHAI BÁO MÓN MỚI
            </button>
          </div>
        }
      />
      
      {/* Category Tabs & Search Bar */}
      <div className="editorial-paper p-4 bg-brand-paperLight flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Dynamic Category Tabs */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <button
            onClick={() => setSelectedCategory('Tất cả danh mục')}
            className={`px-3 py-1.5 font-cinzel text-xs font-bold border transition-all ${
              selectedCategory === 'Tất cả danh mục'
                ? 'bg-cerulean text-white border-cerulean-dark shadow-sm'
                : 'text-cerulean bg-white border-brand-borderLight hover:bg-brand-paperDark'
            }`}
          >
            Tất cả ({products.length})
          </button>

          {categoriesList.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 font-cinzel text-xs font-bold border transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-cerulean text-white border-cerulean-dark shadow-sm'
                  : 'text-cerulean bg-white border-brand-borderLight hover:bg-brand-paperDark'
              }`}
            >
              <span>{cat.name}</span>
              {cat.product_count !== undefined && (
                <span className="text-[10px] opacity-80">({cat.product_count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input 
            type="text" 
            placeholder="Tìm theo tên món hoặc mã..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-cerulean pl-8 pr-3 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-jasper"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-400 text-xs"></i>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12 bg-white editorial-paper">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-cerulean mb-2"></i>
          <p className="font-serif italic text-gray-600">Đang đồng bộ thực đơn từ sổ cái...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-12 bg-white editorial-paper">
          <i className="fa-regular fa-folder-open text-4xl text-gray-300 mb-3"></i>
          <p className="font-serif text-lg text-gray-600">Không tìm thấy món đồ uống nào trong phân loại này.</p>
          <button 
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="press-btn px-4 py-2 mt-4 bg-cerulean text-white font-cinzel text-xs font-bold hover:bg-cerulean-dark inline-block"
          >
            + KHAI BÁO MÓN ĐẦU TIÊN
          </button>
        </div>
      ) : (
        /* Products Table with Scrollbar and Pagination */
        <div className="editorial-paper overflow-hidden bg-white">
          <div className="editorial-table-scroll">
            <table className="w-full text-left border-collapse font-body">
              <thead className="sticky top-0 z-10">
                <tr className="bg-cerulean text-white font-cinzel text-xs uppercase tracking-wider">
                  <th className="p-3.5 border-r border-cerulean-dark w-20">MÃ MÓN</th>
                  <th className="p-3.5 border-r border-cerulean-dark">HÌNH ẢNH &amp; TÊN MÓN</th>
                  <th className="p-3.5 border-r border-cerulean-dark">PHÂN LOẠI</th>
                  <th className="p-3.5 border-r border-cerulean-dark">GIÁ NIÊM YẾT</th>
                  <th className="p-3.5 border-r border-cerulean-dark">BIẾN THỂ &amp; CÔNG THỨC</th>
                  <th className="p-3.5 border-r border-cerulean-dark text-center">TRẠNG THÁI</th>
                  <th className="p-3.5 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderLight">
                {products
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((product) => (
                  <tr key={product.id} className="hover:bg-brand-paper transition-colors group">
                    <td className="p-3.5 font-mono text-xs font-bold text-jasper whitespace-nowrap">
                      #{product.id}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border border-[#124874] bg-[#FAF7F2] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <i className="fa-solid fa-mug-hot text-[#124874]/50 text-sm"></i>
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-bold text-sm text-cerulean leading-tight">{product.name}</p>
                          <span className="font-mono text-[10px] text-[#6E675F] block mt-0.5">#{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-serif text-xs text-gray-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-brand-paperDark border border-brand-borderLight">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-sm text-cerulean whitespace-nowrap">
                      {product.price}
                    </td>
                    <td className="p-3.5 font-serif italic text-xs text-gray-600 max-w-xs truncate" title={product.variants}>
                      {product.variants || '—'}
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="p-3.5 text-center whitespace-nowrap space-x-2">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="press-btn px-2.5 py-1 bg-white text-cerulean hover:bg-cerulean hover:text-white transition-colors border border-brand-borderLight text-xs font-cinzel font-bold"
                        title="Chỉnh sửa công thức & giá"
                      >
                        SỬA
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="press-btn px-2.5 py-1 bg-white text-jasper hover:bg-jasper hover:text-white transition-colors border border-jasper text-xs font-cinzel font-bold"
                        title="Gạch bỏ khỏi thực đơn"
                      >
                        XÓA
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
            totalPages={Math.ceil(products.length / itemsPerPage) || 1}
            totalItems={products.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            itemsPerPageOptions={[5, 10, 15, 20, 50]}
          />
        </div>
      )}

      {/* Product Creation / Edit Modal */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }} 
        onSave={handleSaveProduct} 
        editingProduct={editingProduct}
        availableCategories={categoriesList}
      />

      {/* Category Manager (CRUD) Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoriesUpdated={() => {
          fetchCategories();
          fetchProducts();
        }}
      />
    </div>
  );
};

export default ProductsView;
