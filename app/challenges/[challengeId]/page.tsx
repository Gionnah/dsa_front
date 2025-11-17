"use client"
import HomeLayout from '@/components/layout/HomeLayout'
import Link from 'next/link'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react'

export default function OneChallenge() {
    const { challengeId } = useParams<{challengeId: string}>();
    const [challengeData, setChallengesData] = useState<any>([]);
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
    }

    const joinChallenge = async () => {
        const response = await fetch(`/api/challenges/${challengeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setChallengesData(data);
    }

    useEffect(() => {
        getChallenges();
    }, [])
    
    if (challengeData?.details) {   
        return (
        <HomeLayout>
            <div>404</div>
        </HomeLayout>
        );
    }

    const   getDifficultyIcon = (difficulty: string) => {
        const icon = (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
        );

        switch(difficulty) {
            case "easy":
                return <div className="flex gap-1">{icon}</div>;
            case "medium":
                return <div className="flex gap-1">{icon}{icon}</div>;
            case "hard":
                return <div className="flex gap-1">{icon}{icon}{icon}</div>;
            default:
                return <div className="flex gap-1">{icon}</div>;
        }
    };

    return (
        <div>
            <HomeLayout>
                {/* Header Section */}
                <div className={`flex items-center justify-between w-full px-4 py-6 bg-linear-to-b ${
                    challengeData.difficulty === "easy" ? "from-cyan-900" 
                    : challengeData.difficulty === "medium" ? "from-amber-900" 
                    : "from-red-900"
                } to-black shadow-2xl`}>
                    <section className="relative flex rounded-sm px-8 mb-4 overflow-hidden animate-slide-in">
                        <div className="relative w-full z-10 flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center border-2 border-white/30 shadow-lg">
                                    <div className="text-4xl font-bold text-white">
                                        <div className="flex items-center justify-between">
                                            <div className='relative w-20 h-20'>
                                                <div className="absolute top-0 right-0 w-full h-full">
                                                    <img className="h-full w-full object-cover object-center" src="/golden_challenge.png" alt="Challenge Icon"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{challengeData?.title}</h3>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`text-sm font-semibold ${
                                                challengeData.difficulty === "easy" ? "text-cyan-300" 
                                                : challengeData.difficulty === "medium" ? "text-amber-300" 
                                                : "text-red-300"
                                            }`}>
                                                {getDifficultyIcon(challengeData.difficulty)}
                                            </div>
                                            <span className="text-white/70 text-sm capitalize">{challengeData.difficulty}</span>
                                        </div>
                                        <span className="text-white/50">•</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white/90 font-semibold">{challengeData?.xp_reward} XP</span>
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="button">
                        {challengeData && challengeData?.join ? (
                             <Link href={`/editor/${challengeData.id}`} className="mt-2 px-4 py-2 text-sm rounded-lg hover:scale-105 transition inline-block font-semibold text-white shadow-lg">
                                <span className="inline-flex items-center rounded-lg bg-gray-400/10 px-4 py-2 text-sm font-medium text-gray-100 inset-ring inset-ring-gray-400/20">
                                    Go to editor
                                </span>
                            </Link>
                        ) : (
                            <button onClick={joinChallenge} className="mt-2 cursor-pointer px-4 py-2 text-sm rounded-lg hover:scale-105 transition inline-block font-semibold text-white shadow-lg">
                                <span className="inline-flex items-center rounded-lg bg-gray-400/10 px-4 py-2 text-sm font-medium text-gray-100 inset-ring inset-ring-gray-400/20">
                                    Join challenge
                                </span>
                            </button>
                        )}
                       
                    </div>
                </div>

                {/* Content Section */}
                <div className="m-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Description & Tests */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tab Navigation */}
                        <div className="rounded-lg py-2 px-2 shadow-lg">
                            <div className="flex space-x-2 p-1 bg-black/30 rounded-md">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`flex-1 py-2 px-2 rounded-md text-center font-semibold transition-all duration-200 ${
                                        activeTab === 'description' 
                                        ? 'bg-linear-to-r from-neutral-600 to-gray-600 text-white shadow-lg' 
                                        : 'text-gray-300 hover:text-white hover:bg-neutral-700'
                                    }`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('tests')}
                                    className={`flex-1 py-2 px-2 rounded-md text-center font-semibold transition-all duration-200 ${
                                        activeTab === 'tests' 
                                        ? 'bg-linear-to-r from-gray-600 to-neutral-600 text-white shadow-lg' 
                                        : 'text-gray-300 hover:text-white hover:bg-neutral-700'
                                    }`}
                                >
                                    Tests
                                </button>
                            </div>
                        </div>

                        {/* Content based on active tab */}
                        {activeTab === 'description' ? (
                            <div className="bg-neutral-800 shadow-2xl shadow-black rounded-lg p-6 border border-white/10">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="bg-neutral-400 bg-clip-text text-transparent">
                                            Description
                                        </span>
                                    </h2>
                                    <div className="prose prose-invert max-w-none">
                                        <div className="text-gray-300 whitespace-pre-line leading-relaxed text-lg">
                                            {challengeData?.description?.split('##').map((section: string, index: number) => {
                                                if (index === 0) return (
                                                    <p key={index} className="text-white text-xl mb-6 font-light">
                                                        {section.trim()}
                                                    </p>
                                                );
                                                
                                                const [title, ...content] = section.split('\n');
                                                return (
                                                    <div key={index} className="mb-6">
                                                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                                            <span className="bg-linear-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                                                                {title.trim()}
                                                            </span>
                                                        </h3>
                                                        <div className="bg-neutral-700/50 rounded-lg p-4 border-l-4 border-green-500">
                                                            {content.map((line, lineIndex) => (
                                                                <p key={lineIndex} className="text-gray-200 mb-2 last:mb-0">
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
                            <div className="bg-neutral-800 shadow-2xl shadow-black rounded-lg p-6 border border-white/10">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="bg-neutral-400 bg-clip-text text-transparent">
                                        Test
                                    </span>
                                </h2>
                                
                                <div className="space-y-4">
                                    {challengeData?.test_cases?.map((testCase: any, index: number) => (
                                        <div key={testCase.id} className="bg-neutral-700/50 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-white flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                                                        {index + 1}
                                                    </span>
                                                    Test Case {index + 1}
                                                </h4>
                                                {testCase.is_sample && (
                                                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                                                        Example
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                                        📥 Input
                                                    </label>
                                                    <div className="bg-black/50 whitespace-pre rounded p-3 font-mono text-sm text-gray-200 min-h-[60px] border border-white/10">
                                                        {testCase.input_content || "Aucune donnée d'entrée"}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                                        📤 Output
                                                    </label>
                                                    <div className="bg-black/50 whitespace-pre rounded p-3 font-mono text-sm text-gray-200 min-h-[60px] border border-white/10">
                                                        {testCase.output_content || "Aucune donnée de sortie"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Template & Input */}
                    <div className="space-y-6">
                        {/* Code Template */}
                        <div className="bg-neutral-800 rounded-lg p-6 shadow-2xl shadow-black border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="bg-linear-to-r text-sm from-gray-100 to-neutral-300 bg-clip-text text-transparent">
                                    Number of challenger:
                                </span>
                            </h3>
                            <div className="bg-black/20 rounded-lg p-4 border border-orange-500/30">
                                <div className="space-y-4">
                                    {/* Participant List */}
                                    <div className="">
                                        <p>
                                            {challengeData?.participants_count}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl mt-4 font-bold text-white mb-4 flex items-center gap-2">
                                <span className="bg-linear-to-r text-sm from-gray-100 to-neutral-300 bg-clip-text text-transparent">
                                    Created at:
                                </span>
                            </h3>
                            <div className="bg-black/20 rounded-lg p-4 border border-orange-500/30">
                                <div className="space-y-4">
                                    {/* Participant List */}
                                    <div className="">
                                        <p>
                                            {new Date(challengeData?.created_at).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </HomeLayout>
        </div>
    )
}