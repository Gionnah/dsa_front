"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {
  const [usersData, setUsersData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsersData(data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tableau de couleurs prédéfinies pour les avatars
  const colorGradients = [
    "from-teal-500 to-blue-600",
    "from-blue-500 to-indigo-600",
    "from-green-500 to-emerald-600",
    "from-amber-500 to-orange-600",
    "from-purple-500 to-pink-600",
    "from-red-500 to-orange-600",
    "from-indigo-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-blue-600",
    "from-orange-500 to-red-600",
  ];

  // Fonction pour obtenir une couleur basée sur l'ID de l'utilisateur
  const getUserColor = (userId: any) => {
    return colorGradients[userId % colorGradients.length];
  };

  // Fonction pour déterminer le grade basé sur l'XP
  const getGradeFromXP = (xp: any) => {
    if (xp >= 5000) return "alpha";
    if (xp >= 2000) return "beta";
    if (xp >= 1000) return "gamma";
    return "delta";
  };

  // Fonction pour formater le nom d'utilisateur avec @
  const formatUsername = (username: string) => {
    return username.startsWith('@') ? username : `@${username}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen text-gray-100 px-8 py-10 flex items-center justify-center">
        <div className="text-white text-lg">Chargement des utilisateurs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Utilisateurs</h1>
          <p className="text-gray-400">
            Gérez les membres, rôles et niveaux d'expérience de la plateforme.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-gray-400">
            {usersData.length} utilisateur{usersData.length > 1 ? 's' : ''} trouvé{usersData.length > 1 ? 's' : ''}
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
                Numéro d'inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Parcours
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Challenges Rejoints
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
            {usersData && usersData?.length > 0 && usersData?.map((user: any) => (
              <tr
                key={user.id}
                className="hover:bg-neutral-700/40 transition-colors"
              >
                <td className="px-6 py-4 flex items-center space-x-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-linear-to-br ${getUserColor(user.id)} flex items-center justify-center font-bold text-white`}
                  >
                    {user.prenom.charAt(0)}{user.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {user.prenom} {user.nom}
                    </p>
                    <p className="text-sm text-gray-400">
                      {formatUsername(user.username)}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-neutral-700 text-gray-300">
                    {user.numero_inscription}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {user.parcours}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {user.challenges_joined}
                </td>
                <td className="px-6 py-4 text-sm text-teal-400 font-semibold">
                  {user.total_xp.toLocaleString()} XP
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-blue-400 hover:text-blue-500 text-sm font-medium">
                    Voir profil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usersData.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          Aucun utilisateur trouvé.
        </div>
      )}
    </div>
  );
}