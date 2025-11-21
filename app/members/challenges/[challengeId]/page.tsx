"use client"
import HomeLayout from '@/components/layout/HomeLayout'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react'

export default function OneChallenge() {
    const { challengeId } = useParams<{challengeId: string}>();
    const [challengeData, setChallengesData] = useState<any>([]);
    const [isJoin, setIsJoin] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'description' | 'tests'>('description');

    const getChallenges = async () => {
        const response = await fetch(`/api/challenges/${challengeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setChallengesData(data);
        setIsJoin(data.join || false);
    }

    const joinChallenge = async () => {
        const response = await fetch(`/api/challenges/${challengeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setIsJoin(data.message || false)
    }

    useEffect(() => {
        getChallenges();
    }, [isJoin])
    
    if (challengeData?.details) {   
        return (
        <HomeLayout>
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-300">404</h1>
                    <p className="text-gray-600 mt-2">Challenge not found</p>
                </div>
            </div>
        </HomeLayout>
        );
    }

    const getDifficultyIcon = (difficulty: string) => {
        const icon = (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
        );

        switch(difficulty) {
            case "easy":
                return <div className="flex gap-0.5">{icon}</div>;
            case "medium":
                return <div className="flex gap-0.5">{icon}{icon}</div>;
            case "hard":
                return <div className="flex gap-0.5">{icon}{icon}{icon}</div>;
            default:
                return <div className="flex gap-0.5">{icon}</div>;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch(difficulty) {
            case "easy":
                return "text-emerald-600 bg-emerald-50 border-emerald-200";
            case "medium":
                return "text-amber-600 bg-amber-50 border-amber-200";
            case "hard":
                return "text-rose-600 bg-rose-50 border-rose-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            <HomeLayout>
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                {/* Icon */}
                                <div className="w-20 h-20 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <img 
                                        className="w-12 h-12 object-contain" 
                                        src="/golden_challenge.png" 
                                        alt="Challenge Icon"
                                    />
                                </div>
                                
                                {/* Info */}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {challengeData?.title}
                                    </h1>
                                    <div className="flex items-center gap-4">
                                        {/* Difficulty Badge */}
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getDifficultyColor(challengeData.difficulty)}`}>
                                            {getDifficultyIcon(challengeData.difficulty)}
                                            <span className="capitalize">{challengeData.difficulty}</span>
                                        </div>
                                        
                                        {/* XP Reward */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span>{challengeData?.xp_reward} XP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div>
                                {isJoin ? (
                                    <Link 
                                        href={`/members/editor/${challengeData.id}`} 
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                        Go to editor
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={joinChallenge} 
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Join challenge
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Description & Tests */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Tab Navigation */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                            activeTab === 'description' 
                                            ? 'bg-indigo-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        Description
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tests')}
                                        className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                            activeTab === 'tests' 
                                            ? 'bg-indigo-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        Tests
                                    </button>
                                </div>
                            </div>

                            {/* Content based on active tab */}
                            {activeTab === 'description' ? (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Description
                                    </h2>
                                    <div className="prose prose-gray max-w-none">
                                        <div className="text-gray-700 leading-relaxed space-y-4">
                                            {challengeData?.description?.split('##').map((section: string, index: number) => {
                                                if (index === 0) return (
                                                    <p key={index} className="text-gray-800 text-lg">
                                                        {section.trim()}
                                                    </p>
                                                );
                                                
                                                const [title, ...content] = section.split('\n');
                                                return (
                                                    <div key={index} className="mt-6">
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                                            {title.trim()}
                                                        </h3>
                                                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
                                                            {content.map((line, lineIndex) => (
                                                                <p key={lineIndex} className="text-gray-700 mb-2 last:mb-0">
                                                                    {line.trim()}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                        Test Cases
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        {challengeData?.test_cases?.map((testCase: any, index: number) => (
                                            <div 
                                                key={testCase.id} 
                                                className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                            {index + 1}
                                                        </span>
                                                        Test Case {index + 1}
                                                    </h4>
                                                    {testCase.is_sample && (
                                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                                                            Example
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                            <span className="text-lg">📥</span> Input
                                                        </label>
                                                        <div className="bg-white rounded-md p-3 font-mono text-sm text-gray-800 min-h-[60px] border border-gray-200 whitespace-pre-wrap">
                                                            {testCase.input_content || "No input data"}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                            <span className="text-lg">📤</span> Expected Output
                                                        </label>
                                                        <div className="bg-white rounded-md p-3 font-mono text-sm text-gray-800 min-h-[60px] border border-gray-200 whitespace-pre-wrap">
                                                            {testCase.output_content || "No output data"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Stats */}
                        <div className="space-y-6">
                            {/* Participants Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Participants
                                    </h3>
                                </div>
                                <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                                    <p className="text-3xl font-bold text-indigo-600">
                                        {challengeData?.participants_count || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        challengers enrolled
                                    </p>
                                </div>
                            </div>
                            
                            {/* Created At Card */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Created
                                    </h3>
                                </div>
                                <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
                                    <p className="text-xl font-semibold text-emerald-700">
                                        {new Date(challengeData?.created_at).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </HomeLayout>
        </div>
    )
}