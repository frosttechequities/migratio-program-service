import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setMessage } from './simpleStore';
import supabase, { getSession } from './utils/simpleSupabaseClient';

function SimpleHomePage() {
  const dispatch = useDispatch();
  const { theme, message } = useSelector(state => state.ui);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing session when the component mounts
    const checkSession = async () => {
      setLoading(true);
      try {
        const sessionData = await getSession();
        setSession(sessionData);
        if (sessionData) {
          dispatch(setMessage(`Logged in as: ${sessionData.user.email}`));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        if (newSession) {
          dispatch(setMessage(`Logged in as: ${newSession.user.email}`));
        } else {
          dispatch(setMessage(null));
        }
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [dispatch]);

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  const showMessage = () => {
    dispatch(setMessage('Hello from Redux and Supabase!'));
  };

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      if (error) {
        console.error('Login error:', error);
        dispatch(setMessage(`Login error: ${error.message}`));
      }
    } catch (error) {
      console.error('Login exception:', error);
      dispatch(setMessage(`Login exception: ${error.message}`));
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error);
        dispatch(setMessage(`Logout error: ${error.message}`));
      } else {
        dispatch(setMessage('Logged out successfully'));
        setSession(null);
      }
    } catch (error) {
      console.error('Logout exception:', error);
      dispatch(setMessage(`Logout exception: ${error.message}`));
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
      color: theme === 'light' ? '#333' : '#f5f5f5'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: theme === 'light' ? 'white' : '#444',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        color: theme === 'light' ? '#333' : '#f5f5f5'
      }}>
        <h1 style={{ color: '#0066FF' }}>Visafy</h1>
        <p>Simple React App with Redux and Supabase is working correctly.</p>
        {loading && <p>Loading...</p>}
        {message && <p>Message: {message}</p>}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066FF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            Toggle Theme
          </button>
          <button
            onClick={showMessage}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0066FF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Show Message
          </button>
        </div>
        <div>
          <button
            onClick={handleLogin}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            Login (Test User)
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
        {session && (
          <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#e0f7fa', borderRadius: '4px' }}>
            <p style={{ margin: 0, color: '#006064' }}>
              Logged in as: {session.user.email}
            </p>
          </div>
        )}
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
