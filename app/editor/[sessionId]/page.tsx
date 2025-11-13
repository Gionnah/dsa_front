"use client"
import Console from '@/components/console'
import EditorComponent from '@/components/editor'
import { CODE_SNIPPETS } from '@/lib/constant';
import { useRef, useState, useEffect } from 'react';

export default function page() {
    const editorRef = useRef(null);
    const [code, setCode] = useState<string>(CODE_SNIPPETS["python"]);
    const [Language, setLanguage] = useState<string>("python");
    const [output, setOutput] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [charCount, setCharCount] = useState<number>(0);
    const [lineCount, setLineCount] = useState<number>(0);
    const [executionTime, setExecutionTime] = useState<number>(0);

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
        setLoading(true);
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
            setError(result.error);
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
                        <button className="bg-teal-700/40 cursor-pointer hover:bg-teal-700/50 transition-all ease-in-out duration-300 shadow-lg p-2 rounded text-center">
                            Submit
                        </button>
                    </div>
                </div>
                <EditorComponent 
                    value={code} 
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
                />
            </div>
        </div>
    )
}