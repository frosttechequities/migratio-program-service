import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, getToken } from '../services/authService';

interface UserProfile {
  id: string;
  email: string;
  created_at: string | null;
  // Add other fields if your /auth/me endpoint returns more
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();
      if (!token) {
        setError('No authentication token found. Please login.');
        setIsLoading(false);
        // Optional: redirect to login after a delay or with a button
        // navigate('/auth'); 
        return;
      }

      try {
        const profileData = await authService.fetchCurrentUser(token);
        setUserProfile(profileData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while fetching profile.');
        }
        // If token is invalid (e.g. expired), clear it and redirect
        // authService.removeToken(); // Consider if this is the right place
        // navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={() => navigate('/auth')}>Go to Login</button>
      </div>
    );
  }

  if (!userProfile) {
    // This case might be redundant if error handles no token/profile
    return <p>No profile data found. Please try logging in again.</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>ID:</strong> {userProfile.id}</p>
      <p><strong>Email:</strong> {userProfile.email}</p>
      <p><strong>Member Since:</strong> {userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}</p>
      {/* Display other user details here */}
    </div>
  );
};

export default ProfilePage;
