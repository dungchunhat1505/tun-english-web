import React from 'react';

function Footer() {
    return (
        <footer className="bg-white border-t border-[#FFC6FF] py-8 text-center text-[#4A4E69]">
            <div className="max-w-4xl mx-auto px-4">
                <p className="font-bold text-lg mb-2">📚 English with Anh Giáo Dũng</p>
                <p className="text-sm text-gray-500 italic mb-4">
                    "The beautiful thing about learning is that no one can take it away from you."
                </p>
                <div className="text-xs text-gray-400 border-t border-gray-100 pt-4">
                    &copy; {new Date().getFullYear()} Anh Giáo Dũng English Class
                </div>
            </div>
        </footer>
    );
}

export default Footer;