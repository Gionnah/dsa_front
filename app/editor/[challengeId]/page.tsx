"use client"
import Console from '@/components/console'
import EditorComponent from '@/components/editor'
import { CODE_SNIPPETS } from '@/lib/constant';
import { useParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

export default function page() {
    const editorRef = useRef(null);
    const [code, setCode] = useState<string>("");
    const [responseTest, setResponseTest] = useState<any>(null);
    const [Language, setLanguage] = useState<string>("python");
    const [output, setOutput] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [charCount, setCharCount] = useState<number>(0);
    const [lineCount, setLineCount] = useState<number>(0);
    const [executionTime, setExecutionTime] = useState<number>(0);
    const [activeMode, setActiveMode] = useState<'code' | 'test'>('code');

    const { challengeId } = useParams<{challengeId: string}>();
    const [challengeData, setChallengesData] = useState<any>([]);

    // Gestionnaire pour Ctrl+S
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Vérifie si Ctrl+S ou Cmd+S est pressé
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault(); // Empêche l'enregistrement par défaut du navigateur
                handleSave();
            }
        };

        // Ajoute l'écouteur d'événement
        document.addEventListener('keydown', handleKeyDown);

        // Nettoie l'écouteur lors du démontage du composant
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [code, challengeData]); // Dépendances pour avoir le code et challengeData à jour

    const handleSave = async () => {
        // Affiche une alerte
        alert('Code sauvegardé !');
        
        // Ici tu peux aussi ajouter la logique pour sauvegarder dans la base de données
        try {
            const response = await fetch(`/api/challenges/${challengeId}/save-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                })
            });
            
            if (response.ok) {
                alert('Code sauvegardé avec succès');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    const runSingleTest = async (id: number) => {
        setActiveMode('test');
        setLoading(true);
        setResponseTest(null);
        setOutput("");
        setError("");
        
        try {
            const res = await fetch(`/api/challenges/${challengeData?.id}/test/${id}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code })
                }
            )
            const data = await res.json();
            setResponseTest(data);
        } catch (error) {
            console.error("Error running test:", error);
            setResponseTest({
                success: false,
                message: "Erreur lors de l'exécution du test"
            });
        } finally {
            setLoading(false);
        }
    }

    const getChallenges = async () => {
        try {
            const response = await fetch(`/api/challenges/${challengeId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setChallengesData(data);
            setCode(data?.saved_code || CODE_SNIPPETS["python"]);
        } catch (error) {
            console.error("Error fetching challenge:", error);
        }
    }

    useEffect(() => {
        getChallenges();
    }, [])

    // Mise à jour du temps en temps réel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Calcul des statistiques du code
    useEffect(() => {
        setCharCount(code.length);
        setLineCount(code.split('\n').length);
    }, [code]);

    const runCode = async () => {
        setActiveMode('code');
        setLoading(true);
        setOutput("");
        setError("");
        setResponseTest(null);
        const startTime = Date.now();
        
        try {
            const res = await fetch("/api/submissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    source_code: code,
                    language_id: 71, // Python 3
                }),
            });

            const result = await res.json();
            const endTime = Date.now();
            setExecutionTime(endTime - startTime);

            setOutput(result.output || "No output");
            setError(result.error || "");
        } catch (err) {
            const endTime = Date.now();
            setExecutionTime(endTime - startTime);
            setError("Erreur lors de l'exécution du code");
        } finally {
            setLoading(false);
        }
    };

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }

    return (
        <div className="bg-neutral-900 flex text-white h-screen w-full p-4">
            <div className="w-4/6">
                <div className="current-stat px-4 py-2 bg-blue-950/40 rounded-lg mb-5">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h1 className="text-2xl font-bold">Code Editor</h1>
                        </div>
                        <div className="text-sm text-gray-300">
                            {currentTime}
                        </div>
                    </div>
                    
                    {/* Mini Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="bg-white/5 p-2 rounded text-center">
                            <div className="text-xs text-gray-300">Caracteres</div>
                            <div className="font-bold text-blue-400">{charCount}</div>
                        </div>
                        <div className="bg-white/5 p-2 rounded text-center">
                            <div className="text-xs text-gray-300">Lines</div>
                            <div className="font-bold text-blue-400">{lineCount}</div>
                        </div>
                        <div className="bg-white/5 p-2 rounded text-center">
                            <div className="text-xs text-gray-300">Time of execution</div>
                            <div className="font-bold text-yellow-400">
                                {executionTime > 0 ? `${executionTime}ms` : 'N/A'}
                            </div>
                        </div>
                        <button 
                            onClick={handleSave}
                            className="bg-teal-700/40 cursor-pointer hover:bg-teal-700/50 transition-all ease-in-out duration-300 shadow-lg p-2 rounded text-center"
                        >
                            Save (Ctrl+S)
                        </button>
                    </div>
                </div>
                <EditorComponent 
                    value={challengeData?.saved_code || code} 
                    setValue={setCode} 
                    onMount={onMount} 
                    Language={Language} 
                    setLanguage={setLanguage}
                />
            </div>
            <div className="w-2/6">
                <Console 
                    error={error} 
                    output={output} 
                    runCode={runCode} 
                    loading={loading} 
                    setLanguage={setLanguage} 
                    setValue={setCode}
                    challengeData={challengeData}
                    runSingleTest={runSingleTest}
                    resTest={responseTest}
                    activeMode={activeMode}
                    onSave={handleSave}
                />
            </div>
        </div>
    )
}