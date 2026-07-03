import axios from 'axios';

// ബേസ് URL-കൾ
const USER_BASE_URL = 'http://localhost:5000/api/users';
const PRODUCT_BASE_URL = 'http://localhost:5000/api/products'; // പ്രോഡക്റ്റിന് വേണ്ടിയുള്ള ബേസ് URL

// 1. Login API Call
export const loginAPI = async (credentials) => {
    try {
        const response = await axios.post(`${USER_BASE_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// 2. Register API Call
export const registerAPI = async (userData) => {
    try {
        const response = await axios.post(`${USER_BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};

// 3. Add Product API Call (പുതായി ചേർത്തത്)
export const addProductAPI = async (productData) => {
    try {
        // നിന്റെ ബാക്കെൻഡ് റൂട്ട് അനുസരിച്ച് വേണമെങ്കിൽ ഇവിടെ മാറ്റം വരുത്താം
        // ബാക്കെൻഡിൽ പ്രോഡക്റ്റ് ആഡ് ചെയ്യാൻ പോസ്റ്റ് ചെയ്യുന്നത് ഈ URL-ലേക്ക് ആയിരിക്കും
        const response = await axios.post(`${PRODUCT_BASE_URL}/add`, productData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network Error");
    }
};