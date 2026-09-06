import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Radar, Filter, Search } from 'lucide-react';
import { api } from '../services/api';

export default function RiskRadar() {
  const [activeTab, setActiveTab] = useState('allocation');
  
  const [allocations, setAllocations] = useState([]);
  const [allocTotal, setAllocTotal] = useState(0);
  
  const [projects, setProjects] = useState([]);
  const [projTotal, setProjTotal] = useState(0);

  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('ALL');
  const [selectedProjType, setSelectedProjType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [statesList, setStatesList] = useState([]);

  useEffect(() => {
    api.getStateAnalytics().then(data => {
      setStatesList(data.map(s => s.state));
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);

    if (activeTab === 'allocation') {
      api.getAllocationRisk({
        state: selectedState,
        risk_level: selectedRiskLevel,
        search: searchQuery,
        limit: 150
      }).then(res => {
        setAllocations(res.cases);
        setAllocTotal(res.total);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching allocation risk:", err);
        setLoading(false);
      });
    } else {
      api.getProjectRisk({
        state: selectedState,
        risk_level: selectedRiskLevel,
        project_type: selectedProjType,
        search: searchQuery,
        limit: 150
      }).then(res => {
        setProjects(res.cases);
        setProjTotal(res.total);
        setLoading(false);
      }).catch(err => {
        console.error("Error fetching project risk:", err);
        setLoading(false);
      });
    }
  }, [activeTab, selectedState, selectedRiskLevel, selectedProjType, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <Radar className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono">MPLADS AI RISK RADAR</h1>
          </div>
          <p className="text-xs text-slate-600 font-sans mt-1">
            Multidimensional risk prioritization engine for real allocation outliers and demonstration project execution anomalies.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 md:mt-0 flex bg-slate-200 p-1 rounded-lg border border-slate-300">
          <button
            onClick={() => setActiveTab('allocation')}
            className={`px-4 py-2 rounded-md text-xs font-mono font-bold transition ${
              activeTab === 'allocation'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            REAL ALLOCATION RISK ({allocTotal})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-md text-xs font-mono font-bold transition ${
              activeTab === 'projects'
                ? 'bg-white text-amber-700 shadow-xs border border-slate-200'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            DEMO PROJECT RISK ({projTotal})
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="mission-card space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-700">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="font-bold">INTELLIGENCE FILTERS</span>
          </div>
          <div>
            Showing <span className="text-slate-900 font-bold">{activeTab === 'allocation' ? allocations.length : projects.length}</span> records
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search MP, Constituency, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
            >
              <option value="ALL">All States / UTs ({statesList.length})</option>
              {statesList.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              value={selectedRiskLevel}
              onChange={(e) => setSelectedRiskLevel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
            >
              <option value="ALL">All Risk Levels</option>
              {activeTab === 'allocation' ? (
                <>
                  <option value="HIGH PRIORITY REVIEW">HIGH PRIORITY REVIEW</option>
                  <option value="REVIEW RECOMMENDED">REVIEW RECOMMENDED</option>
                  <option value="NORMAL PATTERN">NORMAL PATTERN</option>
                </>
              ) : (
                <>
                  <option value="HIGH PRIORITY REVIEW">HIGH PRIORITY REVIEW (Score 61-100)</option>
                  <option value="MEDIUM RISK">MEDIUM RISK (Score 31-60)</option>
                  <option value="LOW RISK">LOW RISK (Score 0-30)</option>
                </>
              )}
            </select>
          </div>

          {/* Project Type Filter (For Tab 2) */}
          {activeTab === 'projects' ? (
            <div>
              <select
                value={selectedProjType}
                onChange={(e) => setSelectedProjType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option value="ALL">All Project Categories</option>
                <option value="Road Infrastructure">Road Infrastructure</option>
                <option value="Drinking Water">Drinking Water</option>
                <option value="Drainage">Drainage</option>
                <option value="Community Infrastructure">Community Infrastructure</option>
                <option value="School Infrastructure">School Infrastructure</option>
                <option value="Healthcare Infrastructure">Healthcare Infrastructure</option>
                <option value="Public Sanitation">Public Sanitation</option>
                <option value="Solar/Electrical Infrastructure">Solar/Electrical Infrastructure</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center text-slate-500 text-[11px] font-mono">
              <span>Active Layer: Real Excel Dataset</span>
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="mission-card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            FETCHING INTELLIGENCE RADAR DATA...
          </div>
        ) : activeTab === 'allocation' ? (
          /* TAB 1: REAL ALLOCATION RISK TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Hon'ble MP</th>
                  <th className="p-3">Constituency</th>
                  <th className="p-3">Allocated Amount</th>
                  <th className="p-3">State Dev %</th>
                  <th className="p-3">AI Score</th>
                  <th className="p-3">Risk Prioritisation</th>
                  <th className="p-3">Data Source</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {allocations.map((row) => (
                  <tr key={row.record_id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-500">#{row.rank}</td>
                    <td className="p-3 text-slate-700">{row.state}</td>
                    <td className="p-3 text-slate-900 font-bold">{row.mp_name}</td>
                    <td className="p-3 text-slate-700">{row.constituency}</td>
                    <td className="p-3 text-emerald-700 font-bold">₹{(row.allocated_amount / 1e7).toFixed(2)} Cr</td>
                    <td className="p-3">
                      <span className={row.pct_dev_from_state_median > 25 ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                        {row.pct_dev_from_state_median > 0 ? `+${row.pct_dev_from_state_median.toFixed(1)}%` : `${row.pct_dev_from_state_median.toFixed(1)}%`}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-700">{row.ai_anomaly_score}/100</td>
                    <td className="p-3">
                      <span className={
                        row.risk_level === 'HIGH PRIORITY REVIEW' ? 'badge-high-risk' :
                        row.risk_level === 'REVIEW RECOMMENDED' ? 'badge-medium-risk' : 'badge-low-risk'
                      }>
                        {row.risk_level}
                      </span>
                    </td>
                    <td className="p-3"><span className="badge-real">REAL</span></td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/investigation/allocation/${row.record_id}`}
                        className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition text-[11px] font-semibold"
                      >
                        Investigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* TAB 2: DEMONSTRATION PROJECT RISK TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Project ID</th>
                  <th className="p-3">Project Type</th>
                  <th className="p-3">State / Constituency</th>
                  <th className="p-3">Spent / Sanctioned</th>
                  <th className="p-3">Exp %</th>
                  <th className="p-3">Physical Work</th>
                  <th className="p-3">Delay</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3">Risk Tier</th>
                  <th className="p-3">Data Source</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {projects.map((proj) => (
                  <tr key={proj.project_id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-amber-700">{proj.project_id}</td>
                    <td className="p-3 text-slate-900 font-semibold">{proj.project_type}</td>
                    <td className="p-3 text-slate-700">
                      <div>{proj.constituency}</div>
                      <div className="text-[10px] text-slate-500">{proj.state}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-emerald-700 font-bold">₹{(proj.spent_amount / 1e5).toFixed(1)} L</div>
                      <div className="text-[10px] text-slate-500">of ₹{(proj.sanctioned_amount / 1e5).toFixed(1)} L</div>
                    </td>
                    <td className="p-3">
                      <span className={proj.expenditure_percentage > 100 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                        {proj.expenditure_percentage}%
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full" style={{ width: `${Math.min(100, proj.physical_progress)}%` }}></div>
                        </div>
                        <span className="text-slate-700">{proj.physical_progress}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {proj.delay_days > 0 ? (
                        <span className="text-rose-600 font-bold">+{proj.delay_days} d</span>
                      ) : (
                        <span className="text-slate-500">On Time</span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-rose-600">{proj.risk_score}/100</td>
                    <td className="p-3">
                      <span className={
                        proj.risk_level === 'HIGH PRIORITY REVIEW' ? 'badge-high-risk' :
                        proj.risk_level === 'MEDIUM RISK' ? 'badge-medium-risk' : 'badge-low-risk'
                      }>
                        {proj.risk_level}
                      </span>
                    </td>
                    <td className="p-3"><span className="badge-synthetic">SYNTHETIC DEMO</span></td>
                    <td className="p-3 text-right">
                      <Link
                        to={`/investigation/project/${proj.project_id}`}
                        className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-200 transition text-[11px] font-semibold"
                      >
                        Investigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
