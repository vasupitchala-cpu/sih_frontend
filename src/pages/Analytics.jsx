import React, { useEffect, useState } from 'react';
import { BarChart3, MapPin, Building2, IndianRupee, TrendingUp } from 'lucide-react';
import { BarChart, Bar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../services/api';

const COLORS = ['#1557A6', '#0D9488', '#D97706', '#DC2626', '#7C3AED', '#0891B2'];

export default function Analytics() {
  const [states, setStates] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOverview(), api.getStateAnalytics(), api.getDistributionAnalytics()])
      .then(([summary, stateData, distributionData]) => {
        setOverview(summary);
        setStates(stateData.slice(0, 8).map((item) => ({ ...item, allocationCr: Number((item.total_allocation / 1e7).toFixed(1)) })));
        setDistribution(distributionData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageState label="LOADING ANALYTICS..." />;

  const metrics = overview?.real_data_metrics;
  return (
    <div className="portal-page">
      <PageHeader icon={<BarChart3 />} eyebrow="Analytics" title="Find the pattern behind the signal" description="Compare allocation behavior across states, departments, budgets, and reporting periods." />

      <div className="metric-grid">
        <Metric icon={<MapPin />} label="States / districts" value={metrics?.states_count ?? '--'} note="Administrative regions" />
        <Metric icon={<IndianRupee />} label="Total allocation" value={metrics ? `₹${(metrics.total_allocation / 1e7).toFixed(1)} Cr` : '--'} note="Across monitored records" />
        <Metric icon={<Building2 />} label="Records analysed" value={metrics?.total_records ?? '--'} note="Current data pipeline" />
        <Metric icon={<TrendingUp />} label="Median allocation" value={metrics ? `₹${(metrics.median_allocation / 1e7).toFixed(1)} Cr` : '--'} note="Per MP benchmark" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <section className="mission-card">
          <div className="section-heading"><div><p className="eyebrow">Geographic view</p><h2>Allocation by state</h2></div><span className="data-note">₹ crore</span></div>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={states} margin={{ top: 12, right: 12, left: -12, bottom: 38 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" /><XAxis dataKey="state" angle={-28} textAnchor="end" interval={0} height={60} tick={{ fontSize: 10, fill: '#64748B' }} /><YAxis tick={{ fontSize: 10, fill: '#64748B' }} /><Tooltip contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12 }} formatter={(value) => [`₹${value} Cr`, 'Allocation']} /><Bar dataKey="allocationCr" radius={[4, 4, 0, 0]}>{states.map((item, index) => <Cell key={item.state} fill={COLORS[index % COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer></div>
        </section>

        <section className="mission-card">
          <div className="section-heading"><div><p className="eyebrow">Budget view</p><h2>Allocation distribution</h2></div><span className="data-note">MP count</span></div>
          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={distribution} layout="vertical" margin={{ top: 8, right: 12, left: 14, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" /><XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} /><YAxis dataKey="range" type="category" width={125} tick={{ fontSize: 9, fill: '#64748B' }} /><Tooltip contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12 }} /><Bar dataKey="count" fill="#0D9488" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
        </section>
      </div>

      <section className="mission-card">
        <div className="section-heading"><div><p className="eyebrow">Interpretation layer</p><h2>How to read this workspace</h2></div></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Insight title="State / district analysis" text="Use regional variance to identify allocation outliers that deserve a closer project-level review." color="border-blue-500" />
          <Insight title="Department analysis" text="Compare budget concentration with anomaly volume to separate scale from unusual behavior." color="border-amber-500" />
          <Insight title="Time trends" text="Track changes between reporting periods as new releases are connected to the portal." color="border-teal-500" />
        </div>
      </section>
    </div>
  );
}

function PageHeader({ icon, eyebrow, title, description }) { return <div className="page-header"><div className="page-title"><div className="page-icon">{React.cloneElement(icon, { size: 21 })}</div><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div></div></div>; }
function Metric({ icon, label, value, note }) { return <div className="stat-panel"><div className="stat-label">{label}<span className="stat-icon">{React.cloneElement(icon, { size: 16 })}</span></div><strong>{value}</strong><small>{note}</small></div>; }
function Insight({ title, text, color }) { return <div className={`border-l-4 ${color} bg-slate-50 p-4`}><h3 className="text-sm font-bold text-slate-900">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></div>; }
function PageState({ label }) { return <div className="min-h-[60vh] flex items-center justify-center font-mono text-xs text-slate-500">{label}</div>; }
