import React, { useState } from 'react';
import vocabData from '../data/vocabulary.json';

// Chỗ chỉnh sửa 1: Thêm prop "index" vào hàm nhận dữ liệu đầu vào của thẻ
const FlashcardItem = ({ item, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="h-80 w-full perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

        {/* MẶT TRƯỚC */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-[#FFC6FF] rounded-2xl shadow-sm flex flex-col items-center justify-center p-6 text-center">

          {/* Chỗ chỉnh sửa 2: Dán đoạn mã hiển thị STT của Tủn vào đây nè! */}
          {/* Pinned tuyệt đối vào góc top-4 left-4 và sẽ tự động ẩn đi nhờ thuộc tính backface-hidden khi lật thẻ */}
          <div className="absolute top-4 left-4 bg-[#FFF0F3] text-[#FF85A1] font-black text-xs px-2.5 py-1 rounded-lg border border-[#FFC6FF]">
            STT: {index + 1}
          </div>

          <span className="text-[#FF85A1] font-bold text-xs uppercase tracking-widest mb-2">Unit {item.unit}</span>
          <h3 className="text-3xl font-black text-[#4A4E69] lowercase">{item.word}</h3>
          <span className="text-sm font-bold text-gray-400 italic mb-2">({item.word_type})</span>
          <p className="text-gray-500 font-semibold italic text-lg">{item.ipa}</p>
          <div className="mt-6 text-[#FFC6FF] text-xs font-bold animate-pulse">Bấm để lật xem nghĩa ✨</div>
        </div>

        {/* MẶT SAU (Size chữ to rõ theo yêu cầu của Tủn) */}
        <div className="absolute inset-0 backface-hidden bg-[#FFF0F3] border-2 border-[#FFC6FF] rounded-2xl shadow-sm flex flex-col p-6 rotate-y-180 overflow-y-auto space-y-4">
          <div>
            <span className="text-xs font-extrabold text-[#FF85A1] uppercase tracking-wider">Nghĩa của từ:</span>
            <p className="text-[#4A4E69] font-black text-xl leading-snug mt-1">{item.meaning}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white/50 p-3 rounded-xl border border-[#FFC6FF]/20">
            <div>
              <span className="text-xs font-extrabold text-blue-500 uppercase tracking-wider">Synonym:</span>
              <p className="text-sm text-gray-700 font-bold mt-0.5 lowercase">{item.synonym || 'none'}</p>
            </div>
            <div>
              <span className="text-xs font-extrabold text-orange-500 uppercase tracking-wider">Antonym:</span>
              <p className="text-sm text-gray-700 font-bold mt-0.5 lowercase">{item.antonym || 'none'}</p>
            </div>
          </div>

          <div className="mt-auto bg-white p-4 rounded-xl border-2 border-[#FFE5EC] shadow-inner">
            <span className="text-xs font-extrabold text-[#4A4E69] uppercase tracking-wider">Example:</span>
            <p className="text-sm sm:text-base text-[#4A4E69] font-semibold italic mt-1 leading-relaxed">
              {item.example}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function Flashcards() {
  const [selectedGrade, setSelectedGrade] = useState('11');
  const [selectedUnit, setSelectedUnit] = useState('1');
  const [searchQuery, setSearchQuery] = useState(''); // State cho thanh tìm kiếm

  // Logic lọc dữ liệu: Khối lớp -> Unit -> Nội dung tìm kiếm (Word hoặc Meaning)
  const filteredData = vocabData.filter(item => {
    const matchesFilter = item.grade.toString() === selectedGrade && item.unit.toString() === selectedUnit;
    const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unitTitle = vocabData.find(item =>
    item.grade.toString() === selectedGrade && item.unit.toString() === selectedUnit
  )?.context || "";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header & Bộ lọc & Thanh tìm kiếm */}
      <div className="bg-white p-6 rounded-3xl border-2 border-[#FFE5EC] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#4A4E69]">Thư Viện Từ Vựng 📚</h2>
            {unitTitle && (
              <div className="inline-flex items-center gap-2 text-[#FF85A1] font-bold text-sm bg-[#FFF0F3] px-3 py-1.5 rounded-xl border border-[#FFC6FF]">
                <span>🌱 Chủ đề: <span className="capitalize">{unitTitle}</span></span>
              </div>
            )}
          </div>

          {/* Thanh tìm kiếm nằm ở bên phải cùng với bộ lọc */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Input tìm kiếm */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Tìm từ vựng hoặc nghĩa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-[#FFF0F3] border-2 border-[#FFC6FF] rounded-2xl px-10 py-2.5 text-sm font-bold text-[#4A4E69] focus:outline-none focus:ring-2 focus:ring-[#FF85A1]/30 transition-all placeholder:text-gray-400"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 grayscale group-focus-within:grayscale-0 transition-all">🔍</span>
            </div>

            <div className="flex gap-2">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-white border-2 border-[#FFC6FF] rounded-xl px-4 py-2.5 text-sm font-black text-[#4A4E69] focus:outline-none cursor-pointer"
              >
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>

              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="bg-white border-2 border-[#FFC6FF] rounded-xl px-4 py-2.5 text-sm font-black text-[#4A4E69] focus:outline-none cursor-pointer"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Unit {i + 1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hiển thị kết quả */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chỗ chỉnh sửa 3: Thêm tham số "index" vào hàm map và truyền tiếp index={index} xuống component con */}
          {filteredData.map((item, index) => (
            <FlashcardItem key={item.id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-[#FFC6FF]">
          <span className="text-4xl">🕵️‍♀️</span>
          <p className="text-gray-400 font-bold mt-3">Không tìm thấy từ "{searchQuery}" trong Unit này.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-[#FF85A1] font-black underline decoration-dashed underline-offset-4"
          >
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
}

export default Flashcards;