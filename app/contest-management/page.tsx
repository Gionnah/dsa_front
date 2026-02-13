// "use client"
// import { useState, useRef } from 'react';
// import { 
//   Plus, Edit2, Trash2, Search, X, Check, Upload, FileCode,
//   Terminal, Download, Eye, Code2, Zap, Trophy, Layers, File, Filter
// } from 'lucide-react';

// export default function ChallengeAdminInterface() {
//   const [challenges, setChallenges] = useState([
//     {
//       id: 1,
//       titre: 'Challenge React Avancé',
//       description: 'Créer une application de gestion de tâches avec React Hooks et Context API',
//       difficulte: 'Intermédiaire',
//       points: 150,
//       categorie: 'Frontend',
//       statut: 'Actif',
//       dateCreation: '2024-01-15',
//       fichierOutput: null,
//       fichierInput: null,
//       fichierSolution: null
//     },
//     {
//       id: 2,
//       titre: 'API REST avec Node.js',
//       description: 'Développer une API RESTful complète avec authentification JWT',
//       difficulte: 'Avancé',
//       points: 200,
//       categorie: 'Backend',
//       statut: 'Actif',
//       dateCreation: '2024-01-20',
//       fichierOutput: { name: 'expected-output.json', size: 2048 },
//       fichierInput: { name: 'test-data.json', size: 1024 },
//       fichierSolution: { name: 'solution.js', size: 4096 }
//     },
//     {
//       id: 3,
//       titre: 'Database Design Challenge',
//       description: 'Concevoir un schéma de base de données pour un système e-commerce',
//       difficulte: 'Expert',
//       points: 250,
//       categorie: 'Database',
//       statut: 'Brouillon',
//       dateCreation: '2024-01-25',
//       fichierOutput: null,
//       fichierInput: null,
//       fichierSolution: null
//     }
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentChallenge, setCurrentChallenge] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategorie, setFilterCategorie] = useState('Tous');
//   const [filterStatut, setFilterStatut] = useState('Tous');
//   const [activeTab, setActiveTab] = useState('details');

//   const outputRef = useRef(null);
//   const inputRef = useRef(null);
//   const solutionRef = useRef(null);

//   const [formData, setFormData] = useState({
//     titre: '',
//     description: '',
//     difficulte: 'Débutant',
//     points: 0,
//     categorie: 'Frontend',
//     statut: 'Brouillon',
//     fichierOutput: null,
//     fichierInput: null,
//     fichierSolution: null
//   });

//   const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Design', 'Algorithm'];
//   const difficultes = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
//   const statuts = ['Brouillon', 'Actif', 'Archivé'];

//   const openModal = (challenge = null) => {
//     if (challenge) {
//       setCurrentChallenge(challenge);
//       setFormData({
//         titre: challenge.titre,
//         description: challenge.description,
//         difficulte: challenge.difficulte,
//         points: challenge.points,
//         categorie: challenge.categorie,
//         statut: challenge.statut,
//         fichierOutput: challenge.fichierOutput,
//         fichierInput: challenge.fichierInput,
//         fichierSolution: challenge.fichierSolution
//       });
//     } else {
//       setCurrentChallenge(null);
//       setFormData({
//         titre: '',
//         description: '',
//         difficulte: 'Débutant',
//         points: 0,
//         categorie: 'Frontend',
//         statut: 'Brouillon',
//         fichierOutput: null,
//         fichierInput: null,
//         fichierSolution: null
//       });
//     }
//     setActiveTab('details');
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentChallenge(null);
//   };

//   const handleFileUpload = (e, type) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({
//         ...formData,
//         [type]: {
//           name: file.name,
//           size: file.size,
//           file: file
//         }
//       });
//     }
//   };

//   const removeFile = (type) => {
//     setFormData({
//       ...formData,
//       [type]: null
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (currentChallenge) {
//       setChallenges(challenges.map(c => 
//         c.id === currentChallenge.id 
//           ? { ...currentChallenge, ...formData }
//           : c
//       ));
//     } else {
//       const newChallenge = {
//         id: Math.max(...challenges.map(c => c.id), 0) + 1,
//         ...formData,
//         dateCreation: new Date().toISOString().split('T')[0]
//       };
//       setChallenges([...challenges, newChallenge]);
//     }
    
//     closeModal();
//   };

//   const deleteChallenge = (id) => {
//     if (confirm('Êtes-vous sûr de vouloir supprimer ce challenge ?')) {
//       setChallenges(challenges.filter(c => c.id !== id));
//     }
//   };

//   const filteredChallenges = challenges.filter(challenge => {
//     const matchSearch = challenge.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                        challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchCategorie = filterCategorie === 'Tous' || challenge.categorie === filterCategorie;
//     const matchStatut = filterStatut === 'Tous' || challenge.statut === filterStatut;
    
//     return matchSearch && matchCategorie && matchStatut;
//   });

//   const getDifficulteColor = (difficulte) => {
//     const colors = {
//       'Débutant': 'from-emerald-500/20 to-green-500/20 text-emerald-600 border-emerald-500/30',
//       'Intermédiaire': 'from-amber-500/20 to-yellow-500/20 text-amber-600 border-amber-500/30',
//       'Avancé': 'from-orange-500/20 to-red-500/20 text-orange-600 border-orange-500/30',
//       'Expert': 'from-purple-500/20 to-pink-500/20 text-purple-600 border-purple-500/30'
//     };
//     return colors[difficulte] || 'from-slate-500/20 to-gray-500/20 text-slate-600 border-slate-500/30';
//   };

//   const getStatutColor = (statut) => {
//     const colors = {
//       'Brouillon': 'from-slate-500/20 to-gray-500/20 text-slate-600 border-slate-500/30',
//       'Actif': 'from-emerald-500/20 to-green-500/20 text-emerald-600 border-emerald-500/30',
//       'Archivé': 'from-red-500/20 to-rose-500/20 text-red-600 border-red-500/30'
//     };
//     return colors[statut] || 'from-slate-500/20 to-gray-500/20 text-slate-600 border-slate-500/30';
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
//     return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
//   };

//   const FileUploadZone = ({ type, label, icon: Icon, fileRef, file }) => (
//     <div className="space-y-3">
//       <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
//         <Icon size={16} className="text-indigo-600" />
//         {label}
//       </label>
      
//       {!file ? (
//         <div 
//           onClick={() => fileRef.current?.click()}
//           className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer 
//                      hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-300 group bg-white"
//         >
//           <Upload size={32} className="mx-auto mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
//           <p className="text-sm text-slate-600 group-hover:text-slate-800 font-medium">
//             Cliquez pour télécharger un fichier
//           </p>
//           <p className="text-xs text-slate-500 mt-1">
//             Tous types de fichiers acceptés
//           </p>
//           <input 
//             ref={fileRef}
//             type="file" 
//             className="hidden" 
//             onChange={(e) => handleFileUpload(e, type)}
//           />
//         </div>
//       ) : (
//         <div className="bg-linear-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3 flex-1 min-w-0">
//               <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-300">
//                 <FileCode size={20} className="text-indigo-600" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
//                 <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
//               </div>
//             </div>
//             <button
//               type="button"
//               onClick={() => removeFile(type)}
//               className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
//             >
//               <X size={18} className="text-slate-500 group-hover:text-red-500" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
//       {/* Animated Background Effects */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
//         <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>
//       </div>

//       {/* Header - Dark Section */}
//       <div className="relative bg-linear-to-br from-slate-900 via-indigo-900 to-purple-900 border-b border-indigo-800/50 shadow-2xl">
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
        
//         <div className="relative max-w-7xl mx-auto px-6 py-10">
//           <div className="flex justify-between items-center">
//             <div>
//               <div className="flex items-center gap-4 mb-3">
//                 <div className="p-3 bg-linear-to-br from-cyan-400 to-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/30">
//                   <Terminal size={28} className="text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
//                     Challenge Manager
//                   </h1>
//                   <p className="text-indigo-300 text-sm mt-1">Plateforme de gestion avancée</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-5 text-sm ml-1">
//                 <span className="text-indigo-200 font-medium">
//                   {filteredChallenges.length} challenge{filteredChallenges.length > 1 ? 's' : ''}
//                 </span>
//                 <span className="text-indigo-500">•</span>
//                 <span className="text-indigo-200 flex items-center gap-2">
//                   <Trophy size={16} className="text-amber-400" />
//                   <span className="font-semibold text-amber-300">{challenges.reduce((acc, c) => acc + c.points, 0)}</span> points total
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={() => openModal()}
//               className="group relative flex items-center gap-2 px-7 py-4 bg-linear-to-r from-cyan-500 via-indigo-500 to-purple-500 
//                          rounded-2xl font-semibold text-white shadow-2xl shadow-indigo-500/40 
//                          hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
//             >
//               <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
//               Nouveau Challenge
//               <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-cyan-400 to-purple-400 opacity-0 
//                               group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="relative max-w-7xl mx-auto px-6 py-8">
//         {/* Filtres - White Section */}
//         <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 mb-8 shadow-xl shadow-slate-200/50">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter size={18} className="text-indigo-600" />
//             <h2 className="text-lg font-semibold text-slate-800">Filtres</h2>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative group">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
//               <input
//                 type="text"
//                 placeholder="Rechercher un challenge..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                            text-slate-800 placeholder-slate-400 
//                            focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                            transition-all duration-300"
//               />
//             </div>
            
//             <select
//               value={filterCategorie}
//               onChange={(e) => setFilterCategorie(e.target.value)}
//               className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                          text-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                          transition-all duration-300 cursor-pointer font-medium"
//             >
//               <option value="Tous">Toutes les catégories</option>
//               {categories.map(cat => (
//                 <option key={cat} value={cat}>{cat}</option>
//               ))}
//             </select>
            
//             <select
//               value={filterStatut}
//               onChange={(e) => setFilterStatut(e.target.value)}
//               className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                          text-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                          transition-all duration-300 cursor-pointer font-medium"
//             >
//               <option value="Tous">Tous les statuts</option>
//               {statuts.map(statut => (
//                 <option key={statut} value={statut}>{statut}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Liste des challenges - Mixed sections */}
//         <div className="grid gap-6">
//           {filteredChallenges.map((challenge, index) => (
//             <div 
//               key={challenge.id} 
//               className={`group relative rounded-2xl p-6 border
//                          hover:shadow-2xl transition-all duration-500 ${
//                 index % 2 === 0 
//                   ? 'bg-white/90 backdrop-blur-xl border-slate-200 hover:border-indigo-300 shadow-lg shadow-slate-200/50' 
//                   : 'bg-linear-to-br from-slate-900 to-indigo-950 border-slate-800 hover:border-indigo-600 shadow-lg shadow-indigo-900/30'
//               }`}
//             >
//               {/* Glow Effect */}
//               <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
//                 index % 2 === 0
//                   ? 'bg-linear-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5'
//                   : 'bg-linear-to-r from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10'
//               }`}></div>
              
//               <div className="relative flex justify-between items-start">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-3 flex-wrap">
//                     <h3 className={`text-2xl font-bold transition-colors ${
//                       index % 2 === 0 
//                         ? 'text-slate-900 group-hover:text-indigo-600' 
//                         : 'text-white group-hover:text-cyan-300'
//                     }`}>
//                       {challenge.titre}
//                     </h3>
//                     <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold border bg-linear-to-br ${getDifficulteColor(challenge.difficulte)}`}>
//                       {challenge.difficulte}
//                     </span>
//                     <span className={`px-4 py-1.5 rounded-lg text-xs font-semibold border bg-linear-to-br ${getStatutColor(challenge.statut)}`}>
//                       {challenge.statut}
//                     </span>
//                   </div>
                  
//                   <p className={`mb-4 leading-relaxed ${
//                     index % 2 === 0 ? 'text-slate-600' : 'text-slate-300'
//                   }`}>
//                     {challenge.description}
//                   </p>
                  
//                   <div className="flex items-center gap-6 text-sm flex-wrap">
//                     <div className="flex items-center gap-2">
//                       <Zap size={16} className={index % 2 === 0 ? 'text-amber-500' : 'text-amber-400'} />
//                       <span className={`font-bold ${index % 2 === 0 ? 'text-amber-600' : 'text-amber-400'}`}>
//                         {challenge.points}
//                       </span>
//                       <span className={index % 2 === 0 ? 'text-slate-500' : 'text-slate-400'}>points</span>
//                     </div>
//                     <span className={index % 2 === 0 ? 'text-slate-300' : 'text-slate-700'}>•</span>
//                     <span className={`flex items-center gap-2 ${index % 2 === 0 ? 'text-slate-600' : 'text-slate-300'}`}>
//                       <Layers size={16} className={index % 2 === 0 ? 'text-indigo-500' : 'text-cyan-400'} />
//                       {challenge.categorie}
//                     </span>
//                     <span className={index % 2 === 0 ? 'text-slate-300' : 'text-slate-700'}>•</span>
//                     <span className={`text-xs ${index % 2 === 0 ? 'text-slate-500' : 'text-slate-400'}`}>
//                       Créé le {challenge.dateCreation}
//                     </span>
//                   </div>

//                   {/* Fichiers attachés */}
//                   {(challenge.fichierOutput || challenge.fichierInput || challenge.fichierSolution) && (
//                     <div className="mt-4 flex gap-2 flex-wrap">
//                       {challenge.fichierOutput && (
//                         <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
//                           index % 2 === 0 
//                             ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
//                             : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
//                         }`}>
//                           <Download size={12} />
//                           Output
//                         </div>
//                       )}
//                       {challenge.fichierInput && (
//                         <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
//                           index % 2 === 0 
//                             ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
//                             : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
//                         }`}>
//                           <Upload size={12} />
//                           Input
//                         </div>
//                       )}
//                       {challenge.fichierSolution && (
//                         <div className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
//                           index % 2 === 0 
//                             ? 'bg-purple-100 text-purple-700 border border-purple-200'
//                             : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
//                         }`}>
//                           <Code2 size={12} />
//                           Solution
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex gap-2 ml-4">
//                   <button
//                     onClick={() => openModal(challenge)}
//                     className={`p-3 rounded-xl transition-all duration-300 group/btn ${
//                       index % 2 === 0
//                         ? 'bg-slate-100 hover:bg-indigo-100 border border-slate-200 hover:border-indigo-300'
//                         : 'bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/50'
//                     }`}
//                     title="Modifier"
//                   >
//                     <Edit2 size={18} className={index % 2 === 0 
//                       ? 'text-slate-600 group-hover/btn:text-indigo-600' 
//                       : 'text-slate-400 group-hover/btn:text-cyan-400'} 
//                     />
//                   </button>
//                   <button
//                     onClick={() => deleteChallenge(challenge.id)}
//                     className={`p-3 rounded-xl transition-all duration-300 group/btn ${
//                       index % 2 === 0
//                         ? 'bg-slate-100 hover:bg-red-100 border border-slate-200 hover:border-red-300'
//                         : 'bg-slate-800/50 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50'
//                     }`}
//                     title="Supprimer"
//                   >
//                     <Trash2 size={18} className={index % 2 === 0 
//                       ? 'text-slate-600 group-hover/btn:text-red-600' 
//                       : 'text-slate-400 group-hover/btn:text-red-400'} 
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           {filteredChallenges.length === 0 && (
//             <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-16 text-center shadow-xl">
//               <Terminal size={64} className="mx-auto mb-4 text-slate-300" />
//               <p className="text-slate-600 text-xl font-medium mb-2">Aucun challenge trouvé</p>
//               <p className="text-slate-500 text-sm">Modifiez vos filtres ou créez un nouveau challenge</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//             {/* Header - Dark */}
//             <div className="p-6 bg-linear-to-br from-slate-900 via-indigo-900 to-purple-900 flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-linear-to-br from-cyan-400 to-indigo-500 rounded-xl shadow-lg">
//                   <Code2 size={22} className="text-white" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white">
//                   {currentChallenge ? 'Modifier le challenge' : 'Nouveau challenge'}
//                 </h2>
//               </div>
//               <button
//                 onClick={closeModal}
//                 className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
//               >
//                 <X size={24} className="text-slate-300 group-hover:text-white" />
//               </button>
//             </div>

//             {/* Tabs */}
//             <div className="flex gap-1 px-6 pt-4 bg-slate-50">
//               <button
//                 onClick={() => setActiveTab('details')}
//                 className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 ${
//                   activeTab === 'details'
//                     ? 'bg-white text-indigo-600 shadow-sm border-t border-x border-slate-200'
//                     : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <Eye size={16} />
//                   Détails
//                 </div>
//               </button>
//               <button
//                 onClick={() => setActiveTab('fichiers')}
//                 className={`px-6 py-3 rounded-t-xl font-medium transition-all duration-300 ${
//                   activeTab === 'fichiers'
//                     ? 'bg-white text-indigo-600 shadow-sm border-t border-x border-slate-200'
//                     : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <File size={16} />
//                   Fichiers
//                 </div>
//               </button>
//             </div>
            
//             <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
//               {activeTab === 'details' && (
//                 <div className="p-6 space-y-6 bg-white">
//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">
//                       Titre du challenge *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={formData.titre}
//                       onChange={(e) => setFormData({...formData, titre: e.target.value})}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                                  text-slate-800 placeholder-slate-400 
//                                  focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                                  transition-all duration-300"
//                       placeholder="Ex: Challenge React Avancé"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-semibold text-slate-700 mb-2">
//                       Description *
//                     </label>
//                     <textarea
//                       required
//                       value={formData.description}
//                       onChange={(e) => setFormData({...formData, description: e.target.value})}
//                       rows={5}
//                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                                  text-slate-800 placeholder-slate-400 
//                                  focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                                  transition-all duration-300 resize-none"
//                       placeholder="Décrivez le challenge en détail..."
//                     />
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-700 mb-2">
//                         Catégorie *
//                       </label>
//                       <select
//                         value={formData.categorie}
//                         onChange={(e) => setFormData({...formData, categorie: e.target.value})}
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                                    text-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                                    transition-all duration-300 cursor-pointer font-medium"
//                       >
//                         {categories.map(cat => (
//                           <option key={cat} value={cat}>{cat}</option>
//                         ))}
//                       </select>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-700 mb-2">
//                         Difficulté *
//                       </label>
//                       <select
//                         value={formData.difficulte}
//                         onChange={(e) => setFormData({...formData, difficulte: e.target.value})}
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                                    text-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                                    transition-all duration-300 cursor-pointer font-medium"
//                       >
//                         {difficultes.map(diff => (
//                           <option key={diff} value={diff}>{diff}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-700 mb-2">
//                         Points *
//                       </label>
//                       <input
//                         type="number"
//                         required
//                         min="0"
//                         value={formData.points}
//                         onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 0})}
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                                    text-slate-800 placeholder-slate-400 
//                                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                                    transition-all duration-300"
//                         placeholder="100"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-700 mb-2">
//                         Statut *
//                       </label>
//                       <select
//                         value={formData.statut}
//                         onChange={(e) => setFormData({...formData, statut: e.target.value})}
//                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl 
//                                    text-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white
//                                    transition-all duration-300 cursor-pointer font-medium"
//                       >
//                         {statuts.map(statut => (
//                           <option key={statut} value={statut}>{statut}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'fichiers' && (
//                 <div className="p-6 space-y-6 bg-linear-to-br from-slate-50 to-indigo-50/30">
//                   <FileUploadZone
//                     type="fichierOutput"
//                     label="Fichier Output (Sortie attendue)"
//                     icon={Download}
//                     fileRef={outputRef}
//                     file={formData.fichierOutput}
//                   />

//                   <FileUploadZone
//                     type="fichierInput"
//                     label="Fichier Input (Données d'entrée)"
//                     icon={Upload}
//                     fileRef={inputRef}
//                     file={formData.fichierInput}
//                   />

//                   <FileUploadZone
//                     type="fichierSolution"
//                     label="Souche de Code (Solution)"
//                     icon={Code2}
//                     fileRef={solutionRef}
//                     file={formData.fichierSolution}
//                   />
//                 </div>
//               )}

//               <div className="p-6 border-t border-slate-200 flex gap-3 bg-slate-50">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl 
//                              hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 font-medium"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl 
//                              hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 
//                              flex items-center justify-center gap-2 font-semibold hover:scale-105"
//                 >
//                   <Check size={20} />
//                   {currentChallenge ? 'Mettre à jour' : 'Créer le challenge'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }