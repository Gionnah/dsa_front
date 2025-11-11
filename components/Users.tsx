"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    fetchUsers();

  }, []);

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsersData(data);
  }

  const users = [
    {
      id: 1,
      name: "John Doe",
      username: "@johncode",
      status: "Member",
      grade: "alpha",
      xp: 8450,
      matricule: "76/LA/23-24",
      color: "from-teal-500 to-blue-600",
    },
    {
      id: 2,
      name: "Sarah Lin",
      username: "@sarahdev",
      status: "Staff",
      grade: "beta",
      xp: 6120,
      matricule: "45/LA/23-24",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 3,
      name: "Alex Carter",
      username: "@carterx",
      status: "Member",
      grade: "beta",
      xp: 1850,
      matricule: "12/LA/23-24",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 4,
      name: "Leila Ben",
      username: "@leilacode",
      status: "Member",
      grade: "alpha",
      xp: 4970,
      matricule: "91/LA/23-24",
      color: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen text-gray-100 px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Utilisateurs</h1>
          <p className="text-gray-400">
            Gérez les membres, rôles et niveaux d’expérience de la plateforme.
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none">
          <option>Tous les rôles</option>
          <option>Admin</option>
          <option>Modérateur</option>
          <option>Membre</option>
        </select>
        <select className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none">
          <option>Tous les statuts</option>
          <option>En ligne</option>
          <option>Hors ligne</option>
        </select>
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* Table des utilisateurs */}
      <div className="overflow-x-auto rounded-xl border border-neutral-700 bg-neutral-800">
        <table className="min-w-full divide-y divide-neutral-700">
          <thead className="bg-neutral-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Matricule
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                XP
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-neutral-700/40 transition-colors"
              >
                <td className="px-6 py-4 flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-linear-to-br ${user.color} flex items-center justify-center font-bold text-white`}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.username}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold`}
                  >
                    {user.matricule}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{user.grade}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{user.status}</td>
                <td className="px-6 py-4 text-sm text-teal-400 font-semibold">
                  {user.xp.toLocaleString()} XP
                </td>

                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-blue-400 hover:text-blue-500 text-sm font-medium">
                    Show profil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
