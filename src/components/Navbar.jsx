import React from 'react';

function Navbar({ currentPage, setCurrentPage }) {
    const menuItems = [
        { id: 'home', name: 'Trang Chủ' },
        { id: 'flashcards', name: 'Học Flashcard' },
        { id: 'exercises', name: 'Làm Bài Tập' },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#FFC6FF] px-6 py-4 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* Logo / Thương hiệu */}
                <div className="text-2xl font-bold text-[#4A4E69] cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => setCurrentPage('home')}
                >
                    ✨ Anh Giáo <span className="text-[#FF85A1]">Dũng</span>
                </div>

                {/* Các nút Menu */}
                <div className="flex gap-2 sm:gap-6">
                    {menuItems.map((item) => (
                        <button key={item.id} onClick={() => setCurrentPage(item.id)}
                            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base
                ${currentPage === item.id
                                    ? 'bg-[#FFC6FF] text-[#4A4E69] shadow-sm font-bold'
                                    : 'text-[#6C757D] hover:bg-[#FFE5EC] hover:text-[#4A4E69]'
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