import API, { setAuthToken } from '../services/api.js';

export const useAuthMutation = () => {
  const login = async (payload) => {
    const response = await API.post('/auth/login', payload);
    setAuthToken(response.data.token);
    return response.data;
  };

  const register = async (payload) => {
    const response = await API.post('/auth/register', payload);
    setAuthToken(response.data.token);
    return response.data;
  };

  return { login, register };
};
