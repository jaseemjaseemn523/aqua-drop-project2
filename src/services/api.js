import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://muhammedjaseem.pythonanywhere.com/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Authorization token
api.interceptors.request.use((config) => {
  if (config.url && (config.url.includes('accounts/register/') || config.url.includes('accounts/login/'))) {
    return config;
  }

  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle Token Refresh on 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Access token expired ആയെങ്കിൽ ഒപ്പം ഒരിക്കൽ മാത്രം റിഫ്രഷ് ചെയ്യാൻ ശ്രമിക്കാൻ
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // ശ്രദ്ധിക്കുക: ഇവിടെ കറക്റ്റായ accounts/token/refresh/ URL ആണ് നൽകിയിരിക്കുന്നത്
          const response = await axios.post(
            `${api.defaults.baseURL}accounts/token/refresh/`, 
            { refresh: refreshToken }
          );
          
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);
          
          // പുതിയ ടോക്കൺ വെച്ച് പഴയ റിക്വസ്റ്റ് വീണ്ടും അയക്കുന്നു
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // റിഫ്രഷ് ടോക്കണും എക്സ്പയർ ആയെങ്കിൽ ലോഗ് ഔട്ട് ചെയ്ത് ലോഗിൻ പേജിലേക്ക് വിടാം
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;