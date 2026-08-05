"use client"
import Console from '@/components/console'
import EditorComponent from '@/components/editor'
import { CODE_SNIPPETS } from '@/lib/constant';
import { useParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

const JUDGE0_LANG_MAP: Record<string, number> = {
    python: 71,
    javascript: 63,
    typescript: 74,
    java: 62,
    c: 50,
    cpp: 54,
    go: 60,
    rust: 73,
};

export default function ChallengePage() {
    const editorRef = useRef(null);
    const [code, setCode] = useState<string>("");
    const [responseTest, setResponseTest] = useState<any>(null);
    const [Language, setLanguage] = useState<string>("python");
    const [output, setOutput] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [executionTime, setExecutionTime] = useState<number>(0);
    const [activeMode, setActiveMode] = useState<'code' | 'test'>('code');
    const [loadingSave, setLoadingSave] = useState<boolean>(false);
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
    const { challengeId } = useParams<{ challengeId: string }>();
    const [challengeData, setChallengesData] = useState<any>(null);
    const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");
    const [challengeStarted, setChallengeStarted] = useState<boolean>(false);
    const [showRunCode, setShowRunCode] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    
    // États pour le popup
    const [popupInput, setPopupInput] = useState<string>("");
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const calculateTimeElapsed = (startedAt: string) => {
        const elapsedMs = Date.now() - new Date(startedAt).getTime();
        const h = Math.floor(elapsedMs / 3600000);
        const m = Math.floor((elapsedMs % 3600000) / 60000);
        const s = Math.floor((elapsedMs % 60000) / 1000);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!challengeData?.started_at) { setChallengeStarted(false); return; }
        setChallengeStarted(true);
        const timer = setInterval(() => setTimeElapsed(calculateTimeElapsed(challengeData.started_at)), 1000);
        return () => clearInterval(timer);
    }, [challengeData?.started_at]);

    // Ctrl+S
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [code]);

    const handleSave = async () => {
        setLoadingSave(true);
        try {
            const res = await fetch(`/api/challenges/${challengeId}/save-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language: Language }),
            });
            showToast(res.ok ? 'Saved' : 'Save failed', res.ok ? 'success' : 'error');
        } catch { showToast('Save failed', 'error'); }
        finally { setLoadingSave(false); }
    };

    const submitCode = async (code: string) => {
        setLoadingSubmit(true);
        try {
            const res = await fetch(`/api/challenges/${challengeId}/submit`, {
                method: 'POST', body: JSON.stringify({ code, language: Language }),
            });
            const data = await res.json();
            if (res.ok) window.location.href = data.redirect || `/members/challenges`;
        } catch { showToast('Submit failed', 'error'); }
        finally { setLoadingSubmit(false); }
    };

    const runSingleTest = async (id: number) => {
        setActiveMode('test'); setLoading(true); setResponseTest(null); setOutput(""); setError("");
        try {
            const res = await fetch(`/api/challenges/${challengeData?.id}/test/${id}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language: Language }),
            });
            setResponseTest(await res.json());
        } catch { setResponseTest({ success: false, message: "Error running test" }); }
        finally { setLoading(false); }
    };

    const runAllTest = async () => {
        setActiveMode('test'); setLoading(true); setResponseTest(null); setOutput(""); setError("");
        try {
            const res = await fetch(`/api/challenges/${challengeData?.id}/test`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language: Language }),
            });
            setResponseTest(await res.json());
        } catch { setResponseTest({ success: false, message: "Error running tests" }); }
        finally { setLoading(false); }
    };

    const handleRunCode = () => {
        setShowRunCode(!showRunCode);
        if (!showRunCode) {
            // Ouvre le popup quand showRunCode passe à true
            setIsPopupOpen(true);
            setPopupInput(""); // Réinitialise l'input
        }
    }

    // Gestionnaire pour le bouton "Envoyer" du popup
    const handlePopupSubmit = () => {
        // Ici tu peux utiliser popupInput pour ce que tu veux
        console.log("Input value:", popupInput);
        
        // Ferme le popup
        setIsPopupOpen(false);
        setShowRunCode(false);
        
        // Exécute le code (si c'est ce que tu veux faire)
        runCode();
        
        // Optionnel : montre un toast avec la valeur
        if (popupInput.trim()) {
            showToast(`Input: ${popupInput.substring(0, 50)}${popupInput.length > 50 ? '...' : ''}`, 'info');
        }
    };

    // Gestionnaire pour le bouton "Annuler" du popup
    const handlePopupCancel = () => {
        setIsPopupOpen(false);
        setShowRunCode(false);
        setPopupInput("");
    };

    const runCode = async () => {
        setActiveMode('code'); setLoading(true); setOutput(""); setError(""); setResponseTest(null);
        const t0 = Date.now();
        try {
            const res = await fetch("/api/submissions", {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source_code: code,
                    // language_id: JUDGE0_LANG_MAP[Language] ?? 71,
                    language: Language ?? 'python',
                    // Ajouter l'input du popup si nécessaire
                    ...(popupInput && { stdin_input: popupInput }),
                }),
            });
            const result = await res.json();
            setExecutionTime(Date.now() - t0);
            setOutput(result.output || "No output");
            setError(result.error || "");
            showToast(result.error ? 'Runtime error' : 'Executed', result.error ? 'error' : 'success');
        } catch {
            setExecutionTime(Date.now() - t0);
            setError("Network error");
            showToast('Execution failed', 'error');
        } finally { setLoading(false); }
    };

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang);
        setCode(CODE_SNIPPETS[lang] ?? CODE_SNIPPETS["python"]);
        setOutput("");
        setError("");
        setResponseTest(null);
    };

    const getChallenges = async () => {
        try {
            const res = await fetch(`/api/challenges/${challengeId}`, { headers: { 'Content-Type': 'application/json' } });
            const data = await res.json();
            setChallengesData(data);
            const savedLang = data?.saved_language ?? "python";
            setLanguage(savedLang);
            setCode(data?.saved_code || CODE_SNIPPETS[savedLang] || CODE_SNIPPETS["python"]);
            if (data?.started_at) setTimeElapsed(calculateTimeElapsed(data.started_at));
        } catch { showToast('Failed to load challenge', 'error'); }
    };

    useEffect(() => { getChallenges(); }, []);

    const onMount = (editor: any) => { editorRef.current = editor; editor.focus(); };

    const toastColors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' };

    return (
        <div style={{ background: '#0e0f14', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'IBM Plex Mono', monospace" }}>

            {/* ── Toast ── */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 20, right: 20, zIndex: 9999,
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: '#141620', border: `1px solid ${toastColors[toast.type]}22`,
                    borderLeft: `3px solid ${toastColors[toast.type]}`,
                    padding: '10px 16px', borderRadius: 6,
                    color: '#e0e0e0', fontSize: 12, letterSpacing: '0.03em',
                    boxShadow: `0 8px 32px #000a`,
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: toastColors[toast.type], flexShrink: 0 }} />
                    {toast.message}
                </div>
            )}

            {/* ── Popup Modal ── */}
            {isPopupOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 23, 0, 0.1)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000,
                    animation: 'fadeIn 0.2s ease-out',
                }}>
                    <div style={{
                        background: '#080600',
                        border: '1px solid #1e2535',
                        borderRadius: 12,
                        padding: '32px 40px',
                        maxWidth: '600px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                        animation: 'slideUp 0.3s ease-out',
                    }}>
                        <h3 style={{
                            color: '#e0e0e0',
                            fontSize: 18,
                            fontWeight: 600,
                            margin: '0 0 8px 0',
                            letterSpacing: '0.02em',
                        }}>
                            ⚡ Run Code
                        </h3>
                        {/* <p style={{
                            color: '#888',
                            fontSize: 13,
                            margin: '0 0 20px 0',
                            lineHeight: 1.6,
                        }}>
                            Enter any input values (optional) or click "Run" to execute the code.
                            Use multi-line input for complex data.
                        </p> */}
                        
                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                display: 'block',
                                color: '#999',
                                fontSize: 12,
                                marginBottom: 6,
                                letterSpacing: '0.05em',
                            }}>
                                Input (optional)
                            </label>
                            <textarea
                                value={popupInput}
                                onChange={(e) => setPopupInput(e.target.value)}
                                placeholder="Enter input values...&#10;You can use multiple lines&#10;for example:&#10;1 2 3&#10;hello world"
                                onKeyDown={(e) => {
                                    // Ctrl+Enter ou Cmd+Enter pour soumettre
                                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                                        e.preventDefault();
                                        handlePopupSubmit();
                                    }
                                    if (e.key === 'Escape') {
                                        handlePopupCancel();
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '12px 14px',
                                    background: '#0e0f14',
                                    border: '1px solid #1e2535',
                                    borderRadius: 6,
                                    color: '#e0e0e0',
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    outline: 'none',
                                    resize: 'vertical',
                                    transition: 'border-color 0.2s',
                                    lineHeight: 1.6,
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#1e2535'}
                                autoFocus
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                color: '#666',
                                fontSize: 11,
                                marginTop: 6,
                                fontStyle: 'italic',
                            }}>
                                <span>Press Ctrl+Enter to submit, Esc to cancel</span>
                                <span>{popupInput.split('\n').length} lines</span>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: 12,
                            justifyContent: 'flex-end',
                        }}>
                            <button
                                onClick={handlePopupCancel}
                                style={{
                                    padding: '8px 24px',
                                    background: 'transparent',
                                    border: '1px solid #1e2535',
                                    borderRadius: 6,
                                    color: '#888',
                                    fontSize: 13,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    letterSpacing: '0.05em',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#444'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e2535'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePopupSubmit}
                                style={{
                                    padding: '8px 28px',
                                    background: '#3b82f6',
                                    border: 'none',
                                    borderRadius: 6,
                                    color: '#fff',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    letterSpacing: '0.05em',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                            >
                                Run
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Styles d'animation ── */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>

            {/* ── Top bar ── */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 24px', height: 44,
                borderBottom: '1px solid #1e2535',
                background: '#11121a',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* Logo mark */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 20, height: 20, border: '1.5px solid #333', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 8, height: 8, background: '#fff', borderRadius: 1 }} />
                        </div>
                        <span style={{ color: '#444', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase' }}>challenger</span>
                    </div>

                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#333', fontSize: 11 }}>
                        <span>challenges</span>
                        <span>/</span>
                        <span style={{ color: '#888' }}>{challengeData?.title || '...'}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    {/* Difficulty */}
                    {challengeData?.difficulty && (
                        <span style={{
                            fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                            color: challengeData.difficulty === 'easy' ? '#22c55e' : challengeData.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
                            border: `1px solid currentColor`, borderRadius: 3,
                            padding: '2px 8px', opacity: 0.8,
                        }}>{challengeData.difficulty}</span>
                    )}

                    {/* Timer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: challengeStarted ? '#22c55e' : '#333', boxShadow: challengeStarted ? '0 0 6px #22c55e' : 'none' }} />
                        <span style={{ color: '#555', fontSize: 12, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.08em' }}>{timeElapsed}</span>
                    </div>

                    {/* Status */}
                    {challengeData?.status && (
                        <span style={{ fontSize: 11, color: '#444', letterSpacing: '0.05em' }}>
                            {challengeData.status === 'in_progress' ? 'in progress' : challengeData.status === 'completed' ? 'completed' : 'not started'}
                        </span>
                    )}

                    {/* Save */}
                    <button
                        onClick={handleSave}
                        disabled={loadingSave}
                        style={{
                            background: 'none', border: '1px solid #222', borderRadius: 4,
                            color: loadingSave ? '#444' : '#888', fontSize: 11,
                            padding: '4px 12px', cursor: loadingSave ? 'not-allowed' : 'pointer',
                            letterSpacing: '0.05em', transition: 'all 0.15s',
                        }}
                    >
                        {loadingSave ? 'saving…' : 'save'}
                    </button>

                    {/* XP */}
                    {challengeData?.xp_reward && (
                        <span style={{ fontSize: 11, color: '#f59e0b', letterSpacing: '0.05em' }}>+{challengeData.xp_reward} xp</span>
                    )}
                </div>
            </header>

            {/* ── Main ── */}
            <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Editor panel — 60% */}
                <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1a1c26' }}>
                    <EditorComponent
                        value={code}
                        setValue={setCode}
                        onMount={onMount}
                        Language={Language}
                        setLanguage={handleLanguageChange}
                    />
                </div>

                {/* Right panel — 40% */}
                <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Console
                        error={error}
                        output={output}
                        handleRunCode={handleRunCode}
                        loading={loading}
                        setLanguage={handleLanguageChange}
                        setValue={setCode}
                        id={challengeId}
                        code={code}
                        Language={Language}
                        challengeData={challengeData}
                        runSingleTest={runSingleTest}
                        runAllTest={runAllTest}
                        resTest={responseTest}
                        activeMode={activeMode}
                        onSave={handleSave}
                        loadingSave={loadingSave}
                        submitCode={submitCode}
                        loadingSubmit={loadingSubmit}
                        executionTime={executionTime}
                    />
                </div>
            </main>
        </div>
    );
}