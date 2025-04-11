
import axios from "axios";

const api = axios.create({
  baseURL: "https://quiz-portal-3ax0.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
    console.log("Access token expired. Attempting to refresh...");
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const res = await axios.post(
          "https://quiz-portal-3ax0.onrender.com/api/auth/refresh-token",
          { refreshToken }
        );
        console.log("Refresh token response:", res.data.accessToken);

        localStorage.setItem("accessToken", res.data.accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
