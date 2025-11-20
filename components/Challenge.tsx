"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChallengesPage() {
  const [challengesData, setChallengesData] = useState<any[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const getChallenges = async () => {
    try {
      const response = await fetch('/api/challenges', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setChallengesData(data);
      setFilteredChallenges(data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  }

  // Filter challenges based on search term and difficulty
  useEffect(() => {
    let filtered = challengesData;
    
    if (searchTerm) {
      filtered = filtered.filter(challenge => 
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(challenge => 
        challenge.difficulty === difficultyFilter
      );
    }
    
    setFilteredChallenges(filtered);
  }, [searchTerm, difficultyFilter, challengesData]);

  useEffect(() => {
    getChallenges();
  }, []);

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return (
          <div className="flex gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
          </div>
        );
      case "medium":
        return (
          <div className="flex gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
          </div>
        );
      case "hard":
        return (
          <div className="flex gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (challenge: any) => {
    if (challenge.join && challenge.status === "in_progress") {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          In Progress
        </span>
      );
    } else if (challenge.join) {
      return (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Joined
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen text-gray-800 px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-blue-950 mb-2">Challenges List</h1>
          <p className="text-gray-600">Test your skills with these coding challenges</p>
        </div> 
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select 
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="border border-neutral-200 focus:shadow focus:shadow-blue-300 focus:border-blue-500 transition-all duration-300 ease-in-out rounded-lg px-4 py-2 text-sm focus:outline-none"
        >
          <option value="all">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        
        <input
          type="text"
          placeholder="Search for a challenge..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 focus:shadow focus:shadow-blue-300 focus:border-blue-500 transition-all duration-300 ease-in-out border border-neutral-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* Challenges Grid */}
      <div className="space-y-4">
        {filteredChallenges && filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <Link 
              href={`/challenges/${challenge.id}`}
              key={challenge.id}
              className="bg-white border border-neutral-300 rounded-xl p-6 flex flex-col justify-between card-hover hover:border-blue-500 transition shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{challenge.title}</h3>
                    {getStatusBadge(challenge)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      {challenge.test_cases_count} test cases
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {challenge.participants_count} participants
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-semibold ${
                    challenge.difficulty === "easy"
                      ? "text-green-500"
                      : challenge.difficulty === "medium"
                      ? "text-amber-500"
                      : "text-red-500"
                  }`}>
                    {getDifficultyIcon(challenge.difficulty)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Created: {new Date(challenge.created_at).toLocaleDateString('en-US')}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-blue-600 font-semibold">+{challenge.xp_reward} XP</p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full text-center text-gray-500 py-12">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-lg font-medium">No challenges found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}