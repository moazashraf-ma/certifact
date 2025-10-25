const API_BASE_URL = "http://localhost:5000";

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");


  console.log("Token from localStorage:", token);

  const headers = {
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If not sending FormData, use JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  // Return JSON if response contains it
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
};

const api = {
  // --- Authentication ---
  register: async (userData) =>
    fetchWithAuth(`${API_BASE_URL}/api/register`, {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: async (credentials) => {
    // Login does NOT use fetchWithAuth (since no token yet)
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Save token to localStorage
    if (data.access_token) {
      localStorage.setItem("authToken", data.access_token);
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
  },

  // --- Core ---
  getHealth: async () => fetchWithAuth(`${API_BASE_URL}/api/health`),

  upload: async (file) => {
    const formData = new FormData();
    formData.append("mediaFile", file);
    return fetchWithAuth(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
  },

  getStatus: async (jobId) =>
    fetchWithAuth(`${API_BASE_URL}/api/status/${jobId}`),

  getResult: async (resultId) =>
    fetchWithAuth(`${API_BASE_URL}/api/results/${resultId}`),

  getHistory: async () =>
    fetchWithAuth(`${API_BASE_URL}/api/history`),

  getDashboardStats: async () =>
    fetchWithAuth(`${API_BASE_URL}/api/dashboard-stats`),
  
};

export default api;
