import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmailSecurity from './components/EmailSecurity';
import FraudDetection from './components/FraudDetection';
import NetworkSecurity from './components/NetworkSecurity';
import MediaVerification from './components/MediaVerification';
import InnovationHub from './components/InnovationHub';
import Settings from './components/Settings';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/email-security" element={<EmailSecurity />} />
        <Route path="/fraud-detection" element={<FraudDetection />} />
        <Route path="/network-security" element={<NetworkSecurity />} />
        <Route path="/media-verification" element={<MediaVerification />} />
        <Route path="/innovation" element={<InnovationHub />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;