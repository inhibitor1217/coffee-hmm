import React from "react";
import MaterialIcon from "./common/MaterialIcon";

const DesktopFallback = () => {
  return (
    <main className="desktop-fallback">
      <MaterialIcon icon="error_outline" size={64} />
      <span>데스크탑 화면은 지원하지 않습니다.</span>
      <span>모바일 기기를 이용해주세요 :(</span>
    </main>
  );
};

export default DesktopFallback;
