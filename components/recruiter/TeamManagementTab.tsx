// components/recruiter/TeamManagementTab.tsx

'use client';

import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, RefreshCw, Mail, Building2 } from 'lucide-react';
import TeamStatusBadge from '@/components/teams/TeamStatusBadge';

type TeamMember = {
    id: number;
    userId: number;
    designation: string;
    department?: string;
    employmentType?: string;
    startDate?: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'FORMER';
    rejectionReason?: string;
    createdAt: string;
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

export default function TeamManagementTab() {
    const [activeTab, setActiveTab] = useState<'pending' | 'members'>('pending');
    const [pendingRequests, setPendingRequests] = useState<TeamMember[]>([]);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            console.log('🔍 Fetching team data...');

            // Fetch pending requests
            const pendingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team/pending`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!pendingRes.ok) {
                throw new Error(`Failed to fetch pending requests: ${pendingRes.status}`);
            }

            const pendingData = await pendingRes.json();
            console.log('📦 Pending data:', pendingData);

            // Handle different response formats
            let pending = [];
            if (Array.isArray(pendingData)) {
                pending = pendingData;
            } else if (pendingData?.data && Array.isArray(pendingData.data)) {
                pending = pendingData.data;
            } else if (pendingData?.pending && Array.isArray(pendingData.pending)) {
                pending = pendingData.pending;
            } else if (pendingData?.requests && Array.isArray(pendingData.requests)) {
                pending = pendingData.requests;
            } else {
                pending = [];
            }

            setPendingRequests(pending);
            console.log(`✅ Set ${pending.length} pending requests`);

            // Fetch team members
            const membersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team/members`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!membersRes.ok) {
                throw new Error(`Failed to fetch members: ${membersRes.status}`);
            }

            const membersData = await membersRes.json();
            console.log('📦 Members data:', membersData);

            let members = [];
            if (Array.isArray(membersData)) {
                members = membersData;
            } else if (membersData?.data && Array.isArray(membersData.data)) {
                members = membersData.data;
            } else if (membersData?.members && Array.isArray(membersData.members)) {
                members = membersData.members;
            } else {
                members = [];
            }

            setMembers(members);
            console.log(`✅ Set ${members.length} members`);

        } catch (err: any) {
            console.error('❌ Error loading team data:', err);
            setError(err.message || 'Failed to load data');
            setPendingRequests([]);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(id: number) {
        setProcessingId(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team/${id}/approve`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to approve');
            }

            await loadData();
        } catch (err: any) {
            alert(err.message || 'Failed to approve member');
        } finally {
            setProcessingId(null);
        }
    }

    async function handleReject() {
        if (!selectedRequestId || !rejectionReason.trim()) {
            alert('Please provide a reason');
            return;
        }

        setProcessingId(selectedRequestId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/team/${selectedRequestId}/reject`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ rejectionReason }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to reject');
            }

            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedRequestId(null);
            await loadData();
        } catch (err: any) {
            alert(err.message || 'Failed to reject member');
        } finally {
            setProcessingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Verify employee requests and manage team members</p>
                </div>
                <button
                    onClick={loadData}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                >
                    <RefreshCw size={18} /> Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                    ❌ {error}
                </div>
            )}

            <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-4 px-1 border-b-2 transition flex items-center gap-2 ${activeTab === 'pending'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Clock size={18} />
                        Pending Requests
                        {pendingRequests.length > 0 && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                                {pendingRequests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`pb-4 px-1 border-b-2 transition flex items-center gap-2 ${activeTab === 'members'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Users size={18} />
                        Team Members
                        {members.length > 0 && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                                {members.length}
                            </span>
                        )}
                    </button>
                </nav>
            </div>

            <div className="space-y-4">
                {activeTab === 'pending' && (
                    <>
                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <div className="text-4xl mb-3">✅</div>
                                <p className="text-gray-500">No pending requests</p>
                                <p className="text-sm text-gray-400 mt-1">When candidates request to join, they'll appear here</p>
                            </div>
                        ) : (
                            pendingRequests.map((request) => (
                                <div key={request.id} className="bg-white rounded-xl border p-6 hover:shadow-md transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                                {request.user.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{request.user.fullName}</h3>
                                                <p className="text-gray-600 text-sm">{request.designation}</p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {request.department && (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                                                            {request.department}
                                                        </span>
                                                    )}
                                                    {request.employmentType && (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs">
                                                            {request.employmentType.replace('_', ' ')}
                                                        </span>
                                                    )}
                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                                        ⏳ Pending
                                                    </span>
                                                </div>
                                                {request.user.email && (
                                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                        <Mail size={12} /> {request.user.email}
                                                    </p>
                                                )}
                                                {request.company && (
                                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                        <Building2 size={12} /> {request.company.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(request.id)}
                                                disabled={processingId === request.id}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
                                            >
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedRequestId(request.id);
                                                    setShowRejectModal(true);
                                                }}
                                                disabled={processingId === request.id}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                                            >
                                                <XCircle size={16} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}

                {activeTab === 'members' && (
                    <>
                        {members.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <div className="text-4xl mb-3">👥</div>
                                <p className="text-gray-500">No team members yet</p>
                                <p className="text-sm text-gray-400 mt-1">Approved team members will appear here</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {members.map((member) => (
                                    <div key={member.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                                {member.user.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{member.user.fullName}</h4>
                                                <p className="text-sm text-gray-600">{member.designation}</p>
                                                {member.department && (
                                                    <span className="text-xs text-gray-500">{member.department}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Reject Request</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for rejecting this request.</p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Reason for rejection..."
                            className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleReject}
                                disabled={processingId !== null}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                {processingId === selectedRequestId ? 'Processing...' : 'Confirm Rejection'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setSelectedRequestId(null);
                                }}
                                className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}