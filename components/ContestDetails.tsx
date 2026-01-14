"use client";

import { useEffect, useMemo, useState } from "react";

// =============================
// Types (depuis ton API)
// =============================

type ContestDetails = {
  id: number;
  title: string;
  date_debut: string;
  date_fin: string;
  statut: "upcoming" | "ongoing" | "finished" | string;
  status_display: string;
  is_ongoing: boolean;
  is_finished: boolean;
  has_started: boolean;
};

type Team = {
  id: number;
  nom: string;
  xp_total: number;
  temps_total: number;
  membres_count: number;
  rank: number;
};

type Challenge = {
  id: number;
  title: string;
  points: number;
};

type ContestData = {
  details: ContestDetails;
  challenges?: {
    challenges: Challenge[];
  };
  leaderboard?: {
    leaderboard: Team[];
  };
};

// =============================
// Utils
// =============================

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// =============================
// Component
// =============================

export default function ContestPage({ contestData }: { contestData: ContestData }) {
  const { details, challenges, leaderboard } = contestData;

  if (!details) {
    return <p className="text-center p-6">Chargement du contest…</p>;
  }

  const start = useMemo(
    () => new Date(details.date_debut).getTime(),
    [details.date_debut]
  );
  const end = useMemo(
    () => new Date(details.date_fin).getTime(),
    [details.date_fin]
  );

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const countdown = useMemo(() => {
    if (!details.has_started) return start - now;
    if (details.is_ongoing) return end - now;
    return 0;
  }, [now, start, end, details]);

  const showChallenges = details.is_ongoing || details.is_finished;
  const showLeaderboard = details.is_ongoing || details.is_finished;

  return (
    <div className="mx-auto p-6 space-y-6">
      {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow p-6">
            <h1 className="text-3xl font-bold">{details.title}</h1>
            <p className="opacity-90">Statut : {details.status_display}</p>

            <div className="mt-6 text-lg">
                {!details.has_started && (
                <p>Début dans : {formatDuration(countdown)}</p>
                )}
                {details.is_ongoing && (
                <p>Temps restant : {formatDuration(countdown)}</p>
                )}
                {details.is_finished && <p>Contest terminé</p>}
            </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-bold text-blue-600">Équipe</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Équipes</p>
                    <p className="font-bold text-green-600">
                    {leaderboard?.leaderboard?.length ?? 0}
                    </p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Challenges */}
        {showChallenges && (
            <div>
                <h2 className="text-2xl font-semibold mb-4">Challenges</h2>

                {challenges && challenges.challenges?.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {challenges?.challenges?.map((c) => (
                        <div
                        key={c.id}
                        className="bg-white rounded-2xl shadow p-6"
                        >
                            <h3 className="font-semibold">{c.title}</h3>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-700">
                        Aucun challenge disponible
                    </div>
                )}
            </div>
        )}

        {/* Classement */}
        {showLeaderboard && leaderboard && (
            <div>
                <h2 className="text-2xl font-semibold my-4">Classement</h2>

                <div className="grid grid-cols-1 gap-6">
                    {leaderboard.leaderboard.map((team) => (
                    <div
                        key={team.id}
                        className="bg-white rounded-2xl shadow p-6 flex justify-between"
                    >
                        <div>
                        <p className="text-sm text-gray-500">Rang</p>
                        <p className="text-3xl font-bold text-indigo-600">#{team.rank}</p>
                        </div>
                        <div className="flex-1 px-6">
                        <p className="font-semibold">{team.nom}</p>
                        <p className="text-sm text-gray-500">{team.membres_count} membres</p>
                        </div>
                        <div className="text-right">
                        <p className="text-sm text-gray-500">XP</p>
                        <p className="font-bold text-green-600">{team.xp_total}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        )}
        </div>

    </div>
  );
}
// dsa/components/ContestDetails.tsx