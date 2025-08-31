import axios from 'axios';
const ambient = 'prod';

var axiosInstance = axios.create({
  baseURL: ambient === 'dev' ? 'http://localhost:8085' : 'https://scraper-tcm-ba-api.duduserver.work',
});

axiosInstance.interceptors.request.use(
  request => {
    const headers = {
      locale: 'pt-br',
      accept: '*/*',
      "Content-Type": "application/json"
    };

    request.headers = headers;
    return request;
  },
  err => {
    Promise.reject(err);
  }
);


export default axiosInstance;
