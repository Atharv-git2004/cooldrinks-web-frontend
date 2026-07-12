import axios from "axios";

// ബേസ് URL-കൾ
const USER_BASE_URL = "https://cooldrinkbackend.onrender.com/api/users";
const PRODUCT_BASE_URL = "https://cooldrinkbackend.onrender.com/api/products";

// 1. Login API Call
export const loginAPI = async (credentials) => {
  try {
    const response = await axios.post(`${USER_BASE_URL}/login`, credentials, {
      withCredentials: true, // 🔥 സെഷൻ കുക്കികൾ സുരക്ഷിതമായി കൈമാറാൻ ഇത് നിർബന്ധമാണ്
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// 2. Register API Call
export const registerAPI = async (userData) => {
  try {
    const response = await axios.post(`${USER_BASE_URL}/register`, userData, {
      withCredentials: true, // 🔥 കുക്കികൾ സെറ്റ് ചെയ്യാൻ
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// 3. Add Product API Call
export const addProductAPI = async (productData) => {
  try {
    const response = await axios.post(PRODUCT_BASE_URL, productData, {
      withCredentials: true, // 🔥 അഡ്മിൻ ഓതന്റിക്കേഷൻ കുക്കികൾ ബാക്കെൻഡിലേക്ക് പോകാൻ
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
