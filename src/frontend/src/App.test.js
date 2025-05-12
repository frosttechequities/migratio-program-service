import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
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
        <h1 style={{ color: '#0066FF' }}>Visafy Test App</h1>
        <p>If you can see this, React is working correctly.</p>
        <p>The main application might have issues with complex components.</p>
      </div>
    </div>
  );
}

export default App;
