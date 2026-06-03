import React, { useState, useEffect } from 'react';
import vocabData from '../data/vocabulary.json';

function Exercises() {
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedGrade, setSelectedGrade] = useState('11');
    const [selectedUnit, setSelectedUnit] = useState('1');

    // Hàm trộn mảng ngẫu nhiên
    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

    // Khởi tạo bài tập
    const generateQuiz = () => {
        const unitVocab = vocabData.filter(v =>
            v.grade.toString() === selectedGrade && v.unit.toString() === selectedUnit
        );

        if (unitVocab.length < 4) {
            setQuestions([]); // Không đủ từ để làm trắc nghiệm
            return;
        }
        // Trộn toàn bộ từ vựng
        const shuffledVocab = shuffleArray(vocabData);

        // Lấy tối đa 10 câu hỏi (hoặc bằng số lượng từ hiện có)
        const selectedVocab = shuffledVocab.slice(0, 10);

        const newQuestions = selectedVocab.map((item) => {
            // 1. Quyết định loại câu hỏi: 0 là đục lỗ ví dụ, 1 là định nghĩa
            const questionType = Math.floor(Math.random() * 2);

            // 2. Tạo nội dung câu hỏi
            const questionText = questionType === 0
                ? item.example.replace(new RegExp(item.word, 'gi'), '_______')
                : `Từ nào có nghĩa là: "${item.meaning}"?`;

            // 3. Tạo 4 đáp án (1 đúng + 3 sai ngẫu nhiên)
            const distractors = shuffleArray(
                vocabData.filter(v => v.word !== item.word)
            ).slice(0, 3).map(v => v.word);

            const options = shuffleArray([item.word, ...distractors]);

            return {
                id: item.id,
                question: questionText,
                correctAnswer: item.word,
                options: options,
                type: questionType === 0 ? 'Ví dụ' : 'Định nghĩa'
            };
        });

        setQuestions(newQuestions);
        setUserAnswers({});
        setIsSubmitted(false);
        setScore(0);
    };

    useEffect(() => {
        generateQuiz();
    }, []);

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
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#4A4E69]">Thử Thách Từ Vựng 📝</h2>
                <p className="text-gray-500 italic">Chọn đáp án đúng nhất để hoàn thành câu</p>
            </div>

            {/* Bảng điểm sau khi nộp */}
            {isSubmitted && (
                <div className="bg-white border-4 border-[#FFC6FF] p-6 rounded-3xl shadow-xl text-center animate-bounce">
                    <h3 className="text-2xl font-bold text-[#4A4E69]">Kết quả của em:</h3>
                    <div className="text-5xl font-black text-[#FF85A1] my-2">
                        {score} / {questions.length}
                    </div>
                    <p className="text-gray-600 font-medium">
                        {score === questions.length ? "Xuất sắc quá! 🔥" : "Cố gắng lên nhé, ôn lại Flashcard nha!"}
                    </p>
                    <button
                        onClick={generateQuiz}
                        className="mt-4 bg-[#4A4E69] text-white px-6 py-2 rounded-full font-bold hover:bg-[#2B2D42] transition-all"
                    >
                        Làm bài mới 🔄
                    </button>
                </div>
            )}

            {/* Danh sách câu hỏi */}
            <div className="space-y-6">
                {questions.map((q, index) => (
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
                                // Logic hiển thị màu sắc sau khi nộp bài
                                let statusClass = "border-[#FFE5EC] hover:bg-[#FFF0F3]";
                                if (isSubmitted) {
                                    if (option === q.correctAnswer) {
                                        statusClass = "bg-green-100 border-green-500 text-green-700 ring-2 ring-green-200";
                                    } else if (userAnswers[q.id] === option && option !== q.correctAnswer) {
                                        statusClass = "bg-red-100 border-red-500 text-red-700";
                                    } else {
                                        statusClass = "opacity-50 border-gray-100";
                                    }
                                } else if (userAnswers[q.id] === option) {
                                    statusClass = "bg-[#FFC6FF] border-[#FF85A1] text-[#4A4E69] shadow-inner";
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
                ))}
            </div>

            {/* Nút nộp bài */}
            {!isSubmitted && (
                <div className="text-center pt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(userAnswers).length < questions.length}
                        className={`px-12 py-4 rounded-full font-black text-lg shadow-lg transition-all 
              ${Object.keys(userAnswers).length < questions.length
                                ? 'bg-gray-300 text-white cursor-not-allowed'
                                : 'bg-[#FF85A1] text-white hover:bg-[#ff6b8e] hover:scale-105 active:scale-95'}`}
                    >
                        Nộp bài & Kiểm tra 🚩
                    </button>
                    {Object.keys(userAnswers).length < questions.length && (
                        <p className="text-red-400 text-xs mt-3 font-medium">Em cần hoàn thành tất cả các câu hỏi để nộp bài nhé!</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Exercises;