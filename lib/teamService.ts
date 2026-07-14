// services/teamService.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function requestToJoinCompany(data: {
    companyId: number;
    designation: string;
    department: string;
    employmentType: string;
    startDate: string;
}) {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE}/api/team/request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to submit request');
    }

    return res.json();
}

export async function getMyTeam() {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE}/api/team/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch team status');
    }

    return res.json();
}

export async function getPendingRequests(companyId?: number) {
    const token = localStorage.getItem('token');
    const url = companyId
        ? `${API_BASE}/api/team/pending?companyId=${companyId}`
        : `${API_BASE}/api/team/pending`;

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch pending requests');
    }

    return res.json();
}

export async function getTeamMembers(companyId?: number) {
    const token = localStorage.getItem('token');
    const url = companyId
        ? `${API_BASE}/api/team/members?companyId=${companyId}`
        : `${API_BASE}/api/team/members`;

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch team members');
    }

    return res.json();
}

export async function approveMember(teamId: number) {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE}/api/team/${teamId}/approve`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to approve member');
    }

    return res.json();
}

export async function rejectMember(teamId: number, rejectionReason: string) {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE}/api/team/${teamId}/reject`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to reject member');
    }

    return res.json();
}

export async function getCompanyTeam(slug: string) {
    const res = await fetch(`${API_BASE}/api/companies/${slug}/team`);

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch company team');
    }

    return res.json();
}

export async function searchCompanies(query: string) {
    const res = await fetch(`${API_BASE}/api/companies/search?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to search companies');
    }

    return res.json();
}