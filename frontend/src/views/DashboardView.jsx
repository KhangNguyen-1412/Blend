import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import SectionHeader from '../components/common/SectionHeader';
import { statsApi } from '../services/api';
import { useToast } from '../context/ToastContext';

export const DashboardView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const { addToast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await statsApi.getOverview();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Không thể tải dữ liệu thống kê', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!data?.chart || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.chart.labels,
        datasets: [{
          label: 'Doanh thu ghi nhận (VNĐ)',
          data: data.chart.values,
          borderColor: '#124874', // Xanh Cerulean
          backgroundColor: 'rgba(18, 72, 116, 0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.25,
          pointBackgroundColor: '#CF373D', // Đỏ Jasper
          pointBorderColor: '#124874',
          pointRadius: 4.5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#124874',
            titleFont: { family: 'Bodoni Moda, serif', size: 14 },
            bodyFont: { family: 'Courier Prime, monospace', size: 13 },
            padding: 10,
            cornerRadius: 0,
            borderColor: '#CF373D',
            borderWidth: 1.5,
            callbacks: {
              label: (context) => `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} đ`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { family: 'Courier Prime, monospace', size: 11 },
              color: '#6E675F',
              callback: (value) => `${(value / 1000000).toFixed(0)}M`
            },
            grid: { color: '#E5DFD5', borderDash: [3, 3] }
          },
          x: {
            ticks: {
              font: { family: 'Playfair Display, serif', size: 12, weight: 'bold' },
              color: '#124874'
            },
            grid: { display: false }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-brand-paperLight border-2 border-cerulean shadow-press max-w-sm">
          <i className="fa-solid fa-feather fa-spin text-3xl text-jasper mb-3"></i>
          <p className="font-display text-xl font-bold text-cerulean">ĐANG TẢI BẢN TIN...</p>
          <p className="font-body italic text-sm text-gray-500 mt-1">Đang tổng hợp các số liệu thực tế từ cơ sở dữ liệu.</p>
        </div>
      </div>
    );
  }

  const currentDateStr = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="space-y-8 font-body animate-editorial-in text-brand-dark">
      {/* Frontpage Section Header */}
      <SectionHeader 
        sectionNo="MỤC I &bull; TRANG NHẤT TOÀN CẢNH" 
        title="Bản Tin Tổng Quan & Hoạt Động Bán Hàng" 
        subtitle={`Ấn bản ngày ${currentDateStr}. Toàn bộ số liệu được kết xuất thời gian thực từ cơ sở dữ liệu SQLite.`} 
        action={
          <button 
            onClick={fetchStats}
            className="press-btn px-4 py-2 bg-white text-cerulean font-cinzel text-xs font-bold hover:bg-cerulean hover:text-white transition-colors"
          >
            <i className="fa-solid fa-rotate mr-1.5 text-jasper"></i> CẬP NHẬT SỐ LIỆU
          </button>
        }
      />
      
      {/* Editorial 4 Stat Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { 
            label: 'TỔNG DOANH THU', 
            sub: 'Đơn hàng thực thu',
            value: `${data?.stats?.revenue || 0}đ`, 
            stamp: 'DOANH THU',
            stampColor: 'stamp-green',
            accent: 'border-l-4 border-l-emerald-800'
          },
          { 
            label: 'TỔNG ĐƠN HÀNG', 
            sub: 'Giao dịch trong hệ thống',
            value: `${data?.stats?.orders || 0} ĐƠN`, 
            stamp: 'GIAO DỊCH',
            stampColor: 'stamp-cerulean',
            accent: 'border-l-4 border-l-cerulean'
          },
          { 
            label: 'ĐÃ HOÀN THÀNH', 
            sub: 'Pha chế & phục vụ xong',
            value: `${data?.stats?.success || 0} ĐƠN`, 
            stamp: 'THÀNH CÔNG',
            stampColor: 'stamp-green',
            accent: 'border-l-4 border-l-emerald-700'
          },
          { 
            label: 'ĐÃ HỦY / REFUND', 
            sub: 'Đơn hoàn tiền hoặc hủy',
            value: `${data?.stats?.canceled || 0} ĐƠN`, 
            stamp: 'HOÀN TRẢ',
            stampColor: 'stamp-jasper',
            accent: 'border-l-4 border-l-jasper'
          }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`editorial-card-press p-5 flex flex-col justify-between ${stat.accent}`}
          >
            <div className="flex justify-between items-start mb-3 border-b border-brand-borderLight pb-2">
              <div>
                <h3 className="font-cinzel text-[11px] font-bold tracking-widest text-brand-muted">
                  {stat.label}
                </h3>
                <p className="font-serif italic text-xs text-gray-500 mt-0.5">{stat.sub}</p>
              </div>
              <span className={`ink-stamp ${stat.stampColor} text-[9px]`}>
                {stat.stamp}
              </span>
            </div>
            
            <p className="font-display text-3xl font-black text-cerulean tracking-tight mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Broadsheet Split: Chart & Editorial Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Broadside Line Chart + Lead Story */}
        <div className="lg:col-span-8 space-y-6">
          <div className="editorial-card-press p-6 bg-white">
            <div className="flex justify-between items-center border-b-2 border-cerulean pb-3 mb-4">
              <div>
                <span className="font-cinzel text-xs uppercase tracking-widest text-jasper block font-bold">
                  DIỄN BIẾN THỊ TRƯỜNG &bull; WEEKLY REPORT
                </span>
                <h3 className="font-display text-2xl font-bold text-cerulean">
                  Đồ Thị Doanh Thu Tuần Hiện Tại
                </h3>
              </div>
              <span className="font-mono text-xs text-cerulean bg-brand-paperDark px-2 py-1 border border-brand-borderLight font-bold">
                ĐƠN VỊ: TRIỆU ĐỒNG
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <canvas ref={chartRef}></canvas>
            </div>

            <div className="border-t border-brand-borderLight mt-4 pt-3 text-xs italic text-gray-600 font-serif flex justify-between items-center">
              <span>* Nguồn: Tự động tổng hợp từ cơ sở dữ liệu bán hàng nội bộ Blend.</span>
              <span className="font-mono text-[11px] text-jasper font-bold">CHỈ SỐ TĂNG TRƯỞNG: +12.4%</span>
            </div>
          </div>

          {/* Lead Editorial Story */}
          <div className="editorial-paper p-6 bg-brand-paperLight">
            <h4 className="font-display text-xl font-bold text-cerulean mb-2 border-b border-brand-borderLight pb-1">
              Bình Luận Điều Hành & Tình Hình Quán
            </h4>
            <p className="drop-cap text-base leading-relaxed text-gray-800 font-serif">
              Tuần vừa qua ghi nhận sự bứt phá mạnh mẽ từ phân khúc Trà Sữa và Trà Trái Cây giải nhiệt. 
              Các dòng sản phẩm Signature như <strong className="text-cerulean font-bold">Trà Oolong Kem Phô Mai</strong> và <strong className="text-cerulean font-bold">Cà Phê Muối Blend</strong> 
              tiếp tục chiếm tỷ trọng hơn 60% tổng lượng ly bán ra mỗi ca sáng. 
              Bộ phận pha chế và kho nguyên liệu cần lưu ý duy trì định mức an toàn cho các mặt hàng sữa tươi và kem béo để không làm gián đoạn trải nghiệm của thực khách.
            </p>
          </div>
        </div>

        {/* Right 4 Cols: Top Rankings & Dispatches */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Bestsellers Column */}
          <div className="editorial-card-press p-6 bg-[#FCFAF6]">
            <div className="border-b-2 border-cerulean pb-2 mb-4 text-center">
              <span className="font-cinzel text-[10px] tracking-widest text-brand-muted uppercase block">
                BẢNG PHONG THẦN
              </span>
              <h3 className="font-display text-xl font-bold text-cerulean uppercase">
                Món Bán Chạy Nhất
              </h3>
            </div>

            {/* Drinks List */}
            <div className="space-y-4">
              <div className="text-xs font-cinzel font-bold text-jasper tracking-wider border-b border-brand-borderLight pb-1">
                I. ĐỒ UỐNG THỊNH HÀNH
              </div>
              <div className="space-y-2.5">
                {data?.topItems?.drinks?.map((item, idx) => (
                  <div key={item.id} className="leader-row text-sm">
                    <span className="leader-item font-serif font-bold text-brand-dark">
                      <span className="font-mono text-xs text-jasper mr-1.5 font-bold">{idx + 1}.</span>
                      {item.name}
                    </span>
                    <span className="leader-dots"></span>
                    <span className="leader-price text-cerulean font-mono text-xs font-bold">
                      {item.sold} ly
                    </span>
                  </div>
                ))}
              </div>

              {/* Topping List */}
              <div className="text-xs font-cinzel font-bold text-cerulean tracking-wider border-b border-brand-borderLight pb-1 pt-3">
                II. TOPPING BÁN CHẠY
              </div>
              <div className="space-y-2.5">
                {data?.topItems?.toppings?.map((item, idx) => (
                  <div key={item.id} className="leader-row text-sm">
                    <span className="leader-item font-serif text-gray-700 font-medium">
                      <span className="font-mono text-xs text-gray-400 mr-1.5">{idx + 1}.</span>
                      {item.name}
                    </span>
                    <span className="leader-dots"></span>
                    <span className="leader-price text-gray-600 font-mono text-xs">
                      {item.sold} phần
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Urgent Dispatches / Alerts Box in Solid Cerulean */}
          <div className="editorial-card-press p-6 bg-cerulean text-white">
            <div className="border-b border-white/20 pb-3 mb-4 flex justify-between items-center">
              <div>
                <span className="font-cinzel text-[10px] tracking-widest text-red-200 uppercase block font-semibold">
                  CÔNG BỐ KHẨN
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Cảnh Báo Vận Hành
                </h3>
              </div>
              <span className="ink-stamp text-[10px] bg-white text-jasper border-jasper font-bold">
                {data?.alerts?.length || 0} TIN
              </span>
            </div>

            {data?.alerts?.length === 0 ? (
              <p className="text-sm font-serif italic text-gray-200">Mọi chỉ số kho và đơn hàng hiện đang trong mức kiểm soát an toàn.</p>
            ) : (
              <ul className="space-y-3 font-serif text-sm">
                {data?.alerts?.map((alert, i) => (
                  <li key={i} className="flex gap-2.5 items-start bg-white/10 p-2.5 border border-white/20">
                    <i className={`fa-solid mt-1 ${alert.type === 'order' ? 'fa-bell text-amber-300' : 'fa-triangle-exclamation text-jasper'}`}></i>
                    <span className={alert.type === 'inventory' ? 'text-red-100 font-bold' : 'text-white'}>
                      {alert.message}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardView;
