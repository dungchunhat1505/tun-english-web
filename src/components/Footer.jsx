import React from 'react';

function Footer() {
    return (
        <footer className="max-w-4xl w-full mx-auto px-4 mt-16 mb-8 select-none">
            <div className="bg-white border-3 border-[#4A4E69] p-6 rounded-2xl shadow-[4px_4px_0px_0px_#FFC6FF] text-center space-y-3 relative overflow-hidden">
                {/* Trang trí kẹp giấy kute ở góc */}
                <div className="absolute top-2 left-6 text-xl">📌</div>
                
                <p className="font-black text-[#4A4E69] text-lg">📚 English with TunVerse</p>
                
                <p className="text-xs sm:text-sm text-gray-500 italic max-w-md mx-auto leading-relaxed">
                    "The beautiful thing about learning is that no one can take it away from you."
                </p>
                
                <div className="text-[10px] text-gray-400 border-t-2 border-dashed border-[#FFE5EC] pt-3 mt-2 font-bold">
                    Copyright &copy; {new Date().getFullYear()} TunVerse. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;