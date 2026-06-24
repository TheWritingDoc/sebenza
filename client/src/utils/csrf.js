import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

// Track CSRF token state
let csrfToken = null;
let csrfTokenExpiry = 0;
const CSRF_TOKEN_LIFETIME = 5 * 60 * 1000; // 5 minutes

/**
 * Get a fresh CSRF token from the server.
 */
async function fetchCsrfToken() {
  const res = await axios.get(`${API_URL}/api/csrf-token`, { withCredentials: true });
  csrfToken = res.data.csrfToken;
  csrfTokenExpiry = Date.now() + CSRF_TOKEN_LIFETIME;
  return csrfToken;
}

/**
 * Get cached or fresh CSRF token.
 */
export async function getCsrfToken() {
  if (!csrfToken || Date.now() > csrfTokenExpiry) {
    return fetchCsrfToken();
  }
  return csrfToken;
}

/**
 * Setup axios interceptors to automatically handle CSRF tokens
 * for all state-changing requests to protected endpoints.
 */
export function setupCsrfInterceptor() {
  // CSRF-protected endpoint prefixes
  const protectedPrefixes = [
    '/api/register',
    '/api/login', 
    '/api/jobs',
    '/api/services',
    '/api/transactions',
    '/api/users/profile-image'
  ];

  // Request interceptor: add CSRF token to protected endpoints
  axios.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase();
    const url = config.url || '';
    
    // Only intercept state-changing methods on protected endpoints
    if (['post', 'put', 'delete', 'patch'].includes(method)) {
      const isProtected = protectedPrefixes.some(prefix => 
        url.includes(prefix) || (config.baseURL + url).includes(prefix)
      );
      
      if (isProtected) {
        try {
          const token = await getCsrfToken();
          config.headers = config.headers || {};
          config.headers['X-CSRF-Token'] = token;
          config.withCredentials = true;
        } catch (err) {
          console.error('Failed to get CSRF token:', err);
        }
      }
    }
    
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  // Response interceptor: handle CSRF errors by retrying once
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If CSRF error and not already retried
      if (error.response?.status === 403 && 
          error.response?.data?.details?.includes('csrf') &&
          !originalRequest._csrfRetry) {
        originalRequest._csrfRetry = true;
        
        // Force refresh CSRF token
        csrfToken = null;
        const newToken = await fetchCsrfToken();
        originalRequest.headers['X-CSRF-Token'] = newToken;
        originalRequest.withCredentials = true;
        
        return axios(originalRequest);
      }
      
      return Promise.reject(error);
    }
  );
}
