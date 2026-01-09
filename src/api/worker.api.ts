import { axiosInstance } from './axiosInstance';
import { type Badge } from './badges.api';

export type WorkerStatus = 'pending' | 'verified' | 'rejected';

export type ProfessionalType = 'worker' | 'contractor';

export type ProfessionalSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  type: ProfessionalType;
  primarySkill?: string;
  companyName?: string;
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
  async getPendingProfessionals(): Promise<ProfessionalSummary[]> {
    const res = await axiosInstance.get('/admin/professionals?status=pending');
    return res.data.data?.professionals ?? [];
  },

  async updateProfessionalStatus(id: string, status: WorkerStatus, reason?: string) {
    const res = await axiosInstance.patch(`/admin/professionals/${id}/status`, {
      status,
      reason,
    });
    return res.data;
  },
};


