// Use `REACT_APP_API_HOST` to override host in development or CI. Defaults to localhost for local development.
const host = process.env.REACT_APP_API_HOST || "http://localhost:5000";
// Production host (example): "https://expense-tracker-app-knl1.onrender.com"
export const setAvatarAPI = `${host}/api/auth/setAvatar`;
export const registerAPI = `${host}/api/auth/register`;
export const loginAPI = `${host}/api/auth/login`;
export const addTransaction = `${host}/api/v1/addTransaction`;
export const getTransactions = `${host}/api/v1/getTransaction`;
export const editTransactions = `${host}/api/v1/updateTransaction`;
export const deleteTransactions = `${host}/api/v1/deleteTransaction`;