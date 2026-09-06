import React, { useState } from 'react';
import { Cpu, HelpCircle, Layers, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export default function AIResearch() {
  const [activeMode, setActiveMode] = useState('case_explain');

  const [caseId, setCaseId] = useState('REC-001');
  const [caseType, setCaseType] = useState('allocation');
  const [queryText, setQueryText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunQuery = () => {
    setLoading(true);
    setResult(null);

    if (activeMode === 'case_explain') {
      api.explainCase(caseId, caseType, queryText || "Explain why this case was prioritized.")
        .then(res => { setResult(res); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    } else if (activeMode === 'dataset_intel') {
      api.generateSummary(queryText || "ALL")
        .then(res => { setResult({ explanation: res.summary, mode: res.mode, gemini_active: res.gemini_active }); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    } else {
      api.researchQuery(queryText || "What are the rules for MPLADS Utilization Certificate submissions?", "MPLADS Scheme Guidelines")
        .then(res => { setResult({ explanation: res.answer, mode: res.mode, gemini_active: res.gemini_active }); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    }
  };

  const futureConnectors = [
    { title: "Real Allocation Anomaly Detection", status: "ACTIVE USING REAL DATA", badge: "badge-real" },
    { title: "Cost Anomaly Detection", status: "ACTIVE USING PROTOTYPE SYNTHETIC DATA", badge: "badge-synthetic" },
    { title: "Payment–Progress Mismatch", status: "ACTIVE USING PROTOTYPE SYNTHETIC DATA", badge: "badge-synthetic" },
    { title: "Project Delay Detection", status: "ACTIVE USING PROTOTYPE SYNTHETIC DATA", badge: "badge-synthetic" },
    { title: "Duplicate Work Detection", status: "ACTIVE USING PROTOTYPE SYNTHETIC DATA", badge: "badge-synthetic" },
    { title: "Geo-Evidence Verification", status: "REQUIRES FUTURE DATA CONNECTOR", badge: "px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-600 border border-slate-300" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Cpu className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-black font-mono tracking-tight text-slate-900">MPLADS AI INTELLIGENCE COPILOT & RESEARCH</h1>
        </div>
        <p className="text-xs text-slate-600 font-sans mt-1">
          Synthesize case explanations, query calculated dataset statistics, or perform regulatory research.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveMode('case_explain')}
          className={`p-4 rounded-lg border text-left transition font-mono ${
            activeMode === 'case_explain'
              ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>MODE 1: CASE EXPLANATION</span>
          </div>
          <div className="text-xs text-slate-500 font-sans mt-1">Explain specific real allocation or demo project records.</div>
        </button>

        <button
          onClick={() => setActiveMode('dataset_intel')}
          className={`p-4 rounded-lg border text-left transition font-mono ${
            activeMode === 'dataset_intel'
              ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>MODE 2: DATASET INTELLIGENCE</span>
          </div>
          <div className="text-xs text-slate-500 font-sans mt-1">Query calculated statistical findings across all 542 MPs.</div>
        </button>

        <button
          onClick={() => setActiveMode('research')}
          className={`p-4 rounded-lg border text-left transition font-mono ${
            activeMode === 'research'
              ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>MODE 3: RESEARCH ASSISTANT</span>
          </div>
          <div className="text-xs text-slate-500 font-sans mt-1">Regulatory research and MPLADS guidelines search.</div>
        </button>
      </div>

      {/* Query Form Panel */}
      <div className="mission-card space-y-4">
        <h2 className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
          {activeMode === 'case_explain' && 'CASE EXPLANATION PROMPT'}
          {activeMode === 'dataset_intel' && 'DATASET STATISTICAL SUMMARY QUERY'}
          {activeMode === 'research' && 'EXTERNAL REGULATORY RESEARCH QUERY'}
        </h2>

        {activeMode === 'case_explain' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-500 mb-1">SELECT DATA LAYER</label>
              <select
                value={caseType}
                onChange={(e) => {
                  setCaseType(e.target.value);
                  setCaseId(e.target.value === 'allocation' ? 'REC-001' : 'PRJ-00001');
                }}
                className="w-full p-2.5 bg-white border border-slate-300 rounded text-slate-900 shadow-xs"
              >
                <option value="allocation">REAL ALLOCATION (e.g. REC-001 to REC-542)</option>
                <option value="project">SYNTHETIC DEMO PROJECT (e.g. PRJ-00001 to PRJ-02692)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">ENTER CASE ID</label>
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="e.g. REC-001 or PRJ-00001"
                className="w-full p-2.5 bg-white border border-slate-300 rounded text-slate-900 font-bold shadow-xs"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-mono text-slate-500 mb-1">OPTIONAL PROMPT / QUESTION</label>
          <textarea
            rows={3}
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={
              activeMode === 'case_explain' ? "e.g. Provide a step-by-step verification protocol for district authorities." :
              activeMode === 'dataset_intel' ? "e.g. Summarize top allocation deviation patterns across states." :
              "e.g. What are the rules for physical inspection of completed MPLADS works?"
            }
            className="w-full p-3 bg-white border border-slate-300 rounded text-slate-900 text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleRunQuery}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold rounded transition flex items-center space-x-2 shadow-xs"
          >
            {loading ? (
              <span>PROCESSING QUERY...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE AI BRIEF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      {result && (
        <div className="mission-card space-y-3 border-l-4 border-blue-600">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs font-mono">
            <span className="text-blue-700 font-bold">INTELLIGENCE OUTPUT</span>
            <span className={result.gemini_active ? 'badge-real' : 'badge-synthetic'}>
              {result.gemini_active ? 'GEMINI AI (LIVE)' : 'DETERMINISTIC RULE ENGINE (FALLBACK)'}
            </span>
          </div>

          <div className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed p-4 bg-slate-50 rounded border border-slate-200">
            {result.explanation}
          </div>
        </div>
      )}

      {/* Architecture Section: FUTURE DATA CONNECTORS */}
      <section className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold font-mono text-slate-900">FUTURE DATA CONNECTORS ARCHITECTURE</h2>
        </div>
        <p className="text-xs text-slate-600 font-sans">
          SIH Prototype module readiness matrix. Clearly demarcating active real dataset capabilities, synthetic demonstration capabilities, and future API integrations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureConnectors.map((mod, idx) => (
            <div key={idx} className="mission-card space-y-2">
              <div className="text-xs font-mono font-bold text-slate-900">{mod.title}</div>
              <div>
                <span className={mod.badge}>{mod.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
