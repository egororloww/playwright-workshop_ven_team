import axios, { AxiosInstance } from 'axios';

type ApiOptionsType = {
  baseURL: string;
  headers: {
    'Content-Type': string;
  };
};

interface UseAxiosHook {
  api: AxiosInstance;
  apiFormData: AxiosInstance;
  setToken: () => void;
}

export const useAxios = (): UseAxiosHook => {
  const apiOptions: ApiOptionsType = {
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const apiFormDataOptions: ApiOptionsType = {
    baseURL: import.meta.env.VITE_APP_API,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const api = axios.create(apiOptions);
  const apiFormData = axios.create(apiFormDataOptions);

  const setToken = (): void => {
    const token = localStorage.getItem('accessToken');

    api.interceptors.request.use((config) => {
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    });
    apiFormData.interceptors.request.use((config) => {
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    });
    api.interceptors.response.use((config) => {
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    });
    apiFormData.interceptors.response.use((config) => {
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    });
  };

  setToken();

  return { api, apiFormData, setToken };
};
