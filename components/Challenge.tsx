"use client";

import Link from "next/link";

export default function ChallengesPage() {
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

  return (
    <div className="min-h-screen  text-gray-100 px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Challenges list</h1>
          <p className="text-gray-400">
            Teste tes compétences et gagne de l’expérience à chaque défi.
          </p>
        </div> 
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none">
          <option>All level</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none">
          <option>All grade</option>
          <option>Alpha</option>
          <option>Beta</option>
          <option>Gama</option>
        </select>
        <input
          type="text"
          placeholder="Rechercher un challenge..."
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* Challenges Grid */}
      <div className="space-y-4 grid">
        {challenges.map((c) => (
          <Link href={`/challenges/challengeId`}
            key={c.id}
            className="border bg-black/20 border-neutral-700 rounded-xl p-6 flex flex-col justify-between card-hover hover:border-teal-500 transition"
          >
            <div className="flex justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                    <p className="text-gray-400 text-sm mb-1">
                        Langage : <span className="text-white">{c.language}</span>
                    </p>
                </div>
                <p className="text-xs text-gray-500">{c.participants} participants</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className={`text-sm font-semibold ${
                    c.difficulty === "Facile"
                      ? "text-cyan-500"
                      : c.difficulty === "Moyen"
                      ? "text-amber-500"
                      : "text-red-500"
                  }`}
                >
                  {c.difficulty === "Facile"
                      ? (
                        <div className="">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                        </div>
                      )
                      : c.difficulty === "Moyen"
                      ? (
                        <div className="flex gap-1">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                        </div>
                      )
                      : (
                        <div className="flex gap-1">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                                </svg>
                        </div>
                      )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-teal-400 font-semibold">+{c.xp} XP</p>
                <button className="mt-2 px-3 py-1 bg-linear-to-r from-teal-500 to-blue-600 text-xs rounded-lg hover:scale-105 transition">
                  Start
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
