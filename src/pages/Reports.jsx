import React, { useEffect, useState } from 'react';
import { FileText, History, Plus, Printer, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Reports() {
  const [cases, setCases] = useState([]);
  const [reportName, setReportName] = useState('Quarterly anomaly review');
  const [generated, setGenerated] = useState(false);

  useEffect(() => { api.getTopDeviations(8).then(setCases).catch(console.error); }, []);

  const generateReport = () => setGenerated(true);
  return (
    <div className="portal-page">
      <div className="page-header flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="page-title"><div className="page-icon"><FileText size={21} /></div><div><p className="eyebrow">Reports</p><h1>Turn findings into an action brief</h1><p>Generate a review-ready snapshot of the highest-priority anomaly cases.</p></div></div>
        <button type="button" onClick={() => window.print()} className="secondary-button"><Printer size={16} /> Print / save PDF</button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.25fr]">
        <section className="mission-card space-y-5">
          <div className="section-heading"><div><p className="eyebrow">Report builder</p><h2>Generate report</h2></div><Plus size={18} className="text-slate-400" /></div>
          <label className="field-label">Report title<input value={reportName} onChange={(event) => setReportName(event.target.value)} className="field-input" /></label>
          <div className="report-option"><ShieldCheck size={17} className="text-teal-600" /><div><strong>Priority anomaly summary</strong><span>Risk score, jurisdiction, and flagged records</span></div><input type="checkbox" defaultChecked /></div>
          <div className="report-option"><History size={17} className="text-blue-600" /><div><strong>Investigation history</strong><span>Recent cases from the live data pipeline</span></div><input type="checkbox" defaultChecked /></div>
          <button type="button" onClick={generateReport} className="primary-button"><FileText size={16} /> {generated ? 'Report generated' : 'Generate report'}</button>
        </section>

        <section className="mission-card report-preview">
          <div className="section-heading"><div><p className="eyebrow">Preview</p><h2>{reportName}</h2></div><span className="badge-real">LIVE DATA</span></div>
          <div className="preview-meta"><span>Fraud & Anomaly Detection Portal</span><span>{new Date().toLocaleDateString()}</span></div>
          <div className="preview-callout"><strong>{cases.length || '--'} priority cases</strong><span>Flagged for investigation from the current pipeline</span></div>
          <div className="space-y-2">{cases.slice(0, 5).map((item) => <div key={item.record_id} className="history-row"><span><strong>{item.record_id}</strong> {item.state}</span><span className="text-amber-700">{item.ai_anomaly_score}/100</span></div>)}</div>
          <button type="button" onClick={() => window.print()} className="secondary-button mt-5 w-full justify-center"><Printer size={16} /> Download PDF</button>
        </section>
      </div>

      <section className="mission-card" id="investigation-history">
        <div className="section-heading"><div><p className="eyebrow">Investigation history</p><h2>Recent flagged records</h2></div><span className="data-note">Latest 8 cases</span></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr><th>Record</th><th>State</th><th>Officer subject</th><th>Risk level</th><th className="text-right">AI score</th></tr></thead><tbody>{cases.map((item) => <tr key={item.record_id}><td className="font-bold text-blue-700">{item.record_id}</td><td>{item.state}</td><td className="font-semibold text-slate-800">{item.mp_name}</td><td><span className={item.risk_level === 'HIGH PRIORITY REVIEW' ? 'badge-high-risk' : 'badge-medium-risk'}>{item.risk_level}</span></td><td className="text-right font-bold text-amber-700">{item.ai_anomaly_score}/100</td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
