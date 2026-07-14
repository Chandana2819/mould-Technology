// types/team.ts

export type TeamMember = {
    id: number;
    userId: number;
    companyId: number;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'FORMER';
    designation: string;
    department: string;
    employmentType: string;
    startDate: string;
    endDate?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: number;
        fullName: string;
        email: string;
        avatarUrl?: string;
        headline?: string;
    };
    company: {
        id: number;
        name: string;
        slug: string;
        logoUrl?: string;
    };
};

export type TeamRequest = {
    companyId: number;
    designation: string;
    department: string;
    employmentType: string;
    startDate: string;
};

export type CompanySearchResult = {
    id: number;
    name: string;
    slug: string;
    logoUrl?: string;
    tagline?: string;
    industry?: {
        name: string;
    };
};

export type TeamStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'FORMER';

export type TeamStats = {
    totalMembers: number;
    pendingRequests: number;
    verifiedMembers: number;
};