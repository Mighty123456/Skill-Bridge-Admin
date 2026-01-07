import { axiosInstance } from './axiosInstance';
import { type Badge } from './badges.api';

export type WorkerStatus = 'pending' | 'verified' | 'rejected';

export type WorkerSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  primarySkill?: string;
  experience?: number;
  services?: string[];
  city?: string;
  state?: string;
  status: WorkerStatus;
  createdAt?: string;
  governmentId?: string;
  selfie?: string;
  badges?: Badge[];
};

export const workerApi = {
  async getPendingWorkers(): Promise<WorkerSummary[]> {
    const res = await axiosInstance.get('/admin/workers?status=pending');
    return res.data.data?.workers ?? res.data.workers ?? [];
  },

  async updateWorkerStatus(workerId: string, status: WorkerStatus, reason?: string) {
    const res = await axiosInstance.patch(`/admin/workers/${workerId}/status`, {
      status,
      reason,
    });
    return res.data;
  },
};


