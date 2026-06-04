import React from 'react';
import avatarTun from '../assets/avatar-tun.jpg';

function Home({ setCurrentPage }) {
    return (
        <div className="space-y-16 pb-12 animate-fadeIn">
            {/* 1. Banner chào mừng (Hero Section) */}
            <section className="bg-gradient-to-r from-[#FFE5EC] to-[#FFC6FF] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-md">
                {/* Nội dung giới thiệu bên trái */}
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <span className="bg-white/60 text-[#4A4E69] font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm uppercase tracking-wider border border-[#FFC6FF]">
                        Chuyên luyện tiếng Anh cấp 3 (Lớp 10 - 11 - 12)
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4A4E69] leading-tight">
                        Bứt phá điểm số <br className="hidden sm:inline" />
                        <span className="text-[#FF85A1]">Tiếng Anh</span> cùng TunVerse
                    </h1>
                    {/* Thay thế đoạn thẻ <p> cũ bằng đoạn mã chia dòng và làm nổi bật Slogan này nha Tủn */}
                    <div className="text-[#4A4E69]/90 font-medium text-base sm:text-lg max-w-xl leading-relaxed space-y-4 text-left">

                        {/* Dòng 1: Lời chào thân thiện */}
                        <p className="font-bold text-[#4A4E69] text-lg sm:text-xl">
                            Hello cả nhà iu của TunVerse! 🧑🏻‍🏫
                        </p>

                        {/* Dòng 2: Đặt vấn đề đánh trúng tâm lý học sinh */}
                        <p>
                            Đau đầu vì núi từ vựng học trước quên sau? 💆🏻 Lại không biết hệ thống hóa với ôn tập kiểu gì cho hiệu quả? 🫩
                        </p>

                        {/* Dòng 3: Khẳng định giải pháp */}
                        <p className="font-extrabold text-[#4A4E69]">
                            <span className="text-[#FF85A1]">TunVerse</span> chính xác là những gì tụi em cần 🤯
                        </p>

                        {/* Dòng 4: Giải thích tính năng cốt lõi */}
                        <p className="text-sm sm:text-base opacity-90">
                            Với hệ thống Flashcards thông minh giúp ghi nhớ dễ dàng hơn và kho trắc nghiệm để ôn tập những từ vựng đã học, TunVerse sẽ giúp tụi em làm chủ từ vựng một cách hiệu quả. 🧠
                        </p>

                        {/* Dòng cuối cùng: Slogan Highlight độc quyền nâng tầm Thương hiệu cá nhân */}
                        <div className="inline-flex items-center gap-2 bg-[#FFF0F3] border-2 border-[#FFC6FF] text-[#FF85A1] font-black text-base sm:text-lg px-5 py-2.5 rounded-2xl shadow-sm transform hover:scale-105 transition-all duration-200 cursor-default mt-2 select-none">
                            <span>✨</span>
                            <span>TunVerse: Chạm là nhớ, lướt là mướt! 🫵🏻</span>
                        </div>

                    </div>
                    <div className="pt-2">
                        <button
                            onClick={() => setCurrentPage('flashcards')}
                            className="bg-[#4A4E69] text-white hover:bg-[#2B2D42] font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Khám Phá Ngay 🚀
                        </button>
                    </div>
                </div>

                {/* Khung ảnh chân dung bên phải */}
                {/* ĐÃ SỬA: Thay h-48 và sm:h-64 thành h-auto để khung tự thích ứng theo chiều cao của ảnh */}
                <div className="flex-shrink-0 w-48 h-auto sm:w-64 rounded-2xl overflow-hidden border-4 border-white shadow-xl relative bg-white flex items-center justify-center group">

                    {/* ĐÃ SỬA: Thay h-full object-cover thành h-auto block để ảnh hiển thị nguyên vẹn, không bị cắt bớt */}
                    <img
                        src={avatarTun}
                        alt="TunVerse"
                        className="w-full h-auto block"
                    />

                    {/* Lớp phủ màu hồng pastel vẫn tự động ôm khít theo kích thước ảnh mới nhờ inset-0 */}
                    <div className="absolute inset-0 bg-[#FFC6FF]/20 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
            </section>

            {/* 2. Khu vực 2 Card lớn dẫn link tính năng */}
            <section className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4A4E69]">Hôm nay học gì?</h2>
                    <p className="text-gray-500 mt-1">Chọn một tính năng bên dưới để bắt đầu nâng trình tiếng Anh</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
                    {/* Card 1: Học Flashcard */}
                    <div
                        onClick={() => setCurrentPage('flashcards')}
                        className="bg-white p-8 rounded-2xl border-2 border-[#FFE5EC] hover:border-[#FFC6FF] shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
                    >
                        <div>
                            <div className="w-14 h-14 rounded-xl bg-[#FFE5EC] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                🃏
                            </div>
                            <h3 className="text-xl font-bold text-[#4A4E69] mb-3">Kho Từ Vựng Flashcard</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Học từ vựng theo chủ đề lớp 10, 11, 12. Thẻ lật thông minh cung cấp đầy đủ: Phiên âm IPA, từ đồng nghĩa, trái nghĩa và ví dụ ngữ cảnh cụ thể.
                            </p>
                        </div>
                        <div className="text-[#FF85A1] font-bold text-sm mt-6 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                            Luyện từ vựng ngay &rarr;
                        </div>
                    </div>

                    {/* Card 2: Làm Bài Tập */}
                    <div
                        onClick={() => setCurrentPage('exercises')}
                        className="bg-white p-8 rounded-2xl border-2 border-[#FFE5EC] hover:border-[#FFC6FF] shadow-sm hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1"
                    >
                        <div>
                            <div className="w-14 h-14 rounded-xl bg-[#FFC6FF]/40 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                📝
                            </div>
                            <h3 className="text-xl font-bold text-[#4A4E69] mb-3">Luyện Tập Trắc Nghiệm</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Hệ thống tự động trích xuất các từ đã học để tạo thành đề trắc nghiệm ngẫu nhiên. Giúp kiểm tra kiến thức lập tức, có chấm điểm và giải thích đúng sai.
                            </p>
                        </div>
                        <div className="text-[#FF85A1] font-bold text-sm mt-6 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                            Thử sức làm bài &rarr;
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;