"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ChallengesPage() {
  const [challengesData, setChallengesData] = useState<any[]>([]);
  const challenges = [
    {
      id: 1,
      title: "FizzBuzz Reborn",
      difficulty: "Facile",
      language: "JavaScript",
      participants: 152,
      xp: 50,
      tag: "Logic",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 2,
      title: "Palindrome Detector",
      difficulty: "Moyen",
      language: "Python",
      participants: 98,
      xp: 120,
      tag: "Strings",
      color: "from-blue-500 to-blue-700",
    },
    {
      id: 3,
      title: "Matrix Rotation",
      difficulty: "Difficile",
      language: "C++",
      participants: 56,
      xp: 250,
      tag: "Algorithm",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 4,
      title: "Data Parser 2.0",
      difficulty: "Moyen",
      language: "Java",
      participants: 74,
      xp: 150,
      tag: "Parsing",
      color: "from-teal-500 to-cyan-600",
    },
  ];

  const getChallenges = async () => {
      const response = await fetch('/api/challenges', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setChallengesData(data);
  }

  useEffect(() => {
    getChallenges();
  }, []);

  return (
    <div className="min-h-screen  text-gray-800 px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-blue-950 mb-2">Challenges list</h1>
        </div> 
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select className="border border-neutral-200 focus:shadow focus:shadow-pink-300 focus:border-blue-500 transition-all duration-300 ease-in-out rounded-lg px-4 py-2 text-sm focus:outline-none">
          <option>All level</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select className="border border-neutral-200 focus:shadow focus:shadow-pink-300 focus:border-blue-500 transition-all duration-300 ease-in-out rounded-lg px-4 py-2 text-sm focus:outline-none">
          <option>All grade</option>
          <option>Alpha</option>
          <option>Beta</option>
          <option>Gama</option>
        </select>
        <input
          type="text"
          placeholder="Rechercher un challenge..."
          className="flex-1 focus:shadow focus:shadow-pink-300 focus:border-blue-500 transition-all duration-300 ease-in-out border border-neutral-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* Challenges Grid */}
      <div className="space-y-4 grid">
        {challengesData && challengesData?.length > 0 ? challengesData?.map((c) => (
          <Link href={`/challenges/${c.id}`}
            key={c.id}
            className="bg-indigo-50/20 border border-neutral-300 rounded-xl p-6 flex flex-col justify-between card-hover hover:border-teal-500 transition"
          >
            <div className="flex justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">{c.title}</h3>
                </div>
                {/* <p className="text-xs text-gray-500">
                  Created at {new Date(c.created_at).toLocaleDateString('fr-FR')}
                </p> */}
                 <div>
                <div className={`text-sm font-semibold ${
                    c.difficulty === "easy"
                      ? "text-cyan-500"
                      : c.difficulty === "medium"
                      ? "text-amber-500"
                      : "text-red-500"
                  }`}
                >
                  {c.difficulty === "easy"
                      ? (
                        <div className="">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                        </div>
                      )
                      : c.difficulty === "medium"
                      ? (
                        <div className="flex gap-1">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                        </div>
                      )
                      : (
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
                      )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
            
              <div className="text-right">
                  <p className="text-sm text-teal-400 font-semibold">+{c.xp_reward} XP</p>
                  {/* <button className="mt-2 text-white px-3 py-1 bg-linear-to-r from-teal-500 to-blue-600 text-xs rounded-lg hover:scale-105 transition">
                    Click to view details
                  </button> */}
              </div>
              <p className="text-xs text-gray-500">
                Created at {new Date(c.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </Link>
        )) : <div className="w-full text-center text-gray-500 col-span-full">No challenges available. </div>}
      </div>
    </div>
  );
}
