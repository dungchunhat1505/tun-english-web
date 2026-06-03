import Exercises from './pages/Exercises';
import Flashcards from './pages/Flashcards';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  // State quản lý việc chuyển trang: 'home', 'flashcards', hoặc 'exercises'
  const [currentPage, setCurrentPage] = useState('home');

  // Hàm render nội dung dựa trên trang hiện tại
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'flashcards':
        return <Flashcards />;
      case 'exercises':
        return <Exercises />;
        return (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#FFC6FF]">
            <h2 className="text-2xl font-bold text-[#4A4E69]">📝 Trang Làm Bài Tập đang được xây dựng...</h2>
            <p className="text-gray-500 mt-2">Hẹn gặp các bạn ở Giai đoạn 4 nhé!</p>
          </div>
        );
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3] text-[#4A4E69] flex flex-col font-sans selection:bg-[#FFC6FF]">
      {/* Thanh Menu trên cùng */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Nội dung thay đổi động của từng trang */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 pt-8 pb-16">
        {renderPage()}
      </main>

      {/* Chân trang dưới cùng */}
      <Footer />
    </div>
  );
}

export default App;