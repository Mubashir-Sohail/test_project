import axios from "axios";

const axiosApi = axios.create({
  baseURL: "http://localhost:5500/api/v1",
});

axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post("http://localhost:5500/api/v1/user/refresh", {
          refreshToken: localStorage.getItem("refreshToken"),
        });

        localStorage.setItem("accessToken", res.data.accessToken);

      
        originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
        return axiosApi(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed:", refreshError);
        
      }
    }

    return Promise.reject(error);
  }
);

export default axiosApi;
