import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import AssessmentPage from './pages/AssessmentPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import SdlcComparisonPage from './pages/SdlcComparisonPage';
import DocumentationPage from './pages/DocumentationPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('netrisk_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [currentTab, setCurrentTab] = useState(() => {
    try {
      const saved = localStorage.getItem('netrisk_user');
      return saved ? 'dashboard' : 'login';
    } catch {
      return 'login';
    }
  });
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('netrisk_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setCurrentTab('dashboard');
    showToast(`Session established: ${user.name} (${user.role})`, 'success');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('netrisk_user');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setCurrentUser(null);
    setCurrentTab('login');
    showToast('Session terminated. Please authenticate to continue.', 'info');
  };

  // If unauthenticated or tab is explicitly 'login', render dedicated Login Portal
  if (!currentUser || currentTab === 'login') {
    return (
      <div className="min-h-screen bg-cyber-bg text-cyber-textPrimary font-sans">
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          currentUser={currentUser}
          onBackToDashboard={currentUser ? () => setCurrentTab('dashboard') : null}
        />
        {toast && (
          <div 
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom duration-200 ${
              toast.type === 'success' 
                ? 'bg-cyber-elevated border-emerald-500/50 text-emerald-300' 
                : toast.type === 'error'
                ? 'bg-cyber-elevated border-rose-500/50 text-rose-300'
                : 'bg-cyber-elevated border-cyber-cyan/50 text-cyber-cyan'
            }`}
          >
            <span>{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="text-cyber-textMuted hover:text-white ml-2 text-sm"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-textPrimary font-sans flex overflow-x-hidden">
      {/* Sidebar Navigation */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} md:block z-40`}>
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setMobileOpen(false);
          }}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage 
              setCurrentTab={setCurrentTab} 
              setSelectedAssessmentId={setSelectedAssessmentId} 
              currentUser={currentUser}
            />
          )}

          {currentTab === 'assessment' && (
            <AssessmentPage 
              setCurrentTab={setCurrentTab} 
              setSelectedAssessmentId={setSelectedAssessmentId}
              showToast={showToast}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'results' && (
            <ResultsPage 
              selectedAssessmentId={selectedAssessmentId}
              setCurrentTab={setCurrentTab}
              setSelectedAssessmentId={setSelectedAssessmentId}
              showToast={showToast}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'history' && (
            <HistoryPage 
              setCurrentTab={setCurrentTab} 
              setSelectedAssessmentId={setSelectedAssessmentId}
              showToast={showToast}
              currentUser={currentUser}
            />
          )}

          {currentTab === 'sdlc-comparison' && (
            <SdlcComparisonPage />
          )}

          {currentTab === 'documentation' && (
            <DocumentationPage />
          )}

          {currentTab === 'landing' && (
            <LandingPage setCurrentTab={setCurrentTab} />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-cyber-border py-4 px-6 md:px-8 text-xs text-cyber-textMuted flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/20">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">NETRISK</span>
            <span>&bull;</span>
            <span>Intelligent Risk-Aware SDLC Decision Platform for AI-Based Cybersecurity Systems</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400 font-mono font-bold">🎯 UN SDG 9</span>
            <span>Industry, Innovation and Infrastructure</span>
          </div>
        </footer>
      </div>

      {/* Global Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom duration-200 ${
            toast.type === 'success' 
              ? 'bg-cyber-elevated border-emerald-500/50 text-emerald-300' 
              : toast.type === 'error'
              ? 'bg-cyber-elevated border-rose-500/50 text-rose-300'
              : 'bg-cyber-elevated border-cyber-cyan/50 text-cyber-cyan'
          }`}
        >
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="text-cyber-textMuted hover:text-white ml-2 text-sm"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
