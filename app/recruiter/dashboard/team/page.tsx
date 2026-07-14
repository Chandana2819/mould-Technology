// app/recruiter/dashboard/team/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { getPendingRequests, getTeamMembers, approveMember, rejectMember } from '@/lib/teamService';
import { TeamMember } from '@/types/team';
import PendingRequestCard from '@/components/teams/PendingRequestCard'
import TeamMemberCard from '@/components/teams/TeamMemberCard';

export default function RecruiterTeamPage() {
    const [activeTab, setActiveTab] = useState<'pending' | 'members'>('pending');
    const [pendingRequests, setPendingRequests] = useState<TeamMember[]>([]);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const [pendingData, membersData] = await Promise.all([
                getPendingRequests(),
                getTeamMembers(),
            ]);

            setPendingRequests(pendingData);
            setMembers(membersData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleApprove = async (id: number) => {
        try {
            await approveMember(id);
            await loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleReject = async (id: number, reason: string) => {
        try {
            await rejectMember(id, reason);
            await loadData();
        } catch (err: any) {
            alert(err.message);
        }
    };

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
                    <h1 className="text-3xl font-bold">Team Management</h1>
                    <p className="text-gray-500 mt-1">
                        Manage team members and pending requests
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                >
                    🔄 Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="border-b border-gray-200">
                <nav className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-4 px-1 border-b-2 transition ${activeTab === 'pending'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Pending Requests ({pendingRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`pb-4 px-1 border-b-2 transition ${activeTab === 'members'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Team Members ({members.length})
                    </button>
                </nav>
            </div>

            <div className="space-y-4">
                {activeTab === 'pending' && (
                    <>
                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">No pending requests</p>
                            </div>
                        ) : (
                            pendingRequests.map((request) => (
                                <PendingRequestCard
                                    key={request.id}
                                    request={request}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                />
                            ))
                        )}
                    </>
                )}

                {activeTab === 'members' && (
                    <>
                        {members.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">No team members yet</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {members.map((member) => (
                                    <TeamMemberCard key={member.id} member={member} showCompany />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}