import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || `http://localhost:${process.env.REACT_APP_API_PORT || '3001'}`,
  timeout: 60000, // 60 segundos de tolerância para o cold-start do Render
});

export const setToken = (token: string): void => {
  api.defaults.headers.common.Authorization = token;
};

// Retry com backoff para requisições GET durante inicialização do Render
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as (AxiosRequestConfig & { __retryCount?: number });

    // Apenas aplica retry em requisições GET idempotentes que falharem por timeout ou erro de rede/servidor offline (502, 503, 504)
    if (!config || config.method?.toLowerCase() !== 'get') {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;
    const maxRetries = 4;

    if (config.__retryCount < maxRetries) {
      config.__retryCount += 1;
      const delayMs = 3000 * config.__retryCount; // 3s, 6s, 9s, 12s
      console.warn(`[API Render Wakeup] Servidor pode estar acordando. Tentativa ${config.__retryCount}/${maxRetries} em ${delayMs / 1000}s...`);

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return api(config);
    }

    return Promise.reject(error);
  },
);

export const requestData = async <T = any>(endpoint: string): Promise<T> => {
  const { data } = await api.get<T>(endpoint);
  return data;
};

export const requestLogin = async <T = any>(endpoint: string, body: Record<string, any>): Promise<T> => {
  const { data } = await api.post<T>(endpoint, body);
  return data;
};

export default api;
