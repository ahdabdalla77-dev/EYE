import { useState, useEffect } from 'react';
import { db } from './db/localDb';
import { UserProfile } from './types';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { TaskBoard } from './components/TaskBoard';
import { Announcements } from './components/Announcements';
import { MemberProfile } from './components/MemberProfile';
import { SettingsPanel } from './components/SettingsPanel';
import { ReportGenerator } from './components/ReportGenerator';
import { useTheme } from './lib/ThemeContext';

export default function App() {
  const { theme } = useTheme();
  // Navigation Route State
  const [currentView, setCurrentView] = useState<string>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Mobile Sidebar Toggler
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Targeted Task Focus from notification clicks
  const [notifTargetTaskId, setNotifTargetTaskId] = useState<string | undefined>(undefined);

  // Authenticate user persistence on load
  useEffect(() => {
    const saved = db.getCurrentUser();
    if (saved) {
      setCurrentUser(saved);
      setCurrentView('dashboard');
    }
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    setCurrentView('login');
  };

  const handleNavigateToView = (view: string, targetId?: string) => {
    setCurrentView(view);
    if (targetId) {
      setNotifTargetTaskId(targetId);
    } else {
      setNotifTargetTaskId(undefined);
    }
  };

  // --- RENDERING ROUTER ENGINE ---
  const renderWorkspaceView = () => {
    if (!currentUser) return <LandingPage onNavigate={(view) => setCurrentView(view)} />;

    switch (currentView) {
      case 'dashboard':
        return <DashboardStats currentUser={currentUser} onNavigateToView={handleNavigateToView} />;
      case 'tasks':
        return <TaskBoard currentUser={currentUser} selectedTaskIdFromNotification={notifTargetTaskId} />;
      case 'announcements':
        return <Announcements currentUser={currentUser} />;
      case 'reports':
        return <ReportGenerator currentUser={currentUser} />;
      case 'profile':
        return <MemberProfile currentUser={currentUser} />;
      case 'settings':
        return <SettingsPanel currentUser={currentUser} />;
      default:
        return <DashboardStats currentUser={currentUser} onNavigateToView={handleNavigateToView} />;
    }
  };

  // 1. PUBLIC VIEWS (Auth screens)
  if (!currentUser || currentView === 'landing' || currentView === 'login' || currentView === 'register') {
    const activeMode = currentView === 'register' ? 'register' : 'login';
    return (
      <Auth
        initialMode={activeMode}
        onAuthSuccess={handleAuthSuccess}
        onNavigateHome={() => setCurrentView('login')}
      />
    );
  }

  // 2. PROTECTED ENTERPRISE WORKSPACE LAYOUT
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-250" id="eye-workspace-root">
      
      {/* Sidebar Navigation */}
      <Sidebar
        currentUser={currentUser}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setNotifTargetTaskId(undefined); // Clear prior notification linkages
        }}
        onLogout={handleLogout}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* Main Workspace Body */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigateToView={handleNavigateToView}
        />

        {/* Dynamic Inner View viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/60 relative">
          {renderWorkspaceView()}
        </main>
      </div>
    </div>
  );
}
