import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || `http://localhost:${process.env.REACT_APP_API_PORT || '3001'}`,
});

export const setToken = (token: string): void => {
  api.defaults.headers.common.Authorization = token;
};

export const requestData = async <T = any>(endpoint: string): Promise<T> => {
  const { data } = await api.get<T>(endpoint);
  return data;
};

export const requestLogin = async <T = any>(endpoint: string, body: Record<string, any>): Promise<T> => {
  const { data } = await api.post<T>(endpoint, body);
  return data;
};

export default api;
