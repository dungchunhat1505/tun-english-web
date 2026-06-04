import React, { useState, useEffect } from 'react';
import vocabData from '../data/vocabulary.json';

function Exercises() {
    // 1. Các State quản lý bộ lọc cốt lõi (Khối lớp, Bài học, Chặng từ vựng)
    const [selectedGrade, setSelectedGrade] = useState('11');
    const [selectedUnit, setSelectedUnit] = useState('1');
    const [selectedRange, setSelectedRange] = useState(0); // Vị trí chặng bài test: 0, 1, 2...

    // Các State quản lý trạng thái câu hỏi
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const chunkSize = 20; // Cấu hình số từ tối đa trong 1 bài test nhỏ của Tủn

    // Hàm trộn mảng ngẫu nhiên
    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

    // Bước A: Lọc toàn bộ từ vựng thuộc khối và unit đã chọn
    const unitVocab = vocabData.filter(v =>
        v.grade.toString() === selectedGrade && v.unit.toString() === selectedUnit
    );
    const unitTitle = unitVocab.length > 0 ? unitVocab[0].context : "";

    // Bước B: Thuật toán tự động chia nhỏ từ vựng trong Unit thành các chặng (mỗi chặng 20 từ)
    const subRanges = [];
    for (let i = 0; i < unitVocab.length; i += chunkSize) {
        const start = i + 1;
        const end = Math.min(i + chunkSize, unitVocab.length);
        subRanges.push({
            index: i / chunkSize,
            label: `Từ STT ${start} - ${end}`,
            startIndex: i
        });
    }

    // 2. Hàm khởi tạo bài tập ngẫu nhiên theo chặng 20 từ được chọn
    const generateQuiz = () => {
        if (unitVocab.length === 0 || subRanges.length === 0) {
            setQuestions([]);
            return;
        }

        // Lấy chặng hiện tại đang chọn (nếu vượt quá độ dài do đổi bài, mặc định lấy chặng đầu tiên)
        const currentRange = subRanges[selectedRange] || subRanges[0];

        // Trích xuất chính xác cụm 20 từ thuộc chặng đã chọn
        const rangeVocab = unitVocab.slice(currentRange.startIndex, currentRange.startIndex + chunkSize);

        if (rangeVocab.length < 1) {
            setQuestions([]);
            return;
        }

        // Trộn ngẫu nhiên cụm từ vựng trong chặng để tạo bộ đề test
        const shuffledVocab = shuffleArray(rangeVocab);

        const newQuestions = shuffledVocab.map((item) => {
            // Quyết định dạng câu hỏi: 0 là đục lỗ ví dụ, 1 là định nghĩa
            const questionType = Math.floor(Math.random() * 2);
            let finalType = (questionType === 0 && item.example) ? 0 : 1;

            let questionText = "";
            let displayType = "";

            if (finalType === 0) {
                let replacedText = item.example.replace(new RegExp(item.word, 'gi'), '_______');

                if (replacedText === item.example && item.word_in_example) {
                    replacedText = item.example.replace(new RegExp(item.word_in_example, 'gi'), '_______');
                }

                // Cơ chế bảo vệ: nếu không đục được lỗ thì tự động ép sang dạng định nghĩa để tránh lộ đáp án
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

            // Tạo đáp án nhiễu từ kho tổng để trắc nghiệm luôn có đủ 4 lựa chọn A, B, C, D
            const distractors = shuffleArray(
                vocabData.filter(v => v.word !== item.word)
            ).slice(0, 3).map(v => v.word);

            const options = shuffleArray([item.word, ...distractors]);

            return {
                id: item.id,
                question: questionText,
                correctAnswer: item.word,
                options: options,
                type: displayType
            };
        });

        setQuestions(newQuestions);
        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
    };

    // Tự động đưa học sinh về chặng đầu tiên (Từ 1-20) mỗi khi đổi Khối Lớp hoặc đổi Bài học
    useEffect(() => {
        setSelectedRange(0);
    }, [selectedGrade, selectedUnit]);

    // Tự động reload đề trắc nghiệm mới khi đổi Lớp, đổi Unit hoặc chuyển Chặng làm bài
    useEffect(() => {
        generateQuiz();
    }, [selectedGrade, selectedUnit, selectedRange]);

    const handleSelect = (questionId, option) => {
        if (isSubmitted) return;
        setUserAnswers({ ...userAnswers, [questionId]: option });
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
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-20">
            {/* BẢNG TIÊU ĐỀ & HỆ THỐNG BỘ LỌC 3 TẦNG CHUYÊN NGHIỆP */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border-2 border-[#FFE5EC] shadow-sm">
                <div className="space-y-1.5 text-left">
                    <h2 className="text-3xl font-black text-[#4A4E69]">Kiểm Tra Từ Vựng 📝</h2>
                    {unitTitle ? (
                        <div className="inline-flex items-center gap-2 text-[#FF85A1] font-bold text-sm bg-[#FFF0F3] px-3 py-1.5 rounded-xl border border-[#FFC6FF]">
                            <span>🎯 Chủ đề: <span className="capitalize">{unitTitle}</span></span>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">Chọn cấu hình bài học ôn tập</p>
                    )}
                </div>

                {/* 3 Bộ Dropdowns chọn Lớp - Unit - Chặng làm bài */}
                <div className="flex flex-wrap gap-3 justify-end items-end lg:ml-auto w-full lg:w-auto">
                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-bold uppercase text-gray-400 ml-1">Khối Lớp</span>
                        <select
                            value={selectedGrade}
                            disabled={Object.keys(userAnswers).length > 0 && !isSubmitted}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="bg-[#FFF0F3] border-2 border-[#FFC6FF] rounded-xl px-3 py-2 text-sm font-black text-[#4A4E69] focus:outline-none cursor-pointer disabled:opacity-50"
                        >
                            <option value="10">Lớp 10</option>
                            <option value="11">Lớp 11</option>
                            <option value="12">Lớp 12</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-bold uppercase text-gray-400 ml-1">Bài Học</span>
                        <select
                            value={selectedUnit}
                            disabled={Object.keys(userAnswers).length > 0 && !isSubmitted}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                            className="bg-[#FFF0F3] border-2 border-[#FFC6FF] rounded-xl px-3 py-2 text-sm font-black text-[#4A4E69] focus:outline-none cursor-pointer disabled:opacity-50"
                        >
                            {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>Unit {i + 1}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                        <span className="text-[10px] font-bold uppercase text-gray-400 ml-1">Từ Vựng</span>
                        <select
                            value={selectedRange}
                            disabled={Object.keys(userAnswers).length > 0 && !isSubmitted}
                            onChange={(e) => setSelectedRange(Number(e.target.value))}
                            className="bg-[#FFF0F3] border-2 border-[#FFC6FF] rounded-xl px-3 py-2 text-sm font-black text-[#4A4E69] focus:outline-none cursor-pointer disabled:opacity-50 min-w-[130px]"
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

            {/* Bảng thông báo kết quả điểm số */}
            {isSubmitted && (
                <div className="bg-white border-4 border-[#FFC6FF] p-6 rounded-3xl shadow-xl text-center animate-bounce">
                    <h3 className="text-2xl font-bold text-[#4A4E69]">Kết quả chặng này:</h3>
                    <div className="text-5xl font-black text-[#FF85A1] my-2">
                        {score} / {questions.length}
                    </div>
                    <p className="text-gray-600 font-medium">
                        {score === questions.length ? "Fantastic, wonderful, significant, magnificent, outstanding, class of titans, đây là world class thưa quý vị. 🌟 Học trò của tôi đấy! 💁🏻‍♂️" : "Flashcards lật đi lật lại đã rồi mà vẫn sai. 🤦🏻‍♂️ Giỡn mặt hả?! 🤬 Học lại giùm anh cái! 🙇🏻‍♂️ "}
                    </p>
                    <button
                        onClick={generateQuiz}
                        className="mt-4 bg-[#4A4E69] text-white px-6 py-2 rounded-full font-bold hover:bg-[#2B2D42] transition-all shadow-md"
                    >
                        Làm lại chặng này 🔄
                    </button>
                </div>
            )}

            {/* Vùng render câu hỏi trắc nghiệm */}
            <div className="space-y-6 text-left">
                {questions.length > 0 ? (
                    questions.map((q, index) => (
                        <div key={q.id} className="bg-white p-6 rounded-2xl border-2 border-[#FFE5EC] shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-[#FFC6FF] text-[#4A4E69] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                    Dạng: {q.type}
                                </span>
                            </div>

                            <p className="text-lg text-[#4A4E69] font-semibold mb-6 leading-relaxed">
                                {q.question}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {q.options.map((option) => {
                                    let statusClass = "border-[#FFE5EC] hover:bg-[#FFF0F3]";
                                    if (isSubmitted) {
                                        if (option === q.correctAnswer) {
                                            statusClass = "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-200 font-bold";
                                        } else if (userAnswers[q.id] === option && option !== q.correctAnswer) {
                                            statusClass = "bg-red-100 border-red-500 text-red-700 font-bold";
                                        } else {
                                            statusClass = "opacity-50 border-gray-100 line-through";
                                        }
                                    } else if (userAnswers[q.id] === option) {
                                        statusClass = "bg-[#FFC6FF] border-[#FF85A1] text-[#4A4E69] shadow-inner font-bold";
                                    }

                                    return (
                                        <button
                                            key={option}
                                            disabled={isSubmitted}
                                            onClick={() => handleSelect(q.id, option)}
                                            className={`p-4 rounded-xl border-2 text-left font-medium transition-all duration-200 ${statusClass}`}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#FFC6FF]">
                        <span className="text-4xl">📦</span>
                        <p className="text-gray-400 font-bold italic mt-3">TunVerse đang nạp dữ liệu cho chặng từ vựng này.</p>
                        <p className="text-gray-400 text-xs mt-1">Các em chọn bài học hoặc chặng khác để thử thách nhé!</p>
                    </div>
                )}
            </div>

            {/* Nút bấm kiểm tra kết quả cuối trang */}
            {questions.length > 0 && !isSubmitted && (
                <div className="text-center pt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(userAnswers).length < questions.length}
                        className={`px-12 py-4 rounded-full font-black text-lg shadow-lg transition-all 
                  ${Object.keys(userAnswers).length < questions.length
                                ? 'bg-gray-300 text-white cursor-not-allowed'
                                : 'bg-[#FF85A1] text-white hover:bg-[#ff6b8e] hover:scale-105 active:scale-95'}`}
                    >
                        Nộp bài & Kiểm tra chặng 🚩
                    </button>
                    {Object.keys(userAnswers).length < questions.length && (
                        <p className="text-red-400 text-xs mt-3 font-medium">Em cần tích chọn đầy đủ {questions.length} câu để nộp bài nhé!</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Exercises;