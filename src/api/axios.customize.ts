import axios, { type AxiosInstance, type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

// Base URL config - sử dụng VITE_BACKEND_URL từ env
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://3-107-36-172.nip.io/";

// Flags để tránh multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Process queue after refresh success/failure
const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Tạo axios instance chung cho toàn dự án
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  withCredentials: true, // Tự động gửi HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý response với HTTP-only cookies và auto refresh
axiosInstance.interceptors.response.use(
  <T>(response: AxiosResponse<T>) => {
    // Trả về data trực tiếp thay vì toàn bộ response object
    return response.data as T;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Xử lý các lỗi dựa trên status code
    const status = error.response?.status;
    if (status) {
      switch (status) {
        case 401:
          // Unauthorized - xử lý refresh token với queue
          if (originalRequest && !originalRequest._retry) {
            // Nếu đang refresh, thêm request vào queue
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              }).then(() => {
                return axiosInstance(originalRequest);
              }).catch(err => {
                return Promise.reject(err);
              });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
              await axiosInstance.post('/auth/refresh');
              processQueue(null);
              isRefreshing = false;
              return axiosInstance(originalRequest);
            } catch (refreshError) {
              // Refresh failed
              processQueue(refreshError);
              isRefreshing = false;
              
              // Chỉ redirect nếu đã thử refresh và thất bại
              console.log('🔄 Refresh token expired, redirecting to login');
              if (typeof window !== 'undefined') {
                // Delay một chút để tránh multiple redirects
                setTimeout(() => {
                  window.location.href = '/login';
                }, 1000);
              }
              return Promise.reject(new Error('Session expired. Please login again.'));
            }
          }
          // Nếu đã retry rồi mà vẫn 401, có nghĩa là thực sự hết session
          return Promise.reject(new Error('Authentication required'));

        case 400:
          // Bad Request - preserve original response for analysis APIs
          console.log('🔍 400 Bad Request details:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: (error.response?.data as any)?.message || error.message
          });
          // Don't throw new Error, preserve original error
          return Promise.reject(error);

        case 403:
          // Forbidden - user không có quyền truy cập
          throw new Error('You do not have permission to access this resource');

        case 404:
          // Not Found - preserve original response for analysis APIs that may return 404
          if (error.config?.url?.includes('/analyze')) {
            console.log('🔍 404 Not Found for analysis API:', error.config.url);
            return Promise.reject(error);
          }
          throw new Error('The requested resource was not found');

        case 500:
          // Internal Server Error
          throw new Error('Internal server error. Please try again later');

        default:
          // Các lỗi khác - preserve original for analysis APIs
          if (error.config?.url?.includes('/analyze')) {
            console.log('🔍 Error for analysis API:', {
              status: error.response?.status,
              data: error.response?.data,
              url: error.config?.url
            });
            return Promise.reject(error);
          }
          const message = (error.response?.data as any)?.message || error.message || 'An unexpected error occurred';
          throw new Error(message);
      }
    } else {
      // Network error hoặc request timeout
      throw new Error('Network error. Please check your connection and try again');
    }

    return Promise.reject(error);
  }
);

// Export axios instance làm default
export default axiosInstance;

// Export thêm một alias cho dễ sử dụng
export const api = axiosInstance;

// Type definitions cho API responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}
