import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, Radar, Search, Cpu, BarChart3, FileText, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.getOverview().then(setOverview).catch(console.error);
  }, []);

  return (
    <aside className="portal-sidebar">
      <div className="sidebar-brand">
            <div className="w-10 h-10 rounded-lg bg-[#102a43] flex items-center justify-center text-[#f0bf52] shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-slate-900 font-mono">FRAUD & ANOMALY PORTAL</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#fdf3d8] text-[#865d08] border border-[#e8c66a]">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">PUBLIC PROJECT MONITORING & INVESTIGATION SYSTEM</p>
            </div>
      </div>

      <nav className="sidebar-nav">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                  `sidebar-link ${
                  isActive ? 'active' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/risk-radar"
              className={({ isActive }) =>
                  `sidebar-link ${
                  isActive ? 'active' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Radar className="w-4 h-4" />
              <span>Risk Radar</span>
            </NavLink>

            <NavLink
              to="/investigation/allocation/REC-001"
              className={({ isActive }) =>
                  `sidebar-link ${
                  isActive ? 'active' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Search className="w-4 h-4" />
              <span>Investigation</span>
            </NavLink>

            <NavLink
              to="/ai-research"
              className={({ isActive }) =>
                  `sidebar-link ${
                  isActive ? 'active' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Cpu className="w-4 h-4" />
              <span>AI Analysis</span>
            </NavLink>

            <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </NavLink>

            <NavLink to="/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </NavLink>
      </nav>

      <div className="sidebar-status">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>GEMINI AI LIVE</span>
            </div>

            {overview && (
              <div className="hidden lg:flex items-center space-x-2 text-slate-500 font-medium">
                <span>ANALYZED:</span>
                <span className="text-slate-900 font-bold">{overview.real_data_metrics.total_records} MPs</span>
                <span>/</span>
                <span className="text-amber-700 font-bold">{overview.demo_project_metrics.total_synthetic_projects} PROJECTS</span>
              </div>
            )}
      </div>
    </aside>
  );
}
