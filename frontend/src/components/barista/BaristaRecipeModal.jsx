import React, { useState } from 'react';
import Modal from '../common/Modal';

export const BaristaRecipeModal = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchRecipe, setSearchRecipe] = useState('');

  const RECIPES = [
    {
      id: 'REC-01',
      name: 'Cà Phê Muối Sài Gòn (Signature)',
      category: 'Cà phê',
      difficulty: 'Trung bình',
      temp: 'Nước 92°C - 94°C',
      brewTime: '2 phút 30 giây',
      ratio: '1:4 (25g cà phê : 100ml nước)',
      ingredients: [
        '25g Bột cà phê mộc Blend (Robusta Cầu Đất 70% + Arabica 30%)',
        '20ml Sữa đặc Ông Thọ / Ngôi Sao Phương Nam',
        '40ml Kem béo thực vật đánh bông cùng 1.5g muối hồng Himalaya',
        'Đá viên tinh khiết đầy ly 500ml',
      ],
      steps: [
        '1. Tráng phin bằng nước sôi 95°C để giữ nhiệt ổn định.',
        '2. Cho 25g bột cà phê vào phin, gài nắp nén với lực vừa phải (khoảng 3kg).',
        '3. Rót 25ml nước sôi ủ trong 60 giây cho cà phê nở bung tỏa hương.',
        '4. Rót tiếp 75ml nước sôi và đậy nắp, chiết xuất lấy 45ml - 50ml cốt cà phê đậm đặc.',
        '5. Cho sữa đặc vào ly, khuấy tan cùng cốt cà phê nóng.',
        '6. Thêm đá viên cách miệng ly 3cm, rót nhẹ lớp kem muối béo bồng bềnh lên trên cùng. Rắc nhẹ 1 nhúm bột cacao trang trí.',
      ],
      baristaNotes: 'Kem muối phải được đánh bông đạt độ sánh mịn mượt màng (soft peaks), không đánh quá cứng sẽ bị tách lớp.'
    },
    {
      id: 'REC-02',
      name: 'Espresso Ristretto Đậm Bản',
      category: 'Cà phê',
      difficulty: 'Chuyên sâu',
      temp: 'Nước 93.5°C',
      brewTime: '26 - 28 giây',
      ratio: '1:2 (18.5g in : 37g out)',
      ingredients: [
        '18.5g Cà phê hạt Arabica Cầu Đất rang vừa (Medium Roast)',
        'Nước lọc tinh khiết TDS 120-150 ppm',
        'Áp suất máy: 9.0 Bar chuẩn',
      ],
      steps: [
        '1. Xả họng pha (purge grouphead) 2 giây để ổn định nhiệt độ.',
        '2. Xay 18.5g bột cà phê vào tay cầm (portafilter 58mm).',
        '3. Dùng công cụ phân phối WDT dàn đều bột, nén phẳng với lực nén 15kg bằng tamper calibrated.',
        '4. Lắp tay cầm và bấm chiết xuất ngay lập tức.',
        '5. Quan sát dòng chảy: dạng đuôi chuột màu nâu hổ phách, lớp crema dày mịn màu hạt dẻ sau 27 giây thu được 37g espresso.',
      ],
      baristaNotes: 'Nếu chiết xuất < 22s: chỉnh máy xay mịn hơn. Nếu > 32s: chỉnh máy xay thô hơn.'
    },
    {
      id: 'REC-03',
      name: 'Trà Sen Vàng Macchiato Hoàng Gia',
      category: 'Trà sữa',
      difficulty: 'Dễ',
      temp: 'Ủ lạnh 4°C',
      brewTime: '12 giờ ủ chậm',
      ratio: '1:30 (30g trà Oolong : 900ml nước lọc)',
      ingredients: [
        '120ml Cốt trà Oolong hoa sen ủ lạnh 12h',
        '20ml Nước đường mía nguyên chất (hoặc tùy chỉnh % theo order)',
        '30g Hạt sen Huế ninh đường phèn bùi ngọt',
        '45ml Lớp bọt kem Cheese Foam Macchiato đánh tươi',
      ],
      steps: [
        '1. Đong 120ml cốt trà Oolong sen vào bình lắc (shaker).',
        '2. Thêm nước đường mía theo đúng % đường trên phiếu gọi món.',
        '3. Cho đá viên vào lắc đều tay 10 lần cho dậy hương hoa sen thanh tao.',
        '4. Múc 30g hạt sen Huế lót dưới đáy ly phục vụ.',
        '5. Rót trà ra ly, chừa khoảng trống 3cm ở miệng ly.',
        '6. Nhẹ nhàng rót lớp Macchiato phủ kín bề mặt. Đậy nắp vòm hoặc nắp uống trực tiếp.',
      ],
      baristaNotes: 'Cốt trà Oolong sen phải luôn bảo quản trong tủ mát 4°C, không dùng cốt trà để qua 24 giờ.'
    },
    {
      id: 'REC-04',
      name: 'Trà Đào Cam Sả Tươi Nhiệt Đới',
      category: 'Trà trái cây',
      difficulty: 'Dễ',
      temp: 'Ủ nóng 90°C',
      brewTime: '8 phút',
      ratio: '1:25 (40g trà đen : 1000ml nước)',
      ingredients: [
        '100ml Cốt trà đen Earl Grey / Ceylon',
        '20ml Nước cốt cam sành tươi vắt',
        '15ml Syrup đào Monin hoặc đường mía',
        '1 Cây sả tươi đập dập phần gốc',
        '2 Miếng đào ngâm giòn',
        '1 Lát cam vàng sấy hoặc cam tươi trang trí',
      ],
      steps: [
        '1. Dầm nhẹ gốc sả trong bình shaker để tiết tinh dầu thơm.',
        '2. Cho 100ml cốt trà đen + 20ml nước cam + syrup đào vào bình.',
        '3. Thêm đá viên đầy bình và lắc thật mạnh tay trong 8 giây.',
        '4. Rót hỗn hợp trà ra ly, gắp 2 miếng đào ngâm đặt lên trên.',
        '5. Cài 1 lát cam vàng và 1 ngọn sả tươi vào miệng ly để tạo điểm nhấn mỹ thuật.',
      ],
      baristaNotes: 'Không dầm sả quá nát sẽ làm nước trà bị đục và có vị chát gắt.'
    },
    {
      id: 'REC-05',
      name: 'Trà Sữa Oolong Trân Châu Đen',
      category: 'Trà sữa',
      difficulty: 'Trung bình',
      temp: 'Ủ 88°C',
      brewTime: '10 phút',
      ratio: '50g trà Oolong rang : 1000ml nước',
      ingredients: [
        '100ml Cốt trà Oolong rang đậm vị',
        '25g Bột sữa béo thực vật New Zealand',
        '15ml Sữa đặc + Nước đường theo mức ngọt khách chọn',
        '40g Trân châu đen dẻo ủ mật mía',
      ],
      steps: [
        '1. Khuấy tan bột sữa béo vào cốt trà Oolong nóng cho đến khi sánh mịn.',
        '2. Thêm sữa đặc và nước đường theo đúng % của order.',
        '3. Cho đá viên vào shaker lắc đều 10 giây.',
        '4. Múc 40g trân châu đen ấm dẻo vào ly.',
        '5. Rót trà sữa vào ly và cắm ống hút trân châu.',
      ],
      baristaNotes: 'Trân châu sau khi luộc 30p, ủ 30p phải trộn mật mía và giữ ấm ở 45°C để luôn dẻo dai trong 6 giờ.'
    }
  ];

  const filtered = RECIPES.filter((r) => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const matchSearch =
      r.name.toLowerCase().includes(searchRecipe.toLowerCase()) ||
      r.id.toLowerCase().includes(searchRecipe.toLowerCase()) ||
      r.ingredients.some(i => i.toLowerCase().includes(searchRecipe.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="SỔ TAY CÔNG THỨC &amp; TỈ LỆ CHIẾT XUẤT &bull; BARISTA HANDBOOK"
    >
      <div className="space-y-5 font-body text-brand-dark max-h-[75vh] overflow-y-auto pr-1">
        
        {/* Search & Filter Strip */}
        <div className="p-3 bg-[#FAF7F2] border-2 border-[#124874] flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'TẤT CẢ (5)' },
              { id: 'Cà phê', label: 'CÀ PHÊ' },
              { id: 'Trà sữa', label: 'TRÀ SỮA' },
              { id: 'Trà trái cây', label: 'TRÀ TRÁI CÂY' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 font-cinzel text-xs font-bold border transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#124874] text-white border-[#124874] font-black'
                    : 'bg-white text-[#124874] border-[#D8D1C5] hover:bg-[#FAF7F2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Tìm công thức, nguyên liệu..."
              value={searchRecipe}
              onChange={(e) => setSearchRecipe(e.target.value)}
              className="w-full bg-white border border-[#124874] pl-8 pr-3 py-1.5 font-serif text-xs focus:outline-none focus:ring-1 focus:ring-[#CF373D]"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-2.5 top-2.5 text-gray-400 text-xs"></i>
          </div>
        </div>

        {/* Recipe Cards List */}
        <div className="space-y-4">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white p-5 border-2 border-[#124874] shadow-xs space-y-3 font-body"
            >
              {/* Recipe Header */}
              <div className="flex flex-wrap justify-between items-start border-b border-[#124874] pb-2.5 gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 bg-[#124874] text-white font-cinzel text-[10px] font-bold">
                      {recipe.id}
                    </span>
                    <span className="font-cinzel text-[10px] text-[#CF373D] font-bold uppercase">
                      {recipe.category} &bull; Độ khó: {recipe.difficulty}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#124874]">
                    {recipe.name}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  <span className="px-2 py-1 bg-[#FAF7F2] border border-[#D8D1C5] text-gray-700">
                    <i className="fa-solid fa-temperature-three-quarters mr-1 text-[#CF373D]"></i>
                    {recipe.temp}
                  </span>
                  <span className="px-2 py-1 bg-[#FAF7F2] border border-[#D8D1C5] text-gray-700">
                    <i className="fa-solid fa-stopwatch mr-1 text-[#124874]"></i>
                    {recipe.brewTime}
                  </span>
                  <span className="px-2 py-1 bg-[#FAF7F2] border border-[#D8D1C5] text-emerald-800 font-bold">
                    <i className="fa-solid fa-scale-balanced mr-1"></i>
                    {recipe.ratio}
                  </span>
                </div>
              </div>

              {/* Ingredients & Steps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                {/* Ingredients (5 cols) */}
                <div className="md:col-span-5 bg-[#FAF7F2] p-3 border border-[#D8D1C5] space-y-1.5">
                  <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase block border-b border-[#D8D1C5] pb-1">
                    ĐỊNH LƯỢNG NGUYÊN LIỆU:
                  </span>
                  <ul className="space-y-1 font-serif text-gray-800">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#CF373D] font-bold">&bull;</span>
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Steps (7 cols) */}
                <div className="md:col-span-7 space-y-1.5">
                  <span className="font-cinzel text-[10px] font-bold text-[#124874] uppercase block border-b border-[#D8D1C5] pb-1">
                    QUY TRÌNH THỰC HIỆN PHA CHẾ:
                  </span>
                  <div className="space-y-1.5 font-serif text-gray-800 text-[11px] leading-relaxed">
                    {recipe.steps.map((step, idx) => (
                      <p key={idx}>{step}</p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Barista Secret Note */}
              <div className="p-2.5 bg-amber-50/80 border-l-4 border-amber-500 text-[11px] font-serif italic text-amber-900 flex items-start gap-2">
                <i className="fa-solid fa-lightbulb text-amber-600 mt-0.5"></i>
                <span><strong>Bí quyết Barista:</strong> {recipe.baristaNotes}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-3 border-t border-[#124874]">
          <button
            type="button"
            onClick={onClose}
            style={{ backgroundColor: '#124874', color: '#ffffff' }}
            className="press-btn px-6 py-2 font-cinzel text-xs font-bold hover:bg-[#CF373D] cursor-pointer"
          >
            ĐÃ HIỂU &bull; ĐÓNG SỔ TAY
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default BaristaRecipeModal;
