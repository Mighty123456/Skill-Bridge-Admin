import { axiosInstance } from './axiosInstance';

export type UserRole = 'worker' | 'user' | 'contractor' | 'admin';

export type UserSummary = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    createdAt: string;
    profileImage?: string;
    isActive: boolean;
    isVerified?: boolean;
    details?: {
        services?: string[];
        skills?: string[];
        experience?: number;
        governmentId?: string;
        selfie?: string;
        verificationStatus?: string;
        city?: string;
        state?: string;
        companyName?: string;
    };
    address?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
    };
};

export const usersApi = {
    async getAllUsers(role?: string): Promise<UserSummary[]> {
        const params = role && role !== 'all' ? { role } : {};
        const res = await axiosInstance.get('/admin/users', { params });
        const users = res.data.data?.users ?? [];
        return users.map((u: any) => ({ ...u, id: u._id }));
    },
};
