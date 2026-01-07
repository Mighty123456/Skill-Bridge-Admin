import { axiosInstance } from './axiosInstance';

export type WorkerStatus = 'pending' | 'verified' | 'rejected';

export type WorkerSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  primarySkill?: string;
  experience?: number;
  city?: string;
  status: WorkerStatus;
  createdAt?: string;
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


