import React from 'react';
import { useLocation } from 'react-router';
import Header from './common/Header';
import Router from './Router';

const PageTemplate: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <Header location={location} />
      <main>
        <Router location={location} />
      </main>
    </div>
  );
};

export default PageTemplate;
