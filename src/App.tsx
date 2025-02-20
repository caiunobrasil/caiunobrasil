import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ServicePage } from './pages/ServicePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fora-do-ar/:slug.html" element={<ServicePage />} />
    </Routes>
  );
}

export default App