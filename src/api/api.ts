import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from "axios";

const createInstanceAxios = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    withCredentials: true, // 👈 cookie tự gửi
    headers: { "Content-Type": "application/json" },
  });

  // response interceptor
  instance.interceptors.response.use(
    <T>(response: AxiosResponse<T>): T => response.data, // trả về data trực tiếp
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
        (originalRequest as any)._retry = true;
        try {
          await instance.post("/api/auth/refresh"); // ✅ Đã sửa endpoint đúng
          return instance(originalRequest); // retry
        } catch {
          window.location.href = "/login"; // refresh fail → login
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createInstanceAxios;
