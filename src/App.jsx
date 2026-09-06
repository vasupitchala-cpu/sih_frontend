import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import CommandCenter from './pages/CommandCenter';
import RiskRadar from './pages/RiskRadar';
import Investigation from './pages/Investigation';
import AIResearch from './pages/AIResearch';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

function AppLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#E9EEF5] text-[#1E293B] font-sans selection:bg-[#1557A6] selection:text-white">
      {!isLogin && <Navbar />}
      <main key={location.pathname} className={isLogin ? 'page-transition' : 'portal-content pb-12 page-transition'}>
        <div className="route-spectrum" aria-hidden="true" />
        <div className="route-color-wash" aria-hidden="true" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/dashboard" element={<CommandCenter />} />
          <Route path="/risk-radar" element={<RiskRadar />} />
          <Route path="/investigation/allocation/:record_id" element={<Investigation />} />
          <Route path="/investigation/project/:project_id" element={<Investigation />} />
          <Route path="/investigation" element={<Navigate to="/investigation/allocation/REC-001" replace />} />
          <Route path="/ai-research" element={<AIResearch />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}
