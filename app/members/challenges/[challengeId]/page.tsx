"use client"
import HomeLayout from '@/components/layout/HomeLayout'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { Loader2, FileText, Users, Calendar, Trophy, Code, CheckCircle, Clock, Download, ExternalLink, Zap, Target, Award, ArrowRight, Play } from 'lucide-react';

export default function OneChallenge() {
    const router = useRouter();
    const { challengeId } = useParams<{challengeId: string}>();
    const [challengeData, setChallengesData] = useState<any>([]);
    const [isJoin, setIsJoin] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'description' | 'tests'>('description');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
    const [hasPDF, setHasPDF] = useState<boolean>(false);
    const [pdfUrl, setPdfUrl] = useState<string>('');

    const getChallenges = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/challenges/${challengeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setChallengesData(data);
            setIsJoin(data.join || false);
            
            // Check if there's a PDF file
            if (data.pdf_url) {
                setHasPDF(true);
                setPdfUrl(data.pdf_url);
            }
        } catch (error) {
            console.error('Error fetching challenge:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const joinChallenge = async () => {
        try {
            setIsJoining(true);
            const response = await fetch(`/api/challenges/${challengeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setIsJoin(data.message || false);
        } catch (error) {
            console.error('Error joining challenge:', error);
        } finally {
            setIsJoining(false);
        }
    }

    const handleGoToEditor = () => {
        setIsRedirecting(true);
        setTimeout(() => {
            router.push(`/members/editor/${challengeData.id}`);
        }, 500);
    }

    useEffect(() => {
        getChallenges();
    }, [])

    // Redirecting Loader
    if (isRedirecting) {
        return (
            <HomeLayout>
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <div className="relative mb-8">
                            <div className="w-32 h-32 rounded-full bg-indigo-100 animate-pulse mx-auto"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
                                    <Code className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-700" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Opening Editor
                        </h2>
                        <p className="text-gray-600 mb-6">Preparing your coding environment...</p>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
                            <div className="h-full bg-indigo-600 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                </div>
            </HomeLayout>
        );
    }
    
    // Initial Loading
    if (isLoading) {
        return (
            <HomeLayout>
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-full bg-indigo-100 animate-pulse mx-auto"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Challenge</h2>
                        <p className="text-gray-600 text-sm">Please wait...</p>
                        <div className="w-48 h-1.5 bg-gray-200 rounded-full mt-6 overflow-hidden mx-auto">
                            <div className="h-full bg-indigo-600 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    // 404 Error
    if (challengeData?.details) {   
        return (
            <HomeLayout>
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-400 mb-2">404</h1>
                        <p className="text-gray-900 text-lg font-medium mb-2">Challenge not found</p>
                        <p className="text-gray-500 text-sm mb-8">The challenge you're looking for doesn't exist or has been removed.</p>
                        <Link 
                            href="/members/challenges" 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Challenges
                        </Link>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    const getDifficultyIcon = (difficulty: string) => {
        const icon = <Zap className="w-4 h-4" />;
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
                return "text-emerald-700 bg-emerald-50 border-emerald-200";
            case "medium":
                return "text-amber-700 bg-amber-50 border-amber-200";
            case "hard":
                return "text-rose-700 bg-rose-50 border-rose-200";
            default:
                return "text-gray-700 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <HomeLayout>
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex items-start gap-6">
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
                                    <img 
                                        className="w-10 h-10 object-contain" 
                                        src="/golden_challenge.png" 
                                        alt="Challenge Icon"
                                    />
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                                        {challengeData?.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Difficulty Badge */}
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${getDifficultyColor(challengeData.difficulty)}`}>
                                            {getDifficultyIcon(challengeData.difficulty)}
                                            <span className="capitalize">{challengeData.difficulty}</span>
                                        </div>
                                        
                                        {/* XP Reward */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold border border-amber-200">
                                            <Trophy className="w-4 h-4" />
                                            <span>{challengeData?.xp_reward || 100} XP</span>
                                        </div>

                                        {/* Status Badge if joined */}
                                        {isJoin && (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-200">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Enrolled</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex-shrink-0">
                                {isJoin ? (
                                    <button 
                                        onClick={handleGoToEditor}
                                        disabled={isRedirecting}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Code className="w-5 h-5" />
                                        <span>Go to Editor</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={joinChallenge}
                                        disabled={isJoining}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isJoining ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Joining...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Target className="w-5 h-5" />
                                                <span>Join Challenge</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Description & Tests */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Tab Navigation */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                            activeTab === 'description' 
                                            ? 'bg-indigo-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Description
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('tests')}
                                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                            activeTab === 'tests' 
                                            ? 'bg-indigo-600 text-white shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Tests ({challengeData?.test_cases?.length || 0})
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Content based on active tab */}
                            {activeTab === 'description' ? (
                                <div className="space-y-6">
                                    {/* PDF Viewer if available */}
                                    {hasPDF && (
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-indigo-600" />
                                                        Challenge Document
                                                    </h3>
                                                    <a 
                                                        href={pdfUrl} 
                                                        download 
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download PDF
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-gray-50">
                                                <iframe
                                                    src={pdfUrl}
                                                    className="w-full h-[700px] rounded-lg border border-gray-300"
                                                    title="Challenge PDF"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Description */}
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            Description
                                        </h2>
                                        <div className="prose prose-gray max-w-none">
                                            <div className="text-gray-700 leading-relaxed space-y-6">
                                                {challengeData?.description?.split('##').map((section: string, index: number) => {
                                                    if (index === 0) return (
                                                        <p key={index} className="text-gray-800 text-lg leading-relaxed">
                                                            {section.trim()}
                                                        </p>
                                                    );
                                                    
                                                    const [title, ...content] = section.split('\n');
                                                    return (
                                                        <div key={index} className="mt-8">
                                                            <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                                                {title.trim()}
                                                            </h3>
                                                            <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-indigo-600">
                                                                {content.map((line, lineIndex) => (
                                                                    <p key={lineIndex} className="text-gray-700 mb-3 last:mb-0 leading-relaxed">
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
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        Test Cases
                                    </h2>
                                    
                                    <div className="space-y-5">
                                        {challengeData?.test_cases?.map((testCase: any, index: number) => (
                                            <div 
                                                key={testCase.id} 
                                                className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                                            >
                                                <div className="flex items-center justify-between mb-5">
                                                    <h4 className="font-semibold text-gray-900 flex items-center gap-3">
                                                        <span className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span className="text-lg">Test Case {index + 1}</span>
                                                    </h4>
                                                    {testCase.is_sample && (
                                                        <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200">
                                                            Example
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <span className="text-base">📥</span> Input
                                                        </label>
                                                        <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-800 min-h-[80px] border border-gray-200 whitespace-pre-wrap">
                                                            {testCase.input_content || "No input data"}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                            <span className="text-base">📤</span> Expected Output
                                                        </label>
                                                        <div className="bg-white rounded-lg p-4 font-mono text-sm text-gray-800 min-h-[80px] border border-gray-200 whitespace-pre-wrap">
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
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Participants
                                    </h3>
                                </div>
                                <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                                    <p className="text-4xl font-bold text-indigo-600">
                                        {challengeData?.participants_count || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2 font-medium">
                                        challengers enrolled
                                    </p>
                                </div>
                            </div>
                            
                            {/* Created At Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Created
                                    </h3>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
                                    <p className="text-lg font-semibold text-emerald-700">
                                        {new Date(challengeData?.created_at).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2 font-medium flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {new Date(challengeData?.created_at).toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Stats Summary Card */}
                            <div className="bg-indigo-600 rounded-xl shadow-lg p-6 text-white">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5" />
                                    Quick Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <span className="text-sm font-medium">Difficulty</span>
                                        <span className="text-sm font-semibold capitalize">{challengeData?.difficulty}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <span className="text-sm font-medium">Test Cases</span>
                                        <span className="text-sm font-semibold">{challengeData?.test_cases?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <span className="text-sm font-medium">XP Reward</span>
                                        <span className="text-sm font-semibold">{challengeData?.xp_reward || 100} XP</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </HomeLayout>

            <style jsx>{`
                @keyframes loading {
                    0% { width: 0%; }
                    50% { width: 100%; }
                    100% { width: 0%; }
                }
            `}</style>
        </div>
    )
}