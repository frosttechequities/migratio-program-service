import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import './App.css'; // We can keep this for now for global styles

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* We can add a 404 Not Found route later if needed */}
        </Routes>
      </main>
    </>
  );
};

export default App;
