import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

// === Interceptor cho mọi request ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Interceptor cho response (xử lý token hết hạn) ===
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        // Gửi request refresh token
        const res = await axios.post("http://localhost:8080/api/v1/refresh-access-token", {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = res.data;

        // Lưu lại token mới
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Gắn token mới vào header và gửi lại request cũ
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        // Nếu refresh cũng thất bại → logout
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

