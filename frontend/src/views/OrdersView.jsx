import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/common/SectionHeader';
import StatusBadge from '../components/common/StatusBadge';
import CustomDatePicker from '../components/common/CustomDatePicker';
import Pagination from '../components/common/Pagination';
import { ordersApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatusTab, setActiveStatusTab] = useState('Tất cả');
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const { addToast } = useToast();

  const statusTabs = ['Tất cả', 'Chờ xác nhận', 'Đang pha chế', 'Đang giao', 'Đã hoàn thành', 'Đã hủy'];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeStatusTab !== 'Tất cả') params.status = activeStatusTab;

      const res = await ordersApi.getAll(params);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Lỗi khi tải danh sách đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeStatusTab]);

  const handleAdvanceStatus = async (orderId) => {
    try {
      const res = await ordersApi.advanceStatus(orderId);
      addToast(res.message, 'success');
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Lỗi cập nhật trạng thái', 'error');
    }
  };

  const handleRefund = async (orderId) => {
    if (!window.confirm('Xác nhận đóng dấu HOÀN TIỀN (Refund) cho phiếu này?')) return;
    try {
      const res = await ordersApi.refund(orderId);
      addToast(res.message, 'success');
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Lỗi khi xử lý hoàn tiền', 'error');
    }
  };

  const handlePrint = (order) => {
    addToast(`Đang in phiếu order #${order.id} ra máy in quầy bar...`, 'info');
  };

  // Filter orders by search & date if selected
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.payment && order.payment.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSearch;
  });

  return (
    <div className="font-body animate-editorial-in text-brand-dark space-y-6">
      <SectionHeader 
        sectionNo="MỤC III &bull; SỔ ĐIỀU PHỐI & PHIẾU GỌI MÓN" 
        title="Quản Lý Đơn Hàng & Giao Vận Pha Chế" 
        subtitle="Theo dõi tiến độ đơn hàng thực tế từ lúc khách gọi món, điều phối quầy pha chế đến hoàn tất thanh toán." 
        action={
          <div className="flex items-center gap-2">
            <span className="ink-stamp stamp-cerulean text-xs font-bold">
              <i className="fa-solid fa-receipt mr-1"></i> TỔNG ĐƠN HÀNG: {orders.length}
            </span>
          </div>
        }
      />
      
      {/* Workflow Tabs, Date Picker & Search Toolbar */}
      <div className="editorial-paper p-3 sm:p-4 bg-brand-paperLight flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
        {/* Status Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 max-w-full">
          {statusTabs.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveStatusTab(tab)}
              className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 sm:py-2 font-cinzel text-xs font-bold border transition-all cursor-pointer flex-shrink-0 ${
                activeStatusTab === tab 
                  ? 'bg-cerulean text-white border-cerulean-dark shadow-sm' 
                  : 'text-cerulean bg-white border-brand-borderLight hover:bg-brand-paperDark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Date Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="w-full sm:w-52">
            <CustomDatePicker
              value={selectedDate}
              onChange={(dateStr) => {
                setSelectedDate(dateStr);
                addToast(`Đã lọc danh sách theo ngày: ${dateStr}`, 'info');
              }}
              placeholder="Lọc theo ngày..."
            />
          </div>

          <div className="relative w-full sm:w-56">
            <input
              type="text"
              placeholder="Tìm mã đơn, khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-cerulean pl-8 pr-3 py-2 text-xs font-serif focus:outline-none focus:ring-1 focus:ring-jasper"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-400 text-xs"></i>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12 bg-white editorial-paper">
          <i className="fa-solid fa-scroll fa-spin text-3xl text-jasper mb-2"></i>
          <p className="font-serif italic text-gray-600">Đang tải sổ điều phối đơn hàng...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center p-12 bg-white editorial-paper space-y-2">
          <i className="fa-regular fa-folder-open text-4xl text-gray-300 mb-1 block"></i>
          <p className="font-serif text-lg text-gray-700 font-bold">Hiện không có phiếu gọi món nào trong mục này.</p>
          <p className="font-serif italic text-xs text-gray-500 max-w-md mx-auto">
            Đơn hàng sẽ tự động xuất hiện tại đây theo thời gian thực khi khách hàng đặt đồ uống hoặc khi phát sinh giao dịch mua bán thực tế.
          </p>
        </div>
      ) : (
        /* Orders Ledger Cards Grid with Pagination */
        <div className="space-y-6">
          <div className="editorial-table-scroll p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((order) => (
                <div 
                  key={order.id} 
                  className="editorial-card-press bg-white flex flex-col justify-between border border-cerulean shadow-[4px_4px_0px_rgba(18,72,116,0.9)]"
                >
                  {/* Order Header Receipt Bar */}
                  <div className="p-4 border-b border-brand-borderLight bg-brand-paperDark flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-jasper">
                          #{order.id}
                        </span>
                        <span className="font-mono text-[10px] text-gray-500">
                          {order.time}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-cerulean truncate max-w-[180px] mt-1">
                        {order.customer}
                      </h3>
                    </div>

                    <StatusBadge status={order.status} />
                  </div>

                  {/* Order Body Details */}
                  <div className="p-4 space-y-3 font-serif flex-1">
                    <div className="flex justify-between items-center text-sm border-b border-dashed border-brand-borderLight pb-2">
                      <span className="text-gray-600">Tổng thanh toán:</span>
                      <span className="font-mono font-bold text-lg text-cerulean">{order.total}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Phương thức:</span>
                      <span className="font-mono font-bold text-gray-700 bg-brand-paper px-2 py-0.5 border border-brand-borderLight">
                        {order.payment}
                      </span>
                    </div>

                    {order.notes && (
                      <div className="p-2 bg-brand-paper text-xs text-gray-600 italic border-l-2 border-jasper">
                        "{order.notes}"
                      </div>
                    )}
                  </div>

                  {/* Order Footer Actions */}
                  <div className="p-3 bg-brand-paperLight border-t border-brand-borderLight flex items-center justify-between gap-2">
                    <button 
                      onClick={() => handlePrint(order)}
                      className="press-btn p-2 bg-white text-cerulean hover:bg-cerulean hover:text-white transition-colors border border-brand-borderLight cursor-pointer"
                      title="In phiếu quầy bar"
                    >
                      <i className="fa-solid fa-print text-xs"></i>
                    </button>

                    <div className="flex gap-2">
                      {order.status !== 'Đã hoàn thành' && order.status !== 'Đã hủy' && (
                        <button 
                          onClick={() => handleAdvanceStatus(order.id)}
                          className="press-btn px-3 py-1.5 bg-cerulean text-white font-cinzel text-[11px] font-bold hover:bg-cerulean-dark transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>TIẾP THEO</span>
                          <i className="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                      )}

                      {order.status !== 'Đã hủy' && (
                        <button 
                          onClick={() => handleRefund(order.id)}
                          className="press-btn px-2.5 py-1.5 bg-white text-jasper font-cinzel text-[11px] font-bold hover:bg-jasper hover:text-white transition-colors border border-jasper cursor-pointer"
                          title="Hoàn tiền & hủy đơn"
                        >
                          HOÀN TIỀN
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Pagination Footer */}
          <div className="editorial-paper overflow-hidden bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredOrders.length / itemsPerPage) || 1}
              totalItems={filteredOrders.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemsPerPageOptions={[6, 9, 12, 18, 30]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersView;
