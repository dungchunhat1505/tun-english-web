import React, { useState, useEffect, useRef } from 'react';
import vocabData from '../data/vocabulary.json';
import ExampleTranslation from '../components/ExampleTranslation';

// Helper phát âm audio bằng giọng đọc người thật UK chuẩn (Youdao Dictionary API)
const speakText = (text, e) => {
    if (e) e.stopPropagation();
    const audioUrl = `https://dict.youdao.com/dictvoice?type=1&audio=${encodeURIComponent(text)}`;
    const audio = new Audio(audioUrl);
    audio.play().catch(err => {
        console.error("Lỗi phát âm audio:", err);
    });
};


function Exercises() {
    // 1. Các State quản lý bộ lọc cốt lõi (Khối lớp, Bài học, Chặng từ vựng)
    const [selectedGrade, setSelectedGrade] = useState('11');
    const [selectedUnit, setSelectedUnit] = useState('1');
    const [selectedRange, setSelectedRange] = useState(0);

    // Các State quản lý trạng thái câu hỏi
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Các tính năng mới bổ sung
    const [quizHistory, setQuizHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('tunverse_quiz_history');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const chunkSize = 20; // Số từ trong 1 chặng bài test

    // Hàm trộn mảng ngẫu nhiên
    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

    // Bước A: Lọc toàn bộ từ vựng thuộc khối và unit đã chọn
    const unitVocab = vocabData.filter(v =>
        v.grade.toString() === selectedGrade && v.unit.toString() === selectedUnit
    );
    const unitTitle = unitVocab.length > 0 ? unitVocab[0].context : "";

    // Bước B: Chia nhỏ từ vựng thành các chặng (mỗi chặng 20 từ)
    const subRanges = [];
    for (let i = 0; i < unitVocab.length; i += chunkSize) {
        const start = i + 1;
        const end = Math.min(i + chunkSize, unitVocab.length);
        subRanges.push({
            index: i / chunkSize,
            label: `Từ No. ${start} - ${end}`,
            startIndex: i
        });
    }

    // 2. Hàm khởi tạo bài tập trắc nghiệm ngẫu nhiên
    const generateQuiz = () => {
        if (unitVocab.length === 0 || subRanges.length === 0) {
            setQuestions([]);
            return;
        }

        const currentRange = subRanges[selectedRange] || subRanges[0];
        const rangeVocab = unitVocab.slice(currentRange.startIndex, currentRange.startIndex + chunkSize);

        if (rangeVocab.length < 1) {
            setQuestions([]);
            return;
        }

        const shuffledVocab = shuffleArray(rangeVocab);

        const newQuestions = shuffledVocab.map((item) => {
            // Dạng câu hỏi: 0 là đục lỗ ví dụ, 1 là định nghĩa
            const questionType = Math.floor(Math.random() * 2);
            let finalType = (questionType === 0 && item.example) ? 0 : 1;

            let questionText = "";
            let displayType = "";

            if (finalType === 0) {
                // Tạo regex khớp từ gốc và các biến thể đuôi phổ biến (s, es, ed, ing, d)
                const wordEscaped = item.word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const patternStr = `\\b${wordEscaped}(s|es|ed|ing|d)?\\b`;
                let replacedText = item.example.replace(new RegExp(patternStr, 'gi'), '_______');

                if (replacedText === item.example && item.word_in_example) {
                    const inflectedEscaped = item.word_in_example.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    replacedText = item.example.replace(new RegExp(`\\b${inflectedEscaped}\\b`, 'gi'), '_______');
                }

                // Nếu vẫn chưa thay thế được (không khớp biên từ), thay thế thô không cần ranh giới từ
                if (replacedText === item.example) {
                    replacedText = item.example.replace(new RegExp(wordEscaped, 'gi'), '_______');
                }

                if (replacedText === item.example) {
                    questionText = `Từ/Cấu trúc nào có nghĩa là: "${item.meaning}"?`;
                    displayType = 'Định nghĩa';
                } else {
                    questionText = replacedText;
                    displayType = 'Ví dụ';
                }
            } else {
                questionText = `Từ/Cấu trúc nào có nghĩa là: "${item.meaning}"?`;
                displayType = 'Định nghĩa';
            }

            // --- THUẬT TOÁN ĐÁP ÁN NHIỄU THÔNG MINH ---
            let pool = vocabData.filter(v => v.word !== item.word && v.grade.toString() === selectedGrade && v.unit.toString() === selectedUnit);
            let typeMatchedPool = pool.filter(v => v.word_type === item.word_type);

            let finalPool = [];
            if (typeMatchedPool.length >= 3) {
                finalPool = typeMatchedPool;
            } else if (pool.length >= 3) {
                finalPool = pool;
            } else {
                let gradePool = vocabData.filter(v => v.word !== item.word && v.grade.toString() === selectedGrade);
                let gradeTypePool = gradePool.filter(v => v.word_type === item.word_type);
                if (gradeTypePool.length >= 3) {
                    finalPool = gradeTypePool;
                } else if (gradePool.length >= 3) {
                    finalPool = gradePool;
                } else {
                    finalPool = vocabData.filter(v => v.word !== item.word);
                }
            }

            const distractors = shuffleArray(finalPool).slice(0, 3).map(v => v.word);
            const options = shuffleArray([item.word, ...distractors]);

            return {
                id: item.id,
                question: questionText,
                correctAnswer: item.word,
                options: options,
                type: displayType,
                wordItem: item
            };
        });

        setQuestions(newQuestions);
        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
    };

    // Tự động đưa học sinh về chặng đầu tiên khi đổi Lớp hoặc bài học
    useEffect(() => {
        setSelectedRange(0);
    }, [selectedGrade, selectedUnit]);

    // Tự động reload đề trắc nghiệm mới
    useEffect(() => {
        generateQuiz();
    }, [selectedGrade, selectedUnit, selectedRange]);

    const handleSelect = (questionId, option) => {
        if (isSubmitted) return;
        setUserAnswers({ ...userAnswers, [questionId]: option });
    };

    // Hàm lưu lịch sử làm bài vào localStorage
    const saveQuizToHistory = (finalScore) => {
        const currentRange = subRanges[selectedRange] || { label: "Chặng 1" };
        const historyItem = {
            id: Date.now(),
            grade: selectedGrade,
            unit: selectedUnit,
            rangeLabel: currentRange.label,
            score: finalScore,
            total: questions.length,
            timestamp: new Date().toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
            })
        };

        const updatedHistory = [historyItem, ...quizHistory].slice(0, 10);
        setQuizHistory(updatedHistory);
        localStorage.setItem('tunverse_quiz_history', JSON.stringify(updatedHistory));
    };

    const handleSubmit = () => {
        let currentScore = 0;
        questions.forEach((q) => {
            if (userAnswers[q.id] === q.correctAnswer) {
                currentScore++;
            }
        });
        setScore(currentScore);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        saveQuizToHistory(currentScore);
    };

    const handleClearHistory = () => {
        if (confirm("Em có chắc chắn muốn xóa toàn bộ lịch sử làm bài trắc nghiệm không?")) {
            setQuizHistory([]);
            localStorage.removeItem('tunverse_quiz_history');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 select-none pb-20 animate-fadeIn">
            {/* BẢNG TIÊU ĐỀ & HỆ THỐNG BỘ LỌC 3 TẦNG CHUYÊN NGHIỆP (Soft-Neobrutalism Box) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border-3 border-[#4A4E69] shadow-[5px_5px_0px_0px_#FFC6FF]">
                <div className="space-y-1.5 text-left">
                    <h2 className="text-3xl font-black text-[#4A4E69] tracking-tight">Kiểm Tra Từ Vựng 📝</h2>
                    {unitTitle ? (
                        <div className="inline-flex items-center gap-2 text-[#FF85A1] font-black text-xs bg-[#FFF0F3] px-3.5 py-1.5 rounded-2xl border-2 border-[#4A4E69] shadow-[1.5px_1.5px_0px_0px_#4A4E69]">
                            <span>🎯 Chủ đề: <span className="capitalize">{unitTitle}</span></span>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic font-bold">Chọn cấu hình bài học ôn tập</p>
                    )}
                </div>

                {/* 3 Bộ Dropdowns chọn Lớp - Unit - Chặng */}
                <div className="flex flex-wrap gap-3 justify-end items-end lg:ml-auto w-full lg:w-auto">
                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Khối Lớp</span>
                        <select
                            value={selectedGrade}
                            disabled={Object.keys(userAnswers).length > 0 && !isSubmitted}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="bg-[#FFF0F3] border-3 border-[#4A4E69] rounded-2xl px-3 py-2 text-xs font-black text-[#4A4E69] focus:outline-none cursor-pointer disabled:opacity-50 shadow-[2px_2px_0px_0px_#4A4E69] active:translate-y-0.5"
                        >
                            <option value="10">Lớp 10</option>
                            <option value="11">Lớp 11</option>
                            <option value="12">Lớp 12</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Bài Học</span>
                        <select
                            value={selectedUnit}
                            disabled={Object.keys(userAnswers).length > 0 && !isSubmitted}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            className="bg-[#FFF0F3] border-3 border-[#4A4E69] rounded-2xl px-3 py-2 text-xs font-black text-[#4A4E69] focus:outline-none cursor-pointer disabled:opacity-50 shadow-[2px_2px_0px_0px_#4A4E69] active:translate-y-0.5"
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>Unit {i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-black uppercase text-gray-400 ml-1">Từ Vựng</span>
                        <select
                            value={selectedRange}
                            disabled={Object.keys(userAnswers).length > 0 && !isSubmitted}
                            onChange={(e) => setSelectedRange(Number(e.target.value))}
                            className="bg-[#FFF0F3] border-3 border-[#4A4E69] rounded-2xl px-3 py-2 text-xs font-black text-[#4A4E69] focus:outline-none cursor-pointer disabled:opacity-50 min-w-[130px] shadow-[2px_2px_0px_0px_#4A4E69] active:translate-y-0.5"
                        >
                            {subRanges.length > 0 ? (
                                subRanges.map((range) => (
                                    <option key={range.index} value={range.index}>{range.label}</option>
                                ))
                            ) : (
                                <option value={0}>Không có từ</option>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {/* Bảng thông báo kết quả điểm số thiết kế như Phiếu Điểm viết tay cực kute */}
            {isSubmitted && (
                <div className="bg-white border-3 border-[#4A4E69] p-6 rounded-3xl shadow-[6px_6px_0px_0px_#BDE0FE] text-center space-y-3 relative overflow-hidden">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#FDFFB6] border-b-3 border-l-3 border-[#4A4E69] rounded-bl-2xl"></div>
                    <h3 className="text-xl font-black text-[#4A4E69]">Kết quả bài làm:</h3>
                    <div className="text-5xl font-black text-[#FF85A1] my-2 font-mono">
                        {score}/{questions.length}
                    </div>
                    <p className="text-sm text-gray-500 font-bold px-4 leading-relaxed max-w-md mx-auto">
                        {score === questions.length
                            ? "Fantastic, wonderful, significant, magnificent, outstanding, class of titans, đây là world class thưa quý vị. 🌟 Học trò của tôi đấy! 💁🏻‍♂️"
                            : "Flashcards lật đi lật lại đã rồi mà vẫn sai. 🤦🏻‍♂️ Giỡn mặt hả?! 🤬 Học lại giùm anh cái! 🙇🏻‍♂️ "
                        }
                    </p>
                    <button
                        onClick={generateQuiz}
                        className="mt-4 bg-[#FFC6FF] border-3 border-[#4A4E69] text-[#4A4E69] px-6 py-2 rounded-2xl font-black text-xs hover:bg-[#ffb3ff] transition-all shadow-[2.5px_2.5px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none cursor-pointer"
                    >
                        Làm lại chặng này 🔄
                    </button>
                </div>
            )}

            {/* Vùng render câu hỏi trắc nghiệm (Dạng Tờ Đề kiểm tra học đường) */}
            <div className="space-y-6 text-left">
                {questions.length > 0 ? (
                    questions.map((q, index) => (
                        <div key={q.id} className="bg-white p-6 rounded-3xl border-3 border-[#4A4E69] shadow-[4px_4px_0px_0px_#FFE5EC] space-y-4">
                            <div className="flex justify-between items-center border-b-2 border-dashed border-gray-100 pb-2">
                                <div className="flex items-center gap-3">
                                    {/* STT Câu hỏi giống sticker tròn */}
                                    <span className="bg-[#FFC6FF] border-2 border-[#4A4E69] text-[#4A4E69] w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-[1.5px_1.5px_0px_0px_#4A4E69]">
                                        {index + 1}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-[#4A4E69]/60 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                        Dạng: {q.type}
                                    </span>
                                </div>
                            </div>

                            <p className="text-base sm:text-lg text-[#4A4E69] font-black leading-relaxed">
                                {q.question}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {q.options.map((option) => {
                                    let statusClass = "bg-white border-[#4A4E69] text-[#4A4E69] hover:bg-[#FFF0F3] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#FFE5EC] active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_#4A4E69]";

                                    if (isSubmitted) {
                                        if (option === q.correctAnswer) {
                                            statusClass = "bg-[#CAFFBF] border-[#4A4E69] text-[#4A4E69] font-black shadow-none ring-3 ring-[#CAFFBF]/30";
                                        } else if (userAnswers[q.id] === option && option !== q.correctAnswer) {
                                            statusClass = "bg-[#FFADAD] border-[#4A4E69] text-[#4A4E69] font-black shadow-none";
                                        } else {
                                            statusClass = "opacity-40 border-gray-200 text-gray-400 line-through shadow-none";
                                        }
                                    } else if (userAnswers[q.id] === option) {
                                        statusClass = "bg-[#FFC6FF] border-[#4A4E69] text-[#4A4E69] font-black shadow-none translate-y-0.5";
                                    }

                                    return (
                                        <button
                                            key={option}
                                            disabled={isSubmitted}
                                            onClick={() => handleSelect(q.id, option)}
                                            className={`p-4 rounded-2xl border-3 text-left font-black text-xs sm:text-sm transition-all duration-100 flex justify-between items-center cursor-pointer ${statusClass}`}
                                        >
                                            <span>{option}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* --- HỘP GIẢI THÍCH CHI TIẾT SAU KHI NỘP BÀI (Dạng giấy Memo dán kute) --- */}
                            {isSubmitted && (
                                <div className="mt-4 p-4 bg-[#FDFFB6]/90 border-3 border-[#4A4E69] rounded-2xl shadow-[3px_3px_0px_0px_#4A4E69] space-y-2.5 text-xs sm:text-sm text-[#4A4E69] animate-fadeIn relative">
                                    {/* Sticker băng dính kẹp góc xinh xắn */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#FFC6FF]/60 border-2 border-[#4A4E69] -rotate-3 opacity-90"></div>

                                    <div className="font-black text-[#4A4E69] flex items-center gap-1.5 pt-2">
                                        <span>💡 Giải thích đáp án:</span>
                                    </div>

                                    <div className="leading-relaxed">
                                        <strong>Đáp án đúng:</strong> <span className="text-green-600 font-black">{q.correctAnswer}</span>
                                        <button
                                            onClick={(e) => speakText(q.correctAnswer, e)}
                                            className="p-1 bg-white hover:bg-[#FFC6FF] rounded-full border-2 border-[#4A4E69] text-[10px] inline-flex items-center ml-2 shadow-[1px_1px_0px_0px_#4A4E69] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                            title="Nghe phát âm đáp án chính xác 🔊"
                                        >
                                            🔊
                                        </button>
                                        <span className="ml-2 font-bold">({q.wordItem.word_type}) - <span className="italic text-gray-500 font-semibold">{q.wordItem.ipa}</span>: <span className="font-extrabold">{q.wordItem.meaning}</span></span>
                                    </div>

                                    {q.wordItem.example && (
                                        <div className="bg-white/80 p-2.5 rounded-xl border-2 border-[#4A4E69] shadow-inner space-y-1">
                                            <strong>Ví dụ ngữ cảnh:</strong>
                                            <p className="italic text-[#4A4E69] font-bold">"{q.wordItem.example}"</p>
                                            <ExampleTranslation text={q.wordItem.example} />
                                        </div>
                                    )}

                                    {q.wordItem.synonym && q.wordItem.synonym !== 'none' && (
                                        <div>
                                            <strong>Đồng nghĩa:</strong> <span className="text-blue-500 font-extrabold lowercase">{q.wordItem.synonym}</span>
                                        </div>
                                    )}
                                    {q.wordItem.antonym && q.wordItem.antonym !== 'none' && (
                                        <div>
                                            <strong>Trái nghĩa:</strong> <span className="text-orange-500 font-extrabold lowercase">{q.wordItem.antonym}</span>
                                        </div>
                                    )}

                                    {/* Phân tích câu sai */}
                                    {userAnswers[q.id] !== q.correctAnswer && userAnswers[q.id] && (() => {
                                        const wrongWordInfo = vocabData.find(v => v.word === userAnswers[q.id]);
                                        if (wrongWordInfo) {
                                            return (
                                                <div className="pt-2 border-t-2 border-dashed border-[#4A4E69]/30 mt-2 text-xs text-red-500 font-bold">
                                                    ⚠️ <strong>Phân tích lỗi sai:</strong> Em đã chọn <span className="underline font-black">{userAnswers[q.id]}</span>. Từ này có nghĩa là <strong>"{wrongWordInfo.meaning}"</strong> ({wrongWordInfo.word_type}) nên không khớp với câu hỏi/ngữ cảnh ví dụ trên.
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-3 border-dashed border-[#4A4E69] shadow-[4px_4px_0px_0px_#FFE5EC] max-w-xl mx-auto">
                        <span className="text-5xl block mb-4">📦</span>
                        <p className="text-[#4A4E69] font-black italic">TunVerse đang nạp dữ liệu cho chặng từ vựng này.</p>
                        <p className="text-gray-400 text-xs mt-1 font-bold">Các em chọn bài học hoặc chặng khác để thử thách nhé!</p>
                    </div>
                )}
            </div>

            {/* Nút bấm kiểm tra kết quả cuối trang */}
            {questions.length > 0 && !isSubmitted && (
                <div className="text-center pt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(userAnswers).length < questions.length}
                        className={`px-12 py-4 rounded-full font-black text-sm sm:text-base border-3 border-[#4A4E69] shadow-[4px_4px_0px_0px_#4A4E69] transition-all cursor-pointer 
                  ${Object.keys(userAnswers).length < questions.length
                                ? 'bg-gray-200 text-gray-400 border-gray-300 shadow-none cursor-not-allowed'
                                : 'bg-[#FF85A1] text-white hover:bg-[#ff6b8e] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none'}`}
                    >
                        Nộp bài & Kiểm tra 🚩
                    </button>
                    {Object.keys(userAnswers).length < questions.length && (
                        <p className="text-red-400 text-xs mt-3 font-black">Em cần tích chọn đầy đủ {questions.length} câu để nộp bài nhé!</p>
                    )}
                </div>
            )}

            {/* --- BẢNG HIỂN THỊ LỊCH SỬ LÀM BÀI TẬP (Report Card Vibe) --- */}
            {quizHistory.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border-3 border-[#4A4E69] shadow-[5px_5px_0px_0px_#BDE0FE] text-left space-y-4">
                    <div className="flex justify-between items-center border-b-2 border-dashed border-[#BDE0FE] pb-3">
                        <h3 className="text-lg font-black text-[#4A4E69] flex items-center gap-1.5">
                            📊 Bảng Điểm Ôn Tập Học Học Kỳ
                        </h3>
                        <button
                            onClick={handleClearHistory}
                            className="text-xs font-black text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            Xóa bảng điểm 🗑️
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm text-left text-gray-500">
                            <thead className="text-xs text-[#4A4E69] uppercase bg-[#FFF0F3] border-b-3 border-[#4A4E69]">
                                <tr>
                                    <th className="px-4 py-3 font-black rounded-l-xl">Thời gian làm</th>
                                    <th className="px-4 py-3 font-black">Lớp - Bài học</th>
                                    <th className="px-4 py-3 font-black">Chặng từ vựng</th>
                                    <th className="px-4 py-3 font-black rounded-r-xl text-center">Xếp loại điểm số</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-[#FFF0F3]">
                                {quizHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#FFF6F8]/60 transition-colors">
                                        <td className="px-4 py-3.5 text-xs font-bold text-gray-400">{item.timestamp}</td>
                                        <td className="px-4 py-3.5 font-black text-[#4A4E69]">Lớp {item.grade} - Unit {item.unit}</td>
                                        <td className="px-4 py-3.5 text-xs font-bold text-gray-500">{item.rangeLabel}</td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-[#4A4E69] shadow-[1.5px_1.5px_0px_0px_#4A4E69] ${item.score === item.total
                                                ? 'bg-[#CAFFBF] text-[#4A4E69]'
                                                : item.score >= item.total * 0.8
                                                    ? 'bg-[#BDE0FE] text-[#4A4E69]'
                                                    : 'bg-[#FDFFB6] text-[#4A4E69]'
                                                }`}>
                                                {item.score} / {item.total}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Exercises;