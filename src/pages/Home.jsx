import React from 'react';
import avatarTun from '../assets/avatar-tun.jpg';

function Home({ setCurrentPage }) {
    return (
        <div className="space-y-16 pb-12 animate-fadeIn select-none">
            {/* 1. Banner chào mừng (Hero Section) */}
            <section className="bg-white border-3 border-[#4A4E69] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8 shadow-[6px_6px_0px_0px_#FF85A1] relative overflow-hidden">

                {/* Trang trí họa tiết tai thỏ/ticker ở góc trên */}
                <div className="absolute top-0 right-12 w-8 h-8 bg-[#FFC6FF] border-b-3 border-x-3 border-[#4A4E69] rounded-b-xl"></div>

                {/* Nội dung giới thiệu bên trái */}
                <div className="flex-1 space-y-6 text-center md:text-left z-10">
                    <span className="inline-block bg-[#FDFFB6] border-2 border-[#4A4E69] text-[#4A4E69] font-black px-4 py-1.5 rounded-full text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#4A4E69]">
                        Chuyên luyện tiếng Anh cấp 3 (Lớp 10 - 11 - 12)
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4A4E69] leading-tight">
                        Bứt phá điểm số <br className="hidden sm:inline" />
                        <span className="text-[#FF85A1]">Tiếng Anh</span> cùng TunVerse
                    </h1>

                    <div className="text-[#4A4E69] font-bold text-sm sm:text-base max-w-xl leading-relaxed space-y-4 text-left">
                        {/* Dòng 1: Lời chào thân thiện */}
                        <p className="font-extrabold text-[#4A4E69] text-lg sm:text-xl flex items-center gap-1.5">
                            <span>Hello cả nhà iu của TunVerse!</span>
                        </p>

                        {/* Dòng 2: Đặt vấn đề */}
                        <p className="font-bold text-gray-500">
                            Đau đầu vì núi từ vựng học trước quên sau? Lại không biết hệ thống hóa với ôn tập kiểu gì cho hiệu quả?
                        </p>

                        {/* Dòng 3: Khẳng định giải pháp */}
                        <p className="font-black text-[#4A4E69] text-base sm:text-lg">
                            <span className="text-[#FF85A1] font-black">TunVerse</span> chính xác là những gì tụi em cần!
                        </p>

                        {/* Dòng 4: Giải thích tính năng */}
                        <p className="text-xs sm:text-sm text-[#4A4E69]/80 font-semibold leading-relaxed bg-[#FFF6F8] p-3.5 rounded-2xl border-2 border-dashed border-[#FFC6FF]">
                            Với hệ thống Flashcards thông minh giúp ghi nhớ dễ dàng hơn và kho trắc nghiệm để ôn tập những từ vựng đã học, TunVerse sẽ giúp tụi em làm chủ từ vựng một cách hiệu quả.
                        </p>

                        {/* Dòng cuối cùng: Slogan Highlight độc quyền */}
                        <div className="inline-flex items-center gap-2 bg-[#FFF0F3] border-3 border-[#4A4E69] text-[#FF85A1] font-black text-sm sm:text-base px-5 py-2.5 rounded-2xl shadow-[3px_3px_0px_0px_#4A4E69] hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none">
                            <span>TunVerse: Chạm là nhớ, lướt là mướt!</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={() => setCurrentPage('flashcards')}
                            className="bg-[#FF85A1] text-white hover:bg-[#ff6b8e] border-3 border-[#4A4E69] font-black py-3 px-8 rounded-full shadow-[4px_4px_0px_0px_#4A4E69] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#4A4E69] active:translate-y-0.5 active:shadow-none transition-all duration-100 cursor-pointer text-sm sm:text-base"
                        >
                            Khám Phá Ngay 🚀
                        </button>
                    </div>
                </div>

                {/* Khung ảnh chân dung bên phải dạng Memo Polaroid */}
                <div className="flex-shrink-0 w-48 sm:w-64 rounded-3xl overflow-hidden border-3 border-[#4A4E69] shadow-[5px_5px_0px_0px_#BDE0FE] relative bg-white flex flex-col p-3 pb-6 transform hover:rotate-3 transition-transform duration-300 group">
                    <div className="rounded-2xl overflow-hidden border-2 border-[#4A4E69] relative">
                        <img
                            src={avatarTun}
                            alt="TunVerse"
                            className="w-full h-auto block"
                        />
                        <div className="absolute inset-0 bg-[#FFC6FF]/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                </div>
            </section>

            {/* 2. Khu vực 2 Card lớn dẫn link tính năng */}
            <section className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-[#4A4E69]">Hôm nay học gì?</h2>
                    <p className="text-gray-500 font-bold mt-1 text-sm sm:text-base">Chọn một tính năng bên dưới để bắt đầu nâng trình tiếng Anh</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-4">
                    {/* Card 1: Học Flashcard */}
                    <div
                        onClick={() => setCurrentPage('flashcards')}
                        className="bg-white p-8 rounded-3xl border-3 border-[#4A4E69] shadow-[5px_5px_0px_0px_#BDE0FE] hover:shadow-[7px_7px_0px_0px_#BDE0FE] cursor-pointer transition-all duration-200 flex flex-col justify-between group transform hover:-translate-y-1 hover:-rotate-1"
                    >
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-[#BDE0FE] border-3 border-[#4A4E69] flex items-center justify-center text-3xl mb-6 shadow-[2px_2px_0px_0px_#4A4E69] group-hover:scale-110 transition-transform duration-300">
                                🃏
                            </div>
                            <h3 className="text-xl font-black text-[#4A4E69] mb-3">Kho Từ Vựng Flashcard</h3>
                            <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                                Học từ vựng theo chủ đề lớp 10, 11, 12. Thẻ lật thông minh cung cấp đầy đủ: Phiên âm IPA, từ đồng nghĩa, trái nghĩa và ví dụ ngữ cảnh cụ thể.
                            </p>
                        </div>
                        <div className="text-[#FF85A1] font-black text-sm mt-6 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                            Luyện từ vựng ngay &rarr;
                        </div>
                    </div>

                    {/* Card 2: Làm Bài Tập */}
                    <div
                        onClick={() => setCurrentPage('exercises')}
                        className="bg-white p-8 rounded-3xl border-3 border-[#4A4E69] shadow-[5px_5px_0px_0px_#FFC6FF] hover:shadow-[7px_7px_0px_0px_#FFC6FF] cursor-pointer transition-all duration-200 flex flex-col justify-between group transform hover:-translate-y-1 hover:rotate-1"
                    >
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-[#FFC6FF] border-3 border-[#4A4E69] flex items-center justify-center text-3xl mb-6 shadow-[2px_2px_0px_0px_#4A4E69] group-hover:scale-110 transition-transform duration-300">
                                📝
                            </div>
                            <h3 className="text-xl font-black text-[#4A4E69] mb-3">Luyện Tập Trắc Nghiệm</h3>
                            <p className="text-gray-500 font-semibold text-sm leading-relaxed">
                                Hệ thống tự động trích xuất các từ đã học để tạo thành đề trắc nghiệm ngẫu nhiên. Giúp kiểm tra kiến thức lập tức, có chấm điểm và giải thích đúng sai.
                            </p>
                        </div>
                        <div className="text-[#FF85A1] font-black text-sm mt-6 flex items-center gap-2 group-hover:translate-x-2 transition-transform duration-300">
                            Thử sức làm bài &rarr;
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;