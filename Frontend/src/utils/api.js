// API configuration
const API_BASE_URL = 'http://localhost:8000';  // Your FastAPI backend URL

// Helper function for making API requests
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Example API functions
export const api = {
  // User related endpoints
  users: {
    getUsers: () => apiRequest('/users'),
    getUser: (id) => apiRequest(`/users/${id}`),
    // Add more user-related API calls as needed
  },
  
  // Company related endpoints
  companies: {
    getCompanies: () => apiRequest('/companies'),
    getCompany: (id) => apiRequest(`/companies/${id}`),
    createCompany: (companyData) => apiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData)
    }),
    updateCompany: (id, companyData) => apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData)
    }),
    deleteCompany: (id) => apiRequest(`/companies/${id}`, {
      method: 'DELETE'
    })
  },
}; 