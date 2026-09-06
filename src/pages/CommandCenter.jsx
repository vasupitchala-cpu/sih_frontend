import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Users, MapPin, IndianRupee, AlertTriangle, ShieldCheck, 
  TrendingUp, BarChart3, ChevronRight, ArrowUpRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { api } from '../services/api';

export default function CommandCenter() {
  const [overview, setOverview] = useState(null);
  const [statesData, setStatesData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [topDeviations, setTopDeviations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getOverview(),
      api.getStateAnalytics(),
      api.getDistributionAnalytics(),
      api.getTopDeviations(7)
    ]).then(([ov, st, dist, dev]) => {
      setOverview(ov);
      setStatesData(st.slice(0, 10));
      setDistributionData(dist);
      setTopDeviations(dev);
      setLoading(false);
    }).catch(err => {
      console.error("CommandCenter fetch error:", err);
      setLoading(false);
    });
  }, []);

  if (loading || !overview) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>LOADING COMMAND CENTER INTELLIGENCE...</span>
        </div>
      </div>
    );
  }

  const { real_data_metrics: rm, real_data_risk: rr, demo_project_metrics: dm } = overview;

  const projectRiskData = [
    { name: 'Low Risk', count: dm.low_risk_count, color: '#059669' },
    { name: 'Medium Risk', count: dm.medium_risk_count, color: '#D97706' },
    { name: 'High Priority Review', count: dm.high_priority_review_count, color: '#DC2626' }
  ];

  const projectAnomalyData = [
    { category: 'Cost Overrun', count: dm.cost_anomalies_count },
    { category: 'Progress Mismatch', count: dm.progress_mismatches_count },
    { category: 'Schedule Delay', count: dm.delayed_projects_count },
    { category: 'Duplicate Work', count: dm.duplicate_patterns_count }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono">MPLADS AI INTELLIGENCE COMMAND CENTER</h1>
            <span className="badge-real">LIVE PIPELINE DATA</span>
          </div>
          <p className="text-sm text-slate-600 font-sans mt-1">
            AI-powered allocation analysis, statistical risk prioritisation, and project monitoring intelligence platform.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Link 
            to="/risk-radar" 
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold transition flex items-center space-x-2 shadow-xs"
          >
            <span>LAUNCH RISK RADAR</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: REAL MPLADS ALLOCATION INTELLIGENCE */}
      {/* ========================================================================= */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-l-4 border-emerald-600 pl-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black font-mono tracking-wide text-slate-900">SECTION A: REAL MPLADS ALLOCATION INTELLIGENCE</h2>
              <span className="badge-real">PRIMARY SOURCE OF TRUTH</span>
            </div>
            <p className="text-xs text-slate-500">Statistical anomalies and AI isolation forest findings from primary Excel release dataset</p>
          </div>
        </div>

        {/* Real Allocation Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="mission-card border-l-4 border-emerald-600">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>TOTAL ALLOCATION</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-black font-mono text-slate-900">
              ₹{(rm.total_allocation / 1e7).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Median: ₹{(rm.median_allocation / 1e7).toFixed(1)} Cr / MP</div>
          </div>

          <div className="mission-card">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>RECORDS ANALYSED</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-slate-900">{rm.total_records}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Hon'ble MPs Monitored</div>
          </div>

          <div className="mission-card">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>STATES / UTS</span>
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-slate-900">{rm.states_count}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Administrative Regions</div>
          </div>

          <div className="mission-card border-l-4 border-amber-500">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>REVIEW RECOMMENDED</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-amber-700">{rr.review_recommended_count}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Statistical Deviations</div>
          </div>

          <div className="mission-card border-l-4 border-rose-600">
            <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
              <span>HIGH PRIORITY REVIEWS</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-rose-700">{rr.high_priority_review_count}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Top AI Anomaly Cases</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* State Wise Allocation Chart */}
          <div className="mission-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-mono font-bold text-slate-800 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>STATE-WISE TOTAL ALLOCATION (TOP 10)</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">₹ in Crores</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statesData.map(s => ({ ...s, valCr: Number((s.total_allocation / 1e7).toFixed(1)) }))}>
                  <XAxis dataKey="state" stroke="#64748B" fontSize={10} tickLine={false} interval={0} angle={-25} textAnchor="end" />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '6px', fontSize: '12px', color: '#0F172A' }} 
                    formatter={(val) => [`₹${val} Cr`, 'Total Allocation']}
                  />
                  <Bar dataKey="valCr" fill="#1557A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Allocation Distribution Histogram */}
          <div className="mission-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-mono font-bold text-slate-800 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>NATIONAL ALLOCATION DISTRIBUTION</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">MP Count / Range</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} layout="vertical">
                  <XAxis type="number" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis dataKey="range" type="category" stroke="#64748B" fontSize={9} width={150} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '6px', fontSize: '12px', color: '#0F172A' }} 
                  />
                  <Bar dataKey="count" fill="#059669" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Real Allocation Deviations Table */}
        <div className="mission-card space-y-3 p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="text-sm font-mono font-bold text-slate-900">TOP REAL ALLOCATION DEVIATION CASES</h3>
            <Link to="/risk-radar" className="text-xs text-blue-600 hover:underline font-mono flex items-center space-x-1 font-semibold">
              <span>View All 542 Cases</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Record ID</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Hon'ble MP</th>
                  <th className="p-3">Constituency</th>
                  <th className="p-3">Allocated Amount</th>
                  <th className="p-3">State Dev %</th>
                  <th className="p-3">AI Score</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {topDeviations.map((row) => (
                  <tr key={row.record_id} className="hover:bg-slate-50 transition">
                    <td className="p-3 text-blue-600 font-bold">{row.record_id}</td>
                    <td className="p-3 text-slate-700">{row.state}</td>
                    <td className="p-3 text-slate-900 font-bold">{row.mp_name}</td>
                    <td className="p-3 text-slate-700">{row.constituency}</td>
                    <td className="p-3 font-mono text-emerald-700 font-bold">₹{(row.allocated_amount / 1e7).toFixed(2)} Cr</td>
                    <td className="p-3 text-slate-700 font-medium">
                      {row.pct_dev_from_state_median > 0 ? `+${row.pct_dev_from_state_median.toFixed(1)}%` : `${row.pct_dev_from_state_median.toFixed(1)}%`}
                    </td>
                    <td className="p-3 text-amber-700 font-bold">{row.ai_anomaly_score}/100</td>
                    <td className="p-3">
                      <span className={
                        row.risk_level === 'HIGH PRIORITY REVIEW' ? 'badge-high-risk' :
                        row.risk_level === 'REVIEW RECOMMENDED' ? 'badge-medium-risk' : 'badge-low-risk'
                      }>
                        {row.risk_level}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link 
                        to={`/investigation/allocation/${row.record_id}`}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white border border-slate-300 transition"
                      >
                        Investigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* SECTION B: DEMONSTRATION PROJECT MONITORING */}
      {/* ========================================================================= */}
      <section className="space-y-5 pt-4 border-t border-slate-200">
        
        <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black font-mono tracking-wide text-slate-900">SECTION B: DEMONSTRATION PROJECT MONITORING</h2>
              <span className="badge-synthetic">SYNTHETIC DEMO LAYER</span>
            </div>
            <p className="text-xs text-slate-500">Multi-vector anomaly detection across project expenditure, physical work progress, and schedules</p>
          </div>
        </div>

        {/* Mandatory Transparency Banner */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-mono flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <div>
            <span className="font-bold">PROTOTYPE SIMULATION NOTICE:</span> Prototype simulation generated from real allocation records to demonstrate project-level monitoring capabilities. Real allocation figures serve as budget anchors.
          </div>
        </div>

        {/* Demo Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="mission-card">
            <div className="text-slate-500 text-xs font-mono">PROJECTS ANALYSED</div>
            <div className="mt-2 text-2xl font-black font-mono text-slate-900">{dm.total_synthetic_projects}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Demo Execution Pool</div>
          </div>

          <div className="mission-card border-l-4 border-rose-600">
            <div className="text-slate-500 text-xs font-mono">HIGH PRIORITY CASES</div>
            <div className="mt-2 text-2xl font-black font-mono text-rose-600">{dm.high_priority_review_count}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Risk Score ≥ 61</div>
          </div>

          <div className="mission-card border-l-4 border-amber-500">
            <div className="text-slate-500 text-xs font-mono">COST OVERRUNS</div>
            <div className="mt-2 text-2xl font-black font-mono text-amber-700">{dm.cost_anomalies_count}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Spent &gt; Sanctioned</div>
          </div>

          <div className="mission-card border-l-4 border-amber-500">
            <div className="text-slate-500 text-xs font-mono">PROGRESS MISMATCHES</div>
            <div className="mt-2 text-2xl font-black font-mono text-amber-700">{dm.progress_mismatches_count}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">High Spend / Low Work</div>
          </div>

          <div className="mission-card border-l-4 border-blue-600">
            <div className="text-slate-500 text-xs font-mono">SCHEDULE DELAYS</div>
            <div className="mt-2 text-2xl font-black font-mono text-blue-600">{dm.delayed_projects_count}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">Delay &gt; 90 Days</div>
          </div>

          <div className="mission-card border-l-4 border-purple-600">
            <div className="text-slate-500 text-xs font-mono">DUPLICATE PATTERNS</div>
            <div className="mt-2 text-2xl font-black font-mono text-purple-700">{dm.duplicate_patterns_count}</div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">TF-IDF Similarity &gt; 0.82</div>
          </div>
        </div>

        {/* Demo Project Breakdown Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="mission-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-mono font-bold text-slate-800">DEMO PROJECT RISK TIER DISTRIBUTION</h3>
              <span className="text-xs text-slate-500 font-mono">2,692 Total Projects</span>
            </div>

            <div className="h-60 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectRiskData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '12px' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {projectRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mission-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-mono font-bold text-slate-800">ANOMALY CATEGORY BREAKDOWN</h3>
              <span className="text-xs text-slate-500 font-mono">Injected Anomalies</span>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectAnomalyData} layout="vertical">
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis dataKey="category" type="category" stroke="#64748B" fontSize={10} width={130} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#D97706" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
