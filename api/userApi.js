import axios from "axios";

// ബേസ് URL-കൾ
const USER_BASE_URL = "http://localhost:5000/api/users";
const PRODUCT_BASE_URL = "http://localhost:5000/api/products";

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
    // ഇവിടെ അയക്കുന്ന URL: http://localhost:5000/api/users/register
    const response = await axios.post(`${USER_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// 3. Add Product API Call
export const addProductAPI = async (productData) => {
  try {
    const response = await axios.post(PRODUCT_BASE_URL, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
