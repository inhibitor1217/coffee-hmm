import React from 'react';

const DesktopFallback: React.FC = () => {
  return (
    <main className="desktop-fallback">
      <div>데스크탑 화면은 지원하지 않습니다.</div>
      <div>모바일 기기를 이용해주세요.</div>
    </main>
  );
};

export default DesktopFallback;
