import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FileText, AlertCircle, CheckSquare, 
  Cpu, ArrowLeft, Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function Investigation() {
  const { record_id, project_id } = useParams();
  
  const caseId = record_id || project_id || 'REC-001';
  const caseType = record_id ? 'allocation' : 'project';

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState(null);

  useEffect(() => {
    setLoading(true);
    setCopilotResponse(null);

    if (caseType === 'allocation') {
      api.getAllocationInvestigation(caseId)
        .then(res => { setDetail(res); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    } else {
      api.getProjectInvestigation(caseId)
        .then(res => { setDetail(res); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    }
  }, [caseId, caseType]);

  const handleCopilotQuickAction = (promptText) => {
    setCopilotLoading(true);
    api.explainCase(caseId, caseType, promptText)
      .then(res => {
        setCopilotResponse(res);
        setCopilotLoading(false);
      })
      .catch(err => {
        console.error("Copilot error:", err);
        setCopilotLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-mono">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>LOADING CASE FILE #{caseId}...</span>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-center text-slate-600 font-mono">
        <h2 className="text-xl font-bold text-rose-600">CASE FILE NOT FOUND</h2>
        <p className="mt-2 text-xs">Record ID #{caseId} could not be located in current dataset pipeline.</p>
        <Link to="/risk-radar" className="mt-4 inline-block px-4 py-2 bg-white border border-slate-300 text-blue-700 rounded">
          Return to Risk Radar
        </Link>
      </div>
    );
  }

  const { subject_details: sd, data_source } = detail;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header Breadcrumb & Controls */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/risk-radar" className="p-2 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black font-mono tracking-tight text-slate-900">CASE INVESTIGATION #{detail.record_id || detail.project_id}</h1>
              <span className={
                detail.ai_finding.risk_level === 'HIGH PRIORITY REVIEW' ? 'badge-high-risk' :
                detail.ai_finding.risk_level === 'REVIEW RECOMMENDED' || detail.ai_finding.risk_level === 'MEDIUM RISK' ? 'badge-medium-risk' : 'badge-low-risk'
              }>
                {detail.ai_finding.risk_level}
              </span>
              <span className={data_source === 'REAL' ? 'badge-real' : 'badge-synthetic'}>
                DATA SOURCE: {data_source === 'REAL' ? 'REAL DATA' : 'SYNTHETIC DEMONSTRATION DATA'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              Official Government Monitoring & Evidence Dossier
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Case Details & Findings (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Subject Details */}
          <div className="mission-card space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 flex items-center space-x-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4" />
              <span>SUBJECT DETAILS & ADMINISTRATIVE CONTEXT</span>
            </h2>

            {data_source === 'REAL' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px]">HON'BLE MEMBER OF PARLIAMENT</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{sd.mp_name}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px]">CONSTITUENCY & STATE</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{sd.constituency} ({sd.state})</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px]">ALLOCATED LIMIT AMOUNT</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">₹{(sd.allocated_amount / 1e7).toFixed(2)} Cr</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px]">STATE MEDIAN ALLOCATION</div>
                  <div className="text-sm font-bold text-slate-700 mt-1">₹{(sd.state_median / 1e7).toFixed(2)} Cr</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 sm:col-span-2">
                  <div className="text-slate-500 text-[10px]">PROJECT CATEGORY & DESCRIPTION</div>
                  <div className="text-sm font-bold text-amber-800 mt-1">{sd.project_type}</div>
                  <div className="text-xs text-slate-700 mt-1 font-sans">{sd.project_description}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px]">SANCTIONED / SPENT BUDGET</div>
                  <div className="text-sm font-bold text-emerald-700 mt-1">
                    Spent: ₹{(sd.spent_amount / 1e5).toFixed(2)} L ({sd.expenditure_percentage}%)
                  </div>
                  <div className="text-xs text-slate-500">Sanctioned: ₹{(sd.sanctioned_amount / 1e5).toFixed(2)} L</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-slate-500 text-[10px]">PHYSICAL WORK PROGRESS</div>
                  <div className="text-sm font-bold text-blue-700 mt-1">{sd.physical_progress}% Completed</div>
                  <div className="text-xs text-slate-500">Status: {sd.project_status} ({sd.delay_days} days delay)</div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: AI Finding & Why Was This Flagged */}
          <div className="mission-card space-y-4 border-l-4 border-amber-500">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 flex items-center space-x-2 border-b border-slate-100 pb-2">
              <AlertCircle className="w-4 h-4" />
              <span>WHY WAS THIS FLAGGED? (AI INTELLIGENCE SYNTHESIS)</span>
            </h2>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 text-sm font-mono leading-relaxed text-slate-800">
              {detail.why_flagged}
            </div>

            {/* Evidence Signals */}
            <div>
              <div className="text-xs font-mono font-semibold text-slate-500 mb-2 uppercase">EVIDENCE SIGNALS DETECTED:</div>
              <div className="flex flex-wrap gap-2">
                {detail.detected_signals.map((sig, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-mono font-bold">
                    SIGNAL: {sig}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Recommended Review Actions */}
          <div className="mission-card space-y-3 border-l-4 border-blue-600">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 flex items-center space-x-2 border-b border-slate-100 pb-2">
              <CheckSquare className="w-4 h-4" />
              <span>RECOMMENDED AUDIT & VERIFICATION ACTIONS</span>
            </h2>

            <div className="space-y-2 font-mono text-xs">
              {detail.recommended_actions.map((act, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800">{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory AI Disclaimer */}
          <div className="p-3 bg-slate-100 border border-slate-200 rounded text-[11px] text-slate-600 italic font-mono">
            <strong>Disclaimer:</strong> {detail.disclaimer}
          </div>

        </div>

        {/* Right Column: AI Intelligence Copilot Drawer (1 col wide) */}
        <div className="space-y-6">
          <div className="mission-card space-y-4 sticky top-20 border-t-4 border-blue-600 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-700 font-mono font-bold text-sm">
              <Cpu className="w-5 h-5" />
              <span>AI INTELLIGENCE COPILOT</span>
            </div>
            <p className="text-xs text-slate-600 font-sans">
              Request real-time AI case explanations, unusual pattern diagnostics, and verification protocols.
            </p>

            {/* Quick Actions */}
            <div className="space-y-2 text-xs font-mono">
              <button
                onClick={() => handleCopilotQuickAction("Explain why this case was prioritized and summarize key risk factors.")}
                className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded transition text-slate-800 flex items-center justify-between font-medium"
              >
                <span>Explain this case</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </button>

              <button
                onClick={() => handleCopilotQuickAction("Why is this record statistically unusual compared to state peers?")}
                className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded transition text-slate-800 flex items-center justify-between font-medium"
              >
                <span>Why is this unusual?</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </button>

              <button
                onClick={() => handleCopilotQuickAction("What physical evidence and documents should District Collectors request?")}
                className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded transition text-slate-800 flex items-center justify-between font-medium"
              >
                <span>What should I verify?</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </button>

              <button
                onClick={() => handleCopilotQuickAction("Summarize this case for the Executive Oversight Panel.")}
                className="w-full text-left p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded transition text-slate-800 flex items-center justify-between font-medium"
              >
                <span>Summarise this case</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>

            {/* Copilot Response Output Box */}
            {copilotLoading && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-blue-600 animate-pulse">
                SYNTHESIZING LIVE COPILOT BRIEF...
              </div>
            )}

            {copilotResponse && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2 text-xs font-mono text-slate-900 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-200 pb-1 font-mono">
                  <span>MODE: {copilotResponse.mode}</span>
                  <span className={copilotResponse.gemini_active ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {copilotResponse.gemini_active ? 'GEMINI LIVE' : 'RULE ENGINE'}
                  </span>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-800">
                  {copilotResponse.explanation}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
