"use client"
import Console from '@/components/console'
import EditorComponent from '@/components/editor'
import { CODE_SNIPPETS } from '@/lib/constant';
import { CloudCheck } from 'lucide-react';
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
    const [popup, setPopup] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);
    const [loadingSave, setLoadingSave] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const { challengeId } = useParams<{challengeId: string}>();
    const [challengeData, setChallengesData] = useState<any>([]);
    const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");
    const [challengeStarted, setChallengeStarted] = useState<boolean>(false);

    const submitCode = async (code: string, id: string) => {
        setLoadingSubmit(true);
        try{
            const res = await fetch(`/api/challenges/${challengeId}/submit`,
                {
                    method: "POST",
                    body: JSON.stringify({code})
                }
            )
            if (res.ok)
                window.location.href = `/members/challenges`
        }
        catch (error){
            console.log(error)
        }finally {
            setLoadingSubmit(false);
        }
    }

    // Calculate time elapsed since challenge started
    const calculateTimeElapsed = (startedAt: string) => {
        const startTime = new Date(startedAt).getTime();
        const now = new Date().getTime();
        const elapsedMs = now - startTime;
        
        // Convert to hours, minutes, seconds
        const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
        
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            totalMs: elapsedMs
        };
    };

    // Update timer every second
    useEffect(() => {
        if (challengeData?.started_at) {
            setChallengeStarted(true);
            
            const timer = setInterval(() => {
                const time = calculateTimeElapsed(challengeData.started_at);
                setTimeElapsed(`${time.hours}:${time.minutes}:${time.seconds}`);
            }, 1000);

            return () => clearInterval(timer);
        } else {
            setChallengeStarted(false);
            setTimeElapsed("00:00:00");
        }
    }, [challengeData?.started_at]);

    // Gestionnaire pour Ctrl+S
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                handleSave();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Nettoie l'écouteur lors du démontage du composant
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [code, challengeData]);

    // Gestionnaire de popup éphémère
    useEffect(() => {
        if (popup) {
            const timer = setTimeout(() => {
                setPopup(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [popup]);

    const showPopup = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setPopup({ message, type });
    };

    const handleSave = async () => {
        setLoadingSave(true);
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
                showPopup('Code saved successfully!', 'success');
            } else {
                showPopup('Error saving code', 'error');
            }
        } catch (error) {
            showPopup('Error saving code', 'error');
        } finally {
            setLoadingSave(false);
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
            setResponseTest({
                success: false,
                message: "Error running test"
            });
            showPopup("Error running test", 'error');
        } finally {
            setLoading(false);
        }
    }

    const runAllTest = async () => {
        setActiveMode('test');
        setLoading(true);
        setResponseTest(null);
        setOutput("");
        setError("");
        
        try {
            const res = await fetch(`/api/challenges/${challengeData?.id}/test`,
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
            console.error("Error running all test:", error);
            setResponseTest({
                success: false,
                message: "Error running test"
            });
            showPopup("Error running tests", 'error');
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
            
            // Initialize timer if challenge has started
            if (data?.started_at) {
                const time = calculateTimeElapsed(data.started_at);
                setTimeElapsed(`${time.hours}:${time.minutes}:${time.seconds}`);
            }
        } catch (error) {
            console.error("Error fetching challenge:", error);
            showPopup('Error loading challenge', 'error');
        }
    }

    useEffect(() => {
        getChallenges();
    }, [])

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
            
            if (result.error) {
                showPopup('Error executing code', 'error');
            } else {
                showPopup('Code executed successfully', 'success');
            }
        } catch (err) {
            const endTime = Date.now();
            setExecutionTime(endTime - startTime);
            setError("Error executing code");
            showPopup('Error executing code', 'error');
        } finally {
            setLoading(false);
        }
    };

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }

    // Styles pour les différents types de popup
    const getPopupStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 border-green-600';
            case 'error':
                return 'bg-red-500 border-red-600';
            case 'info':
                return 'bg-blue-500 border-blue-600';
            default:
                return 'bg-blue-500 border-blue-600';
        }
    };

    return (
        <div className="bg-neutral-900 flex text-white h-screen w-full p-4">
            {/* Popup éphémère */}
            {popup && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border ${getPopupStyles(popup.type)} text-white transition-all duration-300 transform translate-x-0 animate-fade-in`}>
                    <div className="flex items-center">
                        <span>{popup.message}</span>
                    </div>
                </div>
            )}
            
            <div className="w-4/6">
                <div className="current-stat px-4 py-2 bg-blue-950/40 rounded-lg mb-5">
                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <h1 className="text-2xl font-bold">Code Editor</h1>
                            {challengeData?.title && (
                                <p className="text-sm text-gray-300 mt-1">{challengeData.title}</p>
                            )}
                        </div>
                        <div className="text-sm text-gray-300">
                            {currentTime}
                        </div>
                    </div>
                    
                    {/* Mini Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="bg-white/5 p-2 rounded text-center">
                            <div className="text-xs text-gray-300">Characters</div>
                            <div className="font-bold text-blue-400">{charCount}</div>
                        </div>
                        <div className="bg-white/5 p-2 rounded text-center">
                            <div className="text-xs text-gray-300">Execution Time</div>
                            <div className="font-bold text-yellow-400">
                                {executionTime > 0 ? `${executionTime}ms` : 'N/A'}
                            </div>
                        </div>
                        <div className="bg-white/5 p-2 rounded text-center">
                            <div className="text-xs text-gray-300">Time Elapsed</div>
                            <div className={`font-bold ${challengeStarted ? 'text-green-400' : 'text-gray-400'}`}>
                                {timeElapsed}
                            </div>
                        </div>
                        <button 
                            onClick={handleSave}
                            className={`${loadingSave ? 'bg-teal-700/50 cursor-not-allowed' : 'bg-teal-700/40'} flex items-center justify-center gap-2 cursor-pointer hover:bg-teal-700/50 transition-all ease-in-out duration-300 shadow-lg p-2 rounded text-center`}
                        >
                            {loadingSave ? <>Saving..</> :<>Save <CloudCheck className="w-4 h-4" /> </>}
                        </button>
                    </div>
                    
                    {/* Challenge Status */}
                    {challengeData?.status && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                            <span className="text-gray-300">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                challengeData.status === 'in_progress' 
                                    ? 'bg-blue-500 text-white' 
                                    : challengeData.status === 'completed'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-500 text-white'
                            }`}>
                                {challengeData.status === 'in_progress' ? 'In Progress' : 
                                 challengeData.status === 'completed' ? 'Completed' : 'Not Started'}
                            </span>
                            {challengeData?.started_at && (
                                <span className="text-gray-400 text-xs">
                                    Started: {new Date(challengeData.started_at).toLocaleString('en-US')}
                                </span>
                            )}
                        </div>
                    )}
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
                    id={challengeId}
                    code={code}
                    challengeData={challengeData}
                    runSingleTest={runSingleTest}
                    runAllTest={runAllTest}
                    resTest={responseTest}
                    activeMode={activeMode}
                    onSave={handleSave}
                    loadingSave={loadingSave}
                    submitCode={submitCode}
                    loadingSubmit={loadingSubmit}
                />
            </div>
        </div>
    )
}