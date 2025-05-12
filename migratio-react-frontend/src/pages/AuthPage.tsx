import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, storeToken } from '../services/authService';

const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLoginMode) {
        const data = await authService.login(email, password);
        storeToken(data.access_token);
        // TODO: Update global auth state if using Context/Redux
        navigate('/profile'); // Redirect to profile page after login
      } else {
        // Supabase signup might require email confirmation.
        // The API returns user details or a confirmation message.
        const result = await authService.signup(email, password);
        // Check if 'detail' is in result, which indicates a message (like email confirmation)
        if (result && typeof result === 'object' && 'detail' in result) {
            alert(result.detail); // Show confirmation message
            setIsLoginMode(true); // Switch to login mode
        } else {
            // If signup immediately returns user data (e.g., email confirmation disabled)
            // For simplicity, we'll just prompt to login after signup.
            alert('Signup successful! Please log in.');
            setIsLoginMode(true); // Switch to login mode
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
        </button>
      </form>
      <button onClick={() => setIsLoginMode(!isLoginMode)} disabled={isLoading} style={{ marginTop: '1rem' }}>
        Switch to {isLoginMode ? 'Sign Up' : 'Login'}
      </button>
    </div>
  );
};

export default AuthPage;
