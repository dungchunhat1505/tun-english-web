import React, { useState, useEffect } from 'react';

// Component tự động dịch câu ví dụ sang tiếng Việt bằng Google Translate API miễn phí
const ExampleTranslation = ({ text }) => {
    const [translation, setTranslation] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!text) return;
        setLoading(true);
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`)
            .then(res => res.json())
            .then(data => {
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    setTranslation(data[0][0][0]);
                } else {
                    setTranslation('Không thể tự động dịch câu này.');
                }
                setLoading(false);
            })
            .catch(() => {
                setTranslation('Lỗi kết nối khi dịch.');
                setLoading(false);
            });
    }, [text]);

    if (loading) {
        return (
            <p className="text-xs text-gray-400 italic mt-1.5 animate-pulse">
                ⏳ Đang dịch nghĩa câu ví dụ...
            </p>
        );
    }

    return (
        <p className="text-xs text-[#FF85A1] font-bold italic mt-1.5 bg-[#FFF6F8] p-2.5 rounded-xl border-2 border-dashed border-[#FFC6FF]/60">
            Dịch nghĩa: "{translation}"
        </p>
    );
};

export default ExampleTranslation;
