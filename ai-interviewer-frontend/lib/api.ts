const API_BASE_URL = "http://127.0.0.1:8000/api";

export const api = {
  // 1. Upload Resume
  uploadResume: async (candidateId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/candidates/${candidateId}/upload-resume`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload resume");
    return res.json();
  },

  // 2. Start Interview
  startInterview: async (candidateId: string, jobRole: string) => {
    const res = await fetch(`${API_BASE_URL}/interviews/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_id: candidateId, job_role: jobRole }),
    });
    if (!res.ok) throw new Error("Failed to start interview");
    return res.json();
  },

  // 3. Get Report
  getInterviewReport: async (interviewId: string) => {
    const res = await fetch(`${API_BASE_URL}/interviews/${interviewId}`);
    if (!res.ok) throw new Error("Failed to fetch report");
    return res.json();
  }
};

// We keep this for future authenticated calls
export const getAuthenticatedApi = (token: string) => {
  return {
    syncUser: async (userData: { name: string, email: string }) => {
      return fetch(`${API_BASE_URL}/auth/sync`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(userData)
      });
    }
  };
};