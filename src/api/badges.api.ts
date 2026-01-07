import { axiosInstance } from './axiosInstance';

export interface Badge {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    color: string;
    icon?: string;
    isActive: boolean;
}

export const badgesApi = {
    async getAllBadges(): Promise<Badge[]> {
        const res = await axiosInstance.get('/admin/badges');
        return res.data.data?.badges ?? res.data.badges ?? [];
    },

    async createBadge(data: Partial<Badge>) {
        const res = await axiosInstance.post('/admin/badges', data);
        return res.data;
    },

    async assignBadge(workerId: string, badgeId: string) {
        const res = await axiosInstance.post(`/admin/workers/${workerId}/badges`, { badgeId });
        return res.data;
    },

    async removeBadge(workerId: string, badgeId: string) {
        const res = await axiosInstance.delete(`/admin/workers/${workerId}/badges/${badgeId}`);
        return res.data;
    },
};
