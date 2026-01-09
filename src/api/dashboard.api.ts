import { axiosInstance } from './axiosInstance';

export type DashboardStats = {
    pendingVerifications: number;
    verifiedWorkers: number;
    totalWorkers: number;
    verifiedContractors: number;
    totalContractors: number;
    totalVerifiedProfessionals: number;
    totalUsers: number;
};

export const dashboardApi = {
    async getStats(): Promise<DashboardStats> {
        const res = await axiosInstance.get('/admin/stats');
        return res.data.data; // Response format: { status: true, message: '...', data: { pendingWorkers: ... } }
    },
};
