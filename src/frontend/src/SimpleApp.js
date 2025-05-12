import React from 'react';
import { Routes, Route } from 'react-router-dom';

function SimpleHomePage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#0066FF' }}>Visafy</h1>
        <p>Simple React App is working correctly.</p>
      </div>
    </div>
  );
}

function SimpleApp() {
  return (
    <Routes>
      <Route path="/" element={<SimpleHomePage />} />
      <Route path="*" element={<SimpleHomePage />} />
    </Routes>
  );
}

export default SimpleApp;
