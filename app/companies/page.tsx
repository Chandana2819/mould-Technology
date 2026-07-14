// app/companies/[slug]/team/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCompanyTeam } from '@/lib/teamService';
import { TeamMember } from '@/types/team';
import TeamMemberCard from '@/components/teams/TeamMemberCard';

export default function CompanyTeamPage() {
    const { slug } = useParams();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadTeam();
    }, [slug]);

    async function loadTeam() {
        try {
            setLoading(true);
            setError(null);
            const data = await getCompanyTeam(slug as string);
            setMembers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No team members to display</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Our Team</h1>
            <div className="grid gap-4">
                {members.map((member) => (
                    <TeamMemberCard key={member.id} member={member} showCompany={false} />
                ))}
            </div>
        </div>
    );
}