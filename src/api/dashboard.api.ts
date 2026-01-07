import { axiosInstance } from './axiosInstance';

export type DashboardStats = {
    pendingWorkers: number;
    verifiedWorkers: number;
    totalUsers: number;
    totalContractors: number;
};

export const dashboardApi = {
    async getStats(): Promise<DashboardStats> {
        const res = await axiosInstance.get('/admin/stats');
        return res.data.data; // Response format: { status: true, message: '...', data: { pendingWorkers: ... } }
    },
};
