import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      Welcome to coffee-hmm!
      <Link to="/cafe/1">
        <button>link to page</button>
      </Link>
    </div>
  );
};

export default HomePage;
