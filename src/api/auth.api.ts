import { axiosInstance } from './axiosInstance';

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export const authApi = {
  async login(payload: AdminLoginPayload) {
    const res = await axiosInstance.post('/auth/login', payload);
    return res.data;
  },
};


