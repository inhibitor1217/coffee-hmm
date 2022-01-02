import React from "react";

import "./index.css";

const InitialLoading: React.FC = () => {
  return (
    <div className="initial-load-container">
      <div className="initial-load-row1">Your Own Café Guide</div>
      <div className="initial-load-row2">Coffee Hmm</div>
      <img src="/images/coffee.jpg" alt="coffee" />
    </div>
  );
};

export default InitialLoading;
