import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastProvider } from './contexts/ToastContext';

import { checkAuth } from './features/auth/authSlice';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import AssessmentPage from './pages/assessment/AssessmentPage';
import ResultsPage from './pages/assessment/ResultsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import RoadmapPage from './pages/roadmap/RoadmapPage';
import CreateRoadmapPage from './pages/roadmap/CreateRoadmapPage';
import RoadmapDetailPage from './pages/roadmap/RoadmapDetailPage';
import CalendarPage from './pages/calendar/CalendarPage';
import GeneratePDFPage from './pages/pdf/GeneratePDFPage';
import ResearchHubPage from './pages/immigration/ResearchHubPage';
import ImmigrationProgramsPage from './pages/immigration/ImmigrationProgramsPage';
import CountryProfilesPage from './pages/immigration/CountryProfilesPage';
import PointsCalculatorPage from './pages/immigration/PointsCalculatorPage';
import ProcessingTimesPage from './pages/immigration/ProcessingTimesPage';
import ProgramDetailPage from './pages/immigration/ProgramDetailPage';
import ResourcesPage from './pages/resources/ResourcesPage'; // Import ResourcesPage
import LegalPage from './pages/legal/LegalPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Check if user is authenticated on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
      }}>
        <img
          src="/logo.png"
          alt="Visafy Logo"
          style={{
            width: '80px',
            height: '80px',
            animation: 'pulse 1.5s infinite ease-in-out'
          }}
        />
        <style jsx="true">{`
          @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.7; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Routes>
        {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="features" element={<FeaturesPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route path="register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />
        <Route path="verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="assessment" element={
          <ProtectedRoute>
            <AssessmentPage />
          </ProtectedRoute>
        } />
        <Route path="assessment/results" element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        } />
        <Route path="documents" element={
          <ProtectedRoute>
            <DocumentsPage />
          </ProtectedRoute>
        } />
        <Route path="roadmap" element={
          <ProtectedRoute>
            <RoadmapPage />
          </ProtectedRoute>
        } />
        <Route path="roadmap/create" element={
          <ProtectedRoute>
            <CreateRoadmapPage />
          </ProtectedRoute>
        } />
        <Route path="roadmaps/:roadmapId" element={
          <ProtectedRoute>
            <RoadmapDetailPage />
          </ProtectedRoute>
        } />
        <Route path="calendar" element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        } />
        <Route path="pdf/generate" element={
          <ProtectedRoute>
            <GeneratePDFPage />
          </ProtectedRoute>
        } />

        {/* Immigration Research routes */}
        <Route path="research" element={<ResearchHubPage />} />
        <Route path="resources" element={<ResourcesPage />} /> {/* Add Resources Page Route */}
        <Route path="immigration/programs" element={<ImmigrationProgramsPage />} />
        <Route path="immigration/countries" element={<CountryProfilesPage />} />
        <Route path="immigration/points-calculator" element={<PointsCalculatorPage />} />
        <Route path="immigration/processing-times" element={<ProcessingTimesPage />} />
        <Route path="programs/:programId" element={<ProgramDetailPage />} />

        {/* Legal routes */}
        <Route path="legal/:pageType" element={<LegalPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;
