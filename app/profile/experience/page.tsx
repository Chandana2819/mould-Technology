// app/profile/experience/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanySearch from '@/components/teams/CompanySearch';
import TeamStatusBadge from '@/components/teams/TeamStatusBadge';
import { requestToJoinCompany, getMyTeam } from '@/lib/teamService';
import { CompanySearchResult, TeamMember } from '@/types/team';

export default function ExperiencePage() {
    const router = useRouter();
    const [step, setStep] = useState<'search' | 'form' | 'status'>('search');
    const [selectedCompany, setSelectedCompany] = useState<CompanySearchResult | null>(null);
    const [teamStatus, setTeamStatus] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        designation: '',
        department: '',
        employmentType: 'FULL_TIME',
        startDate: '',
    });

    useEffect(() => {
        loadTeamStatus();
    }, []);

    async function loadTeamStatus() {
        try {
            const data = await getMyTeam();
            setTeamStatus(data);
            if (data) {
                setStep('status');
            }
        } catch (error) {
            console.error('Failed to load team status:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCompanySelect = (company: CompanySearchResult) => {
        setSelectedCompany(company);
        setStep('form');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompany) return;

        setSubmitting(true);
        try {
            await requestToJoinCompany({
                companyId: selectedCompany.id,
                ...formData,
            });
            alert('Request submitted successfully!');
            router.push('/profile/experience');
        } catch (error: any) {
            alert(error.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (step === 'status' && teamStatus) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Your Team Status</h1>

                <div className="bg-white rounded-xl border p-6">
                    <div className="flex items-center gap-4 mb-4">
                        {teamStatus.company.logoUrl && (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                <img
                                    src={teamStatus.company.logoUrl}
                                    alt={teamStatus.company.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold">{teamStatus.company.name}</h2>
                            <p className="text-gray-600">{teamStatus.designation}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">Status</span>
                            <TeamStatusBadge status={teamStatus.status} />
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">Department</span>
                            <span className="font-medium">{teamStatus.department}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <span className="text-gray-600">Employment Type</span>
                            <span className="font-medium">{teamStatus.employmentType}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-gray-600">Start Date</span>
                            <span className="font-medium">
                                {new Date(teamStatus.startDate).toLocaleDateString()}
                            </span>
                        </div>
                        {teamStatus.rejectionReason && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">
                                    <strong>Rejection Reason:</strong> {teamStatus.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Company Experience</h1>

            {step === 'search' && (
                <div className="space-y-6">
                    <p className="text-gray-600">
                        Search for your company to request verification of your employment.
                    </p>
                    <CompanySearch onSelect={handleCompanySelect} />
                </div>
            )}

            {step === 'form' && selectedCompany && (
                <div>
                    <button
                        onClick={() => setStep('search')}
                        className="text-blue-600 hover:underline mb-6 flex items-center gap-2"
                    >
                        ← Back to search
                    </button>

                    <div className="bg-white rounded-xl border p-6">
                        <div className="flex items-center gap-4 mb-6">
                            {selectedCompany.logoUrl && (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                    <img
                                        src={selectedCompany.logoUrl}
                                        alt={selectedCompany.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl font-semibold">{selectedCompany.name}</h2>
                                {selectedCompany.tagline && (
                                    <p className="text-gray-500 text-sm">{selectedCompany.tagline}</p>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Designation <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    placeholder="e.g., Senior Software Engineer"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="e.g., Engineering"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.employmentType}
                                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERNSHIP">Internship</option>
                                    <option value="FREELANCE">Freelance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}