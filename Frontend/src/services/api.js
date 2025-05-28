// API service for IPO Prediction Platform
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const requestOptions = { ...defaultOptions, ...options };

    try {
      console.log(`Making ${requestOptions.method || 'GET'} request to:`, url);
      console.log('Request options:', requestOptions);

      const response = await fetch(url, requestOptions);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.makeRequest('/ipo/health');
  }

  // Submit complete MultiStep form
  async submitMultiStepForm(formData) {
    // Convert nested form data to flat structure expected by backend
    const flatFormData = this.convertToFlatStructure(formData);
    
    return this.makeRequest('/ipo/submit-multistep-form', {
      method: 'POST',
      body: JSON.stringify(flatFormData),
    });
  }

  // Submit form with immediate AI prediction
  async submitWithImmediatePrediction(formData) {
    // Convert nested form data to flat structure expected by backend
    const flatFormData = this.convertToFlatStructure(formData);
    
    return this.makeRequest('/ipo/predict-immediately', {
      method: 'POST',
      body: JSON.stringify(flatFormData),
    });
  }

  // Convert form data from frontend structure to backend expected structure
  convertToFlatStructure(formData) {
    console.log('Converting form data to flat structure:', formData);
    
    // All fields should be at root level for backend
    const flatData = {
      // Step 1: User registration
      companyName: formData.companyName || '',
      registrationNumber: formData.registrationNumber || '',
      email: formData.email || '',
      password: formData.password || '',
      
      // Step 2: IPO prediction data (convert all to strings as backend expects)
      industryFF12: String(formData.industryFF12 || ''),
      exchange: String(formData.exchange || ''),
      highTech: String(formData.highTech || 'false'),
      egc: String(formData.egc || 'false'),
      vc: String(formData.vc || 'false'),
      pe: String(formData.pe || 'false'),
      prominence: String(formData.prominence || 'false'),
      age: String(formData.age || '0'),
      year: String(formData.year || new Date().getFullYear()),
      nUnderwriters: String(formData.nUnderwriters || '0'),
      sharesOfferedPerc: String(formData.sharesOfferedPerc || '0'),
      investmentReceived: String(formData.investmentReceived || '0'),
      amountOnProspectus: String(formData.amountOnProspectus || '0'),
      commonEquity: String(formData.commonEquity || '0'),
      sp2weeksBefore: String(formData.sp2weeksBefore || '0'),
      blueSky: String(formData.blueSky || '0'),
      managementFee: String(formData.managementFee || '0'),
      bookValue: String(formData.bookValue || '0'),
      totalAssets: String(formData.totalAssets || '0'),
      totalRevenue: String(formData.totalRevenue || '0'),
      netIncome: String(formData.netIncome || '0'),
      roa: String(formData.roa || '0'),
      leverage: String(formData.leverage || '0'),
      nVCs: String(formData.nVCs || '0'),
      nExecutives: String(formData.nExecutives || '0'),
      priorFinancing: String(formData.priorFinancing || '0'),
      reputationLeadMax: String(formData.reputationLeadMax || '0'),
      reputationAvg: String(formData.reputationAvg || '0'),
      nPatents: String(formData.nPatents || '0'),
      ipoSize: String(formData.ipoSize || '0'),
      
      // Step 3: Risk analysis
      additionalInfo: formData.additionalInfo || '',
      uploadPdf: Boolean(formData.uploadPdf) || false
    };

    console.log('Converted flat data:', flatData);
    return flatData;
  }

  // User management APIs
  async createUser(userData) {
    return this.makeRequest('/ipo/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId) {
    return this.makeRequest(`/ipo/users/${userId}`);
  }

  async getUserByEmail(email) {
    return this.makeRequest(`/ipo/users/email/${encodeURIComponent(email)}`);
  }

  async listUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/ipo/users/${queryString ? `?${queryString}` : ''}`);
  }

  // Prediction APIs
  async getPrediction(predictionId) {
    return this.makeRequest(`/ipo/predictions/${predictionId}`);
  }

  async listPredictions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/ipo/predictions/${queryString ? `?${queryString}` : ''}`);
  }

  async getUserPredictions(userId) {
    return this.makeRequest(`/ipo/users/${userId}/predictions`);
  }

  async requestAIPrediction(predictionId) {
    return this.makeRequest(`/ipo/predictions/${predictionId}/request-ai-prediction`, {
      method: 'POST',
    });
  }

  // Risk analysis APIs
  async getRiskAnalysis(analysisId) {
    return this.makeRequest(`/ipo/risk-analysis/${analysisId}`);
  }

  async getRiskAnalysisByPrediction(predictionId) {
    return this.makeRequest(`/ipo/predictions/${predictionId}/risk-analysis`);
  }

  // Complete analysis
  async getCompleteAnalysis(userId, predictionId) {
    return this.makeRequest(`/ipo/analysis/${userId}/${predictionId}`);
  }

  // Prediction history
  async getUserHistory(userId) {
    return this.makeRequest(`/ipo/users/${userId}/history`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export individual methods for convenience
export const {
  healthCheck,
  submitMultiStepForm,
  submitWithImmediatePrediction,
  createUser,
  getUser,
  getUserByEmail,
  listUsers,
  getPrediction,
  listPredictions,
  getUserPredictions,
  requestAIPrediction,
  getRiskAnalysis,
  getRiskAnalysisByPrediction,
  getCompleteAnalysis,
  getUserHistory
} = apiService; 