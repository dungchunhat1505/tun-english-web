import React from 'react';

function Navbar({ currentPage, setCurrentPage }) {
    const menuItems = [
        { id: 'home', name: 'Trang Chủ' },
        { id: 'flashcards', name: 'Học Flashcard' },
        { id: 'exercises', name: 'Làm Bài Tập' },
    ];

    return (
        <nav className="bg-white sticky top-0 z-50 border-b-4 border-[#4A4E69] px-6 py-4 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center flex-wrap gap-4">
                {/* Logo dạng Sticker viết tay siêu kute */}
                <div
                    className="text-xl sm:text-2xl font-black text-[#4A4E69] cursor-pointer bg-[#FFF0F3] border-3 border-[#4A4E69] rounded-2xl px-4 py-1.5 shadow-[3px_3px_0px_0px_#FF85A1] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#FF85A1] active:translate-y-0.5 active:shadow-none transition-all duration-100 select-none"
                    onClick={() => setCurrentPage('home')}
                >
                    <span className="text-[#FF85A1] tracking-tight">TunVerse</span>
                </div>

                {/* Các nút Menu dạng thẻ lún cơ học */}
                <div className="flex gap-2 sm:gap-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-3 transition-all duration-100 cursor-pointer select-none
                                ${currentPage === item.id
                                    ? 'bg-[#FFC6FF] border-[#4A4E69] text-[#4A4E69] shadow-[3px_3px_0px_0px_#FF85A1] -translate-y-0.5'
                                    : 'bg-white border-[#4A4E69] text-[#4A4E69] hover:bg-[#FFF0F3] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#FFC6FF] active:translate-y-0.5 active:shadow-none'
                                }`}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;