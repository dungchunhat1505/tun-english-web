import React, { useState, useEffect } from 'react';
import vocabData from '../data/vocabulary.json';

// Helper phát âm từ vựng bằng giọng đọc người thật UK chuẩn (Youdao Dictionary API)
const speakText = (text, e) => {
  if (e) e.stopPropagation(); // Tránh kích hoạt lật thẻ
  const audioUrl = `https://dict.youdao.com/dictvoice?type=1&audio=${encodeURIComponent(text)}`;
  const audio = new Audio(audioUrl);
  audio.play().catch(err => {
    console.error("Lỗi phát âm audio:", err);
  });
};

const FlashcardItem = ({ item, index, isLearned, onToggleLearned }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset trạng thái lật thẻ khi ID từ vựng thay đổi (đặc biệt hữu ích trong chế độ Slide)
  useEffect(() => {
    setIsFlipped(false);
  }, [item.id]);

  return (
    <div className="h-85 w-full perspective-1000 cursor-pointer group select-none" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

        {/* MẶT TRƯỚC */}
        <div className="absolute inset-0 backface-hidden bg-white border-3 border-[#4A4E69] rounded-3xl shadow-[5px_5px_0px_0px_#FF85A1] flex flex-col items-center justify-center p-6 text-center transition-all duration-200 group-hover:shadow-[7px_7px_0px_0px_#FF85A1] group-hover:-translate-y-0.5">

          {/* Hộp STT thiết kế dạng Nhãn Vở cực dễ thương */}
          <div className="absolute top-4 left-4 bg-[#FDFFB6] text-[#4A4E69] font-black text-xs px-3 py-1 rounded-xl border-2 border-[#4A4E69] shadow-[1.5px_1.5px_0px_0px_#4A4E69]">
            No. {index + 1}
          </div>

          {/* Nút phát âm loa ở góc trên bên phải */}
          <button
            onClick={(e) => speakText(item.word, e)}
            className="absolute top-4 right-4 p-2 bg-[#FFF6F8] hover:bg-[#FFC6FF] rounded-full border-2 border-[#4A4E69] transition-all text-xs z-10 hover:scale-110 active:scale-95 cursor-pointer shadow-[1.5px_1.5px_0px_0px_#4A4E69]"
            title="Nghe phát âm 🔊"
          >
            🔊
          </button>

          <span className="text-[#FF85A1] font-black text-xs uppercase tracking-widest mb-1.5 bg-[#FFF0F3] border-2 border-dashed border-[#FFC6FF] px-2.5 py-0.5 rounded-lg">Unit {item.unit}</span>
          <h3 className="text-3xl font-black text-[#4A4E69] tracking-tight lowercase mb-1">{item.word}</h3>
          <span className="text-xs font-black text-gray-400 italic mb-2">({item.word_type})</span>
          <p className="text-gray-500 font-extrabold italic text-base bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">{item.ipa}</p>
          
          <div className="mt-4 text-[#FF85A1] text-[10px] font-black tracking-wide border-t border-dashed border-gray-100 pt-3 w-full animate-pulse">Bấm để lật xem nghĩa ✨</div>

          {/* Nút Đã học ở đáy thẻ */}
          <div className="absolute bottom-4 z-10" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleLearned(item.id)}
              className={`px-4 py-1.5 rounded-2xl border-3 border-[#4A4E69] text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                isLearned 
                  ? 'bg-[#CAFFBF] text-[#4A4E69] shadow-[2px_2px_0px_0px_#4A4E69]' 
                  : 'bg-white text-gray-400 hover:text-[#CAFFBF] hover:bg-gray-50 shadow-[2px_2px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none'
              }`}
            >
              {isLearned ? '✅ Đã học' : '✔️ Chưa học'}
            </button>
          </div>
        </div>

        {/* MẶT SAU (Giao diện dòng kẻ nháp sổ tay học sinh) */}
        <div className="absolute inset-0 backface-hidden bg-[#FFF8FA] border-3 border-[#4A4E69] rounded-3xl shadow-[5px_5px_0px_0px_#FF85A1] flex flex-col p-6 rotate-y-180 overflow-y-auto space-y-4 transition-all duration-200 group-hover:shadow-[7px_7px_0px_0px_#FF85A1] group-hover:-translate-y-0.5">
          <div className="flex justify-between items-start border-b-2 border-dashed border-[#FFC6FF]/40 pb-2">
            <div>
              <span className="text-[10px] font-black text-[#FF85A1] uppercase tracking-wider bg-[#FFF0F3] px-2 py-0.5 rounded border border-[#FFC6FF]">Nghĩa của từ:</span>
              <p className="text-[#4A4E69] font-black text-lg leading-snug mt-1.5">{item.meaning}</p>
            </div>
            <button
              onClick={(e) => speakText(item.word, e)}
              className="p-2 bg-white hover:bg-[#FFC6FF] rounded-full border-2 border-[#4A4E69] transition-all text-xs shadow-[1.5px_1.5px_0px_0px_#4A4E69] hover:scale-110 active:scale-95 cursor-pointer"
              title="Nghe phát âm 🔊"
            >
              🔊
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-white/80 p-3 rounded-2xl border-2 border-[#4A4E69] shadow-[2px_2px_0px_0px_#FFC6FF]">
            <div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider block">Synonym:</span>
              <p className="text-xs text-gray-700 font-bold mt-1 lowercase truncate">{item.synonym || 'none'}</p>
            </div>
            <div>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider block">Antonym:</span>
              <p className="text-xs text-gray-700 font-bold mt-1 lowercase truncate">{item.antonym || 'none'}</p>
            </div>
          </div>

          {/* Dạng ô note đính kẹp kim loại kute */}
          <div className="bg-white p-4 rounded-2xl border-3 border-[#4A4E69] shadow-[3px_3px_0px_0px_#FFC6FF] relative overflow-hidden">
            <span className="text-[10px] font-black text-[#4A4E69] uppercase tracking-wider block border-b border-gray-100 pb-1">Example:</span>
            <p className="text-xs sm:text-sm text-[#4A4E69] font-semibold italic mt-2 leading-relaxed">
              "{item.example}"
            </p>
          </div>

          {/* Nút Đã học ở đáy thẻ mặt sau */}
          <div className="flex justify-center pt-2 mt-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleLearned(item.id)}
              className={`px-4 py-1.5 rounded-2xl border-3 border-[#4A4E69] text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                isLearned 
                  ? 'bg-[#CAFFBF] text-[#4A4E69] shadow-[2px_2px_0px_0px_#4A4E69]' 
                  : 'bg-white text-gray-400 hover:text-[#CAFFBF] hover:bg-gray-50 shadow-[2px_2px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none'
              }`}
            >
              {isLearned ? '✅ Đã học' : '✔️ Chưa học'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function Flashcards() {
  const [selectedGrade, setSelectedGrade] = useState('11');
  const [selectedUnit, setSelectedUnit] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Các state quản lý chế độ xem và bộ lọc
  const [viewMode, setViewMode] = useState('grid'); // 'grid' hoặc 'slide'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'learned', 'unlearned'
  const [searchAllLibrary, setSearchAllLibrary] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [shuffledList, setShuffledList] = useState(null);

  // Đọc dữ liệu học tập đã lưu của học sinh từ localStorage
  const [masteredWords, setMasteredWords] = useState(() => {
    try {
      const saved = localStorage.getItem('tunverse_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Lưu trạng thái học tập mỗi khi thay đổi
  const handleToggleLearned = (id) => {
    setMasteredWords(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('tunverse_mastered', JSON.stringify(next));
      return next;
    });
  };

  // Reset slide index và mảng trộn khi thay đổi bộ lọc
  useEffect(() => {
    setShuffledList(null);
    setActiveSlideIndex(0);
  }, [selectedGrade, selectedUnit, searchQuery, statusFilter, searchAllLibrary]);

  // 1. Bộ lọc cơ bản theo Grade, Unit và Tìm kiếm từ khóa
  const baseFiltered = vocabData.filter(item => {
    const matchesFilter = searchAllLibrary || (item.grade.toString() === selectedGrade && item.unit.toString() === selectedUnit);
    const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 2. Lọc tiếp theo trạng thái học tập (Đã học / Chưa học)
  const finalFiltered = baseFiltered.filter(item => {
    if (statusFilter === 'learned') return masteredWords.includes(item.id);
    if (statusFilter === 'unlearned') return !masteredWords.includes(item.id);
    return true;
  });

  // Mảng từ vựng chính thức đang dùng để hiển thị (có hỗ trợ trộn thẻ)
  const activeList = shuffledList || finalFiltered;

  const unitTitle = vocabData.find(item =>
    item.grade.toString() === selectedGrade && item.unit.toString() === selectedUnit
  )?.context || "";

  // Logic trộn thẻ ngẫu nhiên
  const handleShuffle = () => {
    const listToShuffle = shuffledList || finalFiltered;
    if (listToShuffle.length <= 1) return;
    const shuffled = [...listToShuffle].sort(() => Math.random() - 0.5);
    setShuffledList(shuffled);
    setActiveSlideIndex(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn select-none pb-8">
      {/* 1. Hộp dụng cụ điều khiển lọc & tìm kiếm (Pencil Box Layout) */}
      <div className="bg-white p-6 rounded-3xl border-3 border-[#4A4E69] shadow-[5px_5px_0px_0px_#BDE0FE] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-black text-[#4A4E69] tracking-tight">Thư Viện Từ Vựng 📚</h2>
            {!searchAllLibrary && unitTitle && (
              <div className="inline-flex items-center gap-2 text-[#FF85A1] font-black text-xs bg-[#FFF0F3] px-3.5 py-1.5 rounded-2xl border-2 border-[#4A4E69] shadow-[1.5px_1.5px_0px_0px_#4A4E69]">
                <span>🌱 Chủ đề: <span className="capitalize">{unitTitle}</span></span>
              </div>
            )}
            {searchAllLibrary && (
              <div className="inline-flex items-center gap-2 text-blue-600 font-black text-xs bg-blue-50 px-3.5 py-1.5 rounded-2xl border-2 border-blue-200 shadow-[1.5px_1.5px_0px_0px_#BDE0FE]">
                <span>🌍 Chế độ: Tìm kiếm trên toàn thư viện</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Input tìm kiếm */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Tìm từ vựng hoặc nghĩa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FFF0F3] border-3 border-[#4A4E69] rounded-2xl px-10 py-3 text-xs font-black text-[#4A4E69] focus:outline-none focus:bg-white transition-all placeholder:text-gray-400"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔍</span>
            </div>

            {/* Bộ lọc Grade & Unit */}
            <div className="flex gap-2">
              <select
                value={selectedGrade}
                disabled={searchAllLibrary}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-white border-3 border-[#4A4E69] rounded-2xl px-4 py-3 text-xs font-black text-[#4A4E69] focus:outline-none cursor-pointer disabled:opacity-40 shadow-[2px_2px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none"
              >
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>

              <select
                value={selectedUnit}
                disabled={searchAllLibrary}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="bg-white border-3 border-[#4A4E69] rounded-2xl px-4 py-3 text-xs font-black text-[#4A4E69] focus:outline-none cursor-pointer disabled:opacity-40 shadow-[2px_2px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Unit {i + 1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Thanh công cụ phụ: Đánh dấu đã học + Chế độ view */}
        <div className="pt-4 border-t-2 border-dashed border-[#FFE5EC] flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Lọc trạng thái Đã học / Chưa học */}
            <div className="flex gap-2 items-center text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase">Trạng thái:</span>
              <div className="bg-[#FFF0F3] p-1.5 rounded-2xl border-3 border-[#4A4E69] flex gap-1 shadow-[2px_2px_0px_0px_#4A4E69]">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-[#FF85A1] text-white shadow-sm' : 'text-[#4A4E69] hover:bg-white/50'}`}
                >
                  Tất cả ({baseFiltered.length})
                </button>
                <button
                  onClick={() => setStatusFilter('learned')}
                  className={`px-3.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${statusFilter === 'learned' ? 'bg-[#CAFFBF] text-[#4A4E69] shadow-sm' : 'text-[#4A4E69] hover:bg-white/50'}`}
                >
                  Đã học ({baseFiltered.filter(x => masteredWords.includes(x.id)).length})
                </button>
                <button
                  onClick={() => setStatusFilter('unlearned')}
                  className={`px-3.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${statusFilter === 'unlearned' ? 'bg-[#FFD6A5] text-[#4A4E69] shadow-sm' : 'text-[#4A4E69] hover:bg-white/50'}`}
                >
                  Chưa học ({baseFiltered.filter(x => !masteredWords.includes(x.id)).length})
                </button>
              </div>
            </div>

            {/* Checkbox Tìm kiếm toàn thư viện */}
            <label className="inline-flex items-center gap-2.5 cursor-pointer border-3 border-[#4A4E69] bg-white rounded-2xl px-3.5 py-1.5 hover:bg-gray-50 active:translate-y-0.5 active:shadow-none transition-all shadow-[2px_2px_0px_0px_#4A4E69]">
              <input
                type="checkbox"
                checked={searchAllLibrary}
                onChange={(e) => setSearchAllLibrary(e.target.checked)}
                className="accent-[#FF85A1] h-4 w-4 cursor-pointer"
              />
              <span className="text-xs font-black text-[#4A4E69]">Tìm kiếm toàn bộ thư viện 🌍</span>
            </label>
          </div>

          {/* Toggle Chế độ xem Grid / Slide */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10px] font-black text-gray-400 uppercase">Chế độ xem:</span>
            <div className="bg-[#FFF6F8] p-1.5 rounded-2xl border-3 border-[#4A4E69] flex gap-1 shadow-[2px_2px_0px_0px_#4A4E69]">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${viewMode === 'grid' ? 'bg-white text-[#4A4E69] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                🎛️ Dạng lưới
              </button>
              <button
                onClick={() => setViewMode('slide')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${viewMode === 'slide' ? 'bg-white text-[#4A4E69] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                🃏 Học từng từ
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Hiển thị kết quả */}
      {activeList.length > 0 ? (
        viewMode === 'slide' ? (
          /* CHẾ ĐỘ XEM SLIDE (HỌC TỪNG TỪ) */
          <div className="max-w-md mx-auto space-y-6">
            <FlashcardItem
              key={activeList[activeSlideIndex].id}
              item={activeList[activeSlideIndex]}
              index={(() => {
                const currentWord = activeList[activeSlideIndex];
                const siblings = vocabData.filter(v => v.grade === currentWord.grade && v.unit === currentWord.unit);
                return siblings.findIndex(v => v.id === currentWord.id);
              })()}
              isLearned={masteredWords.includes(activeList[activeSlideIndex].id)}
              onToggleLearned={handleToggleLearned}
            />

            {/* Thanh điều hướng Slide béo múp neobrutalist */}
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border-3 border-[#4A4E69] shadow-[4px_4px_0px_0px_#FF85A1]">
              <button
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex(prev => prev - 1)}
                className="px-4 py-2.5 bg-white border-3 border-[#4A4E69] text-[#4A4E69] rounded-2xl font-black hover:bg-[#FFF0F3] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all text-xs shadow-[2.5px_2.5px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                &larr; Trước
              </button>
              
              <span className="font-black text-[#4A4E69] text-sm bg-[#FFF0F3] px-4 py-1.5 rounded-full border-2 border-[#4A4E69]">
                Thẻ {activeSlideIndex + 1} / {activeList.length}
              </span>
              
              <button
                disabled={activeSlideIndex === activeList.length - 1}
                onClick={() => setActiveSlideIndex(prev => prev + 1)}
                className="px-4 py-2.5 bg-white border-3 border-[#4A4E69] text-[#4A4E69] rounded-2xl font-black hover:bg-[#FFF0F3] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed transition-all text-xs shadow-[2.5px_2.5px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                Sau &rarr;
              </button>
            </div>

            {/* Các tùy chọn trộn thẻ trong chế độ Slide */}
            <div className="flex justify-center gap-3">
              <button
                onClick={handleShuffle}
                className="px-5 py-2.5 bg-[#FFC6FF] border-3 border-[#4A4E69] text-[#4A4E69] hover:bg-[#ffb3ff] rounded-2xl font-black text-xs transition-all shadow-[3px_3px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none cursor-pointer"
              >
                🔀 Trộn ngẫu nhiên
              </button>
              {shuffledList && (
                <button
                  onClick={() => setShuffledList(null)}
                  className="px-5 py-2.5 bg-white border-3 border-[#4A4E69] text-gray-500 rounded-2xl font-black text-xs transition-all shadow-[3px_3px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  🔄 Hoàn tác trộn
                </button>
              )}
            </div>
          </div>
        ) : (
          /* CHẾ ĐỘ XEM LƯỚI (MẶC ĐỊNH) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeList.map((item) => {
              const siblings = vocabData.filter(v => v.grade === item.grade && v.unit === item.unit);
              const unitIndex = siblings.findIndex(v => v.id === item.id);
              return (
                <FlashcardItem
                  key={item.id}
                  item={item}
                  index={unitIndex}
                  isLearned={masteredWords.includes(item.id)}
                  onToggleLearned={handleToggleLearned}
                />
              );
            })}
          </div>
        )
      ) : (
        /* KHI KHÔNG CÓ TỪ VỰNG KHỚP */
        <div className="text-center py-20 bg-white rounded-3xl border-3 border-dashed border-[#4A4E69] max-w-xl mx-auto shadow-[4px_4px_0px_0px_#FFC6FF]">
          <span className="text-5xl block mb-4">🕵️‍♀️</span>
          <p className="text-[#4A4E69] font-black text-base">Không tìm thấy từ vựng nào khớp với bộ lọc.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setSearchAllLibrary(false);
            }}
            className="mt-4 px-4 py-2 bg-white border-3 border-[#4A4E69] rounded-2xl text-[#FF85A1] font-black text-xs shadow-[2.5px_2.5px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Khôi phục bộ lọc mặc định
          </button>
        </div>
      )}
    </div>
  );
}

export default Flashcards;