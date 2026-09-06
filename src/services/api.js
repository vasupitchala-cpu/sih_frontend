const BASE_URL = 'http://127.0.0.1:8000/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Fetch Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  getOverview: () => fetchJson('/overview'),
  getStateAnalytics: () => fetchJson('/analytics/states'),
  getDistributionAnalytics: () => fetchJson('/analytics/distribution'),
  getTopDeviations: (limit = 10) => fetchJson(`/analytics/deviations?limit=${limit}`),
  
  getAllocationRisk: (params = {}) => {
    const query = new URLSearchParams();
    if (params.state) query.append('state', params.state);
    if (params.risk_level) query.append('risk_level', params.risk_level);
    if (params.search) query.append('search', params.search);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);
    return fetchJson(`/risk/allocation?${query.toString()}`);
  },

  getProjectRisk: (params = {}) => {
    const query = new URLSearchParams();
    if (params.state) query.append('state', params.state);
    if (params.constituency) query.append('constituency', params.constituency);
    if (params.mp_name) query.append('mp_name', params.mp_name);
    if (params.risk_level) query.append('risk_level', params.risk_level);
    if (params.project_type) query.append('project_type', params.project_type);
    if (params.search) query.append('search', params.search);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);
    return fetchJson(`/risk/projects?${query.toString()}`);
  },

  getAllocationInvestigation: (recordId) => fetchJson(`/investigation/allocation/${recordId}`),
  getProjectInvestigation: (projectId) => fetchJson(`/investigation/project/${projectId}`),

  explainCase: (caseId, caseType, prompt) => fetchJson('/ai/explain', {
    method: 'POST',
    body: JSON.stringify({ case_id: caseId, case_type: caseType, prompt })
  }),

  generateSummary: (focusArea = 'ALL') => fetchJson('/ai/summary', {
    method: 'POST',
    body: JSON.stringify({ focus_area: focusArea })
  }),

  researchQuery: (query, context) => fetchJson('/ai/research', {
    method: 'POST',
    body: JSON.stringify({ query, context })
  })
};
