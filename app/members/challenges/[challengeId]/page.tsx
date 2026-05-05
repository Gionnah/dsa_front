"use client"
import HomeLayout from '@/components/layout/HomeLayout'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { Loader2, ArrowLeft, Code, CheckCircle, ArrowRight, ExternalLink, Users, Trophy, Calendar } from 'lucide-react';

// ─── Light tokens ─────────────────────────────────────────────────────────────
const T = {
    bg:      '#f8f9fb',
    surface: '#ffffff',
    raised:  '#f1f5f9',
    border:  '#e2e8f0',
    borderMd:'#cbd5e1',
    text:    '#475569',
    textHi:  '#0f172a',
    textMid: '#64748b',
    textDim: '#94a3b8',
    teal:    '#0d9488',
    tealBg:  '#f0fdfa',
    tealBdr: '#99f6e4',
    amber:   '#d97706',
    amberBg: '#fffbeb',
    green:   '#16a34a',
    greenBg: '#f0fdf4',
    red:     '#dc2626',
    redBg:   '#fef2f2',
    blue:    '#2563eb',
    blueBg:  '#eff6ff',
};

const DIFF: Record<string, { color: string; bg: string; border: string; label: string }> = {
    easy:   { color: T.green, bg: T.greenBg, border: '#bbf7d0', label: 'easy'   },
    medium: { color: T.amber, bg: T.amberBg, border: '#fde68a', label: 'medium'  },
    hard:   { color: T.red,   bg: T.redBg,   border: '#fecaca', label: 'hard'   },
};

const mono = "'IBM Plex Mono', monospace";
const sans = "'Inter', system-ui, sans-serif";

// ─── Shimmer Effect Component ────────────────────────────────────────────────
const Shimmer = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
);

// ─── Enhanced Skeleton Components ────────────────────────────────────────────
function SkeletonTopBar() {
    return (
        <div style={{
            background: T.surface, borderBottom: `1px solid ${T.border}`,
            padding: '0 36px', height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, height: 16, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
                <div style={{ width: 100, height: 16, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 60, height: 28, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
                <div style={{ width: 80, height: 36, background: T.raised, borderRadius: 7, position: 'relative', overflow: 'hidden' }}>
                    <Shimmer />
                </div>
            </div>
        </div>
    );
}

function SkeletonTitle() {
    return (
        <div style={{ marginBottom: 28 }}>
            <div style={{ width: '70%', height: 32, background: T.raised, borderRadius: 8, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
                <Shimmer />
            </div>
            <div style={{ width: 120, height: 16, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <Shimmer />
            </div>
        </div>
    );
}

function SkeletonTabs() {
    return (
        <div style={{ display: 'flex', borderBottom: `2px solid ${T.border}`, marginBottom: 28 }}>
            {[1, 2].map((i) => (
                <div key={i} style={{ padding: '10px 20px', marginBottom: -2 }}>
                    <div style={{ width: 80, height: 16, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                        <Shimmer />
                    </div>
                </div>
            ))}
        </div>
    );
}

function SkeletonDescription() {
    return (
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: '28px 32px', background: T.surface }}>
            <div style={{ width: '100%', height: 16, background: T.raised, borderRadius: 4, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
                <Shimmer />
            </div>
            <div style={{ width: '90%', height: 14, background: T.raised, borderRadius: 4, marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
                <Shimmer />
            </div>
            <div style={{ width: '80%', height: 14, background: T.raised, borderRadius: 4, marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
                <Shimmer />
            </div>
            <div style={{ width: '95%', height: 14, background: T.raised, borderRadius: 4, marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
                <Shimmer />
            </div>
            <div style={{ width: '70%', height: 14, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <Shimmer />
            </div>
        </div>
    );
}

function SkeletonTestCases() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[1, 2].map((i) => (
                <div key={i} style={{
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 10, padding: '20px 24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ width: 80, height: 16, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                            <Shimmer />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        {[1, 2].map((j) => (
                            <div key={j}>
                                <div style={{ width: 60, height: 12, background: T.raised, borderRadius: 4, marginBottom: 8, position: 'relative', overflow: 'hidden' }}>
                                    <Shimmer />
                                </div>
                                <div style={{ height: 64, background: T.raised, borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                                    <Shimmer />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function SkeletonSidebar() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ height: 48, background: T.raised, borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                <Shimmer />
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '12px 18px', borderBottom: `1px solid ${T.border}`, background: T.raised }}>
                    <div style={{ width: 100, height: 12, background: T.border, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                        <Shimmer />
                    </div>
                </div>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', borderBottom: i < 4 ? `1px solid ${T.border}` : 'none' }}>
                        <div style={{ width: 60, height: 14, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                            <Shimmer />
                        </div>
                        <div style={{ width: 50, height: 14, background: T.raised, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                            <Shimmer />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Loading Screen Component ────────────────────────────────────────────────
function EnhancedLoadingScreen({ message = 'loading challenge...', subMessage = 'preparing your coding environment' }) {
    return (
        <HomeLayout>
            <div style={{ minHeight: '100vh', background: T.bg, fontFamily: sans }}>
                <SkeletonTopBar />
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
                    <div>
                        <SkeletonTitle />
                        <SkeletonTabs />
                        <SkeletonDescription />
                    </div>
                    <div>
                        <SkeletonSidebar />
                    </div>
                </div>
                <div style={{
                    position: 'fixed', bottom: 24, right: 24,
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: T.surface, padding: '12px 20px',
                    borderRadius: 40, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: `1px solid ${T.border}`,
                    zIndex: 1000,
                }}>
                    <div className="relative w-5 h-5">
                        <div className="absolute inset-0 border-2 border-teal-200 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.textHi }}>{message}</div>
                        <div style={{ fontSize: 10, color: T.textDim }}>{subMessage}</div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </HomeLayout>
    );
}

// ─── Markdown renderer (unchanged) ───────────────────────────────────────────
function MarkdownBlock({ content }: { content: string }) {
    // Traiter d'abord les blocs de code pour les protéger
    let processed = content;
    
    // Protéger les blocs de code
    const codeBlocks: string[] = [];
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (match) => {
        codeBlocks.push(match);
        return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
    });
    
    // Convertir les doubles sauts de ligne en marqueurs de paragraphes
    processed = processed.replace(/\n\n/g, '___PARAGRAPH_BREAK___');
    
    // Convertir les simples sauts de ligne en <br/>
    processed = processed.replace(/\n/g, '<br/>');
    
    // Restaurer les paragraphes
    processed = processed.replace(/___PARAGRAPH_BREAK___/g, '</p><p class="mb-p">');
    
    // Restaurer les blocs de code
    processed = processed.replace(/___CODE_BLOCK_(\d+)___/g, (_, index) => codeBlocks[parseInt(index)]);
    
    // Appliquer les autres conversions markdown
    let html = processed
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="mb-pre"><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="mb-code">$1</code>')
        .replace(/^### (.+)$/gm, '<h3 class="mb-h3">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="mb-h2">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="mb-h1">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="mb-a">$1</a>')
        .replace(/^- (.+)$/gm, '<li class="mb-li">$1</li>')
        // Grouper les éléments de liste
        .replace(/(<li class="mb-li">[\s\S]*?<\/li>)(?=(?:<li|$))/g, (match) => {
            if (!match.includes('<ul')) {
                return `<ul class="mb-ul">${match}</ul>`;
            }
            return match;
        });
    
    return (
        <>
            <style>{`
                .mb-h1{color:${T.textHi};font-size:1.4rem;font-weight:800;margin:1.2rem 0 .5rem;font-family:${sans}}
                .mb-h2{color:${T.textHi};font-size:1.1rem;font-weight:700;margin:1.2rem 0 .4rem;padding-bottom:.4rem;border-bottom:2px solid ${T.border};font-family:${sans}}
                .mb-h3{color:${T.textMid};font-size:.95rem;font-weight:600;margin:1rem 0 .3rem;font-family:${sans}}
                .mb-p{color:${T.text};margin:.6rem 0;line-height:1.8;font-size:14px;font-family:${sans}}
                .mb-p br { display: block; content: ""; margin: 0.25rem 0; }
                .mb-pre{background:${T.raised};border:1px solid ${T.border};border-radius:8px;padding:1rem 1.2rem;overflow-x:auto;margin:.8rem 0;font-family:${mono};font-size:12px;color:${T.teal};line-height:1.7}
                .mb-code{background:${T.raised};border:1px solid ${T.border};border-radius:4px;padding:.1em .4em;font-size:.85em;color:${T.teal};font-family:${mono}}
                .mb-a{color:${T.teal};text-decoration:underline;text-underline-offset:2px}
                .mb-li{color:${T.text};margin:.25rem 0 .25rem 1.4rem;list-style:disc;font-size:14px;line-height:1.7;font-family:${sans}}
                .mb-ul { margin: 0.5rem 0; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: `<p class="mb-p">${html}</p>` }} />
        </>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function OneChallenge() {
    const router = useRouter();
    const { challengeId } = useParams<{ challengeId: string }>();
    const [data, setData] = useState<any>(null);
    const [isJoin, setIsJoin] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'tests'>('description');
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const cloudBase = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                // Simulate progress for better UX
                const progressInterval = setInterval(() => {
                    setLoadingProgress(prev => Math.min(prev + 10, 90));
                }, 100);
                
                const res = await fetch(`/api/challenges/${challengeId}`, { headers: { 'Content-Type': 'application/json' } });
                const d = await res.json();
                setData(d);
                setIsJoin(d.join || false);
                
                clearInterval(progressInterval);
                setLoadingProgress(100);
                setTimeout(() => setIsLoading(false), 300);
            } catch (e) { 
                console.error(e);
                setIsLoading(false);
            }
        })();
    }, [challengeId]);

    const joinChallenge = async () => {
        setIsJoining(true);
        try {
            const res = await fetch(`/api/challenges/${challengeId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            const d = await res.json();
            setIsJoin(true);
            setData((prev: any) => ({ ...prev, ...d }));
        } catch (e) { console.error(e); }
        finally { setIsJoining(false); }
    };

    const goToEditor = () => {
        setIsRedirecting(true);
        setTimeout(() => router.push(`/members/editor/${data.id}`), 400);
    };

    const diff = DIFF[data?.difficulty] ?? { color: T.textMid, bg: T.raised, border: T.border, label: data?.difficulty };

    const hasPdf = !!data?.description_pdf;
    const hasImg = !!data?.description_img;
    const hasMarkdown = !!data?.description?.trim();
    const pdfUrl  = hasPdf ? `${cloudBase}/${data.description_pdf}` : null;
    const imgUrl  = hasImg ? `${cloudBase}/${data.description_img}` : null;
    const hasAnyDescription = hasPdf || hasImg || hasMarkdown;

    type DescTab = 'pdf' | 'image' | 'markdown';
    const descTabs: DescTab[] = [
        ...(hasPdf      ? ['pdf'      as DescTab] : []),
        ...(hasImg      ? ['image'    as DescTab] : []),
        ...(hasMarkdown ? ['markdown' as DescTab] : []),
    ];

    const [activeDescTab, setActiveDescTab] = useState<DescTab | null>(null);

    useEffect(() => {
        if (descTabs.length > 0 && !activeDescTab) setActiveDescTab(descTabs[0]);
    }, [data]);

    const descTabLabel: Record<DescTab, string> = { pdf: 'PDF', image: 'image', markdown: 'description' };

    // Loading state with enhanced screen
    if (isRedirecting) {
        return (
            <HomeLayout>
                <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: sans }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="relative w-16 h-16 mx-auto mb-6">
                            <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-teal-600 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <p style={{ fontSize: 14, color: T.textHi, fontWeight: 600, marginBottom: 4 }}>Opening editor...</p>
                        <p style={{ fontSize: 12, color: T.textDim }}>preparing your coding environment</p>
                    </div>
                </div>
            </HomeLayout>
        );
    }

    if (isLoading) {
        return <EnhancedLoadingScreen message="loading challenge..." subMessage="fetching challenge data" />;
    }

    if (data?.details) return (
        <HomeLayout>
            <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono }}>
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ fontSize: 56, fontWeight: 800, color: T.border, marginBottom: 12, fontFamily: sans }}>404</div>
                    <p style={{ fontSize: 14, color: T.textMid, marginBottom: 24, fontFamily: sans }}>challenge not found</p>
                    <Link href="/members/challenges" style={{
                        color: T.teal, fontSize: 13, textDecoration: 'none',
                        border: `1px solid ${T.tealBdr}`, background: T.tealBg,
                        padding: '9px 20px', borderRadius: 8, fontFamily: sans,
                    }}>
                        ← back to challenges
                    </Link>
                </div>
            </div>
        </HomeLayout>
    );

    return (
        <HomeLayout>
            <div style={{ minHeight: '100vh', background: T.bg, fontFamily: sans, color: T.text }}>

                {/* ── Top bar ── */}
                <div style={{
                    background: T.surface, borderBottom: `1px solid ${T.border}`,
                    padding: '0 36px', height: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link href="/members/challenges" style={{
                            color: T.textMid, display: 'flex', alignItems: 'center', gap: 5,
                            fontSize: 13, textDecoration: 'none', transition: 'color 0.2s',
                        }} onMouseEnter={e => e.currentTarget.style.color = T.teal} onMouseLeave={e => e.currentTarget.style.color = T.textMid}>
                            <ArrowLeft size={14} /> challenges
                        </Link>
                        <span style={{ color: T.border }}>/</span>
                        <span style={{ color: T.textHi, fontSize: 13, fontWeight: 600 }}>{data?.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                            fontSize: 11, letterSpacing: '0.09em', textTransform: 'uppercase',
                            color: diff.color, background: diff.bg, border: `1px solid ${diff.border}`,
                            borderRadius: 4, padding: '3px 10px', fontFamily: mono, fontWeight: 700,
                        }}>{diff.label}</span>
                        <span style={{ fontSize: 12, color: T.amber, fontWeight: 700, fontFamily: mono }}>
                            +{data?.xp_reward ?? 100} xp
                        </span>
                        {isJoin ? (
                            <button onClick={goToEditor} style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                background: T.teal, border: 'none',
                                color: '#fff', fontSize: 13, fontWeight: 600,
                                padding: '7px 18px', borderRadius: 7, cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(13,148,136,0.3)',
                                transition: 'all 0.2s ease',
                            }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                <Code size={14} /> open editor <ArrowRight size={13} />
                            </button>
                        ) : (
                            <button onClick={joinChallenge} disabled={isJoining} style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                background: isJoining ? T.raised : T.teal, border: 'none',
                                color: isJoining ? T.textMid : '#fff', fontSize: 13, fontWeight: 600,
                                padding: '7px 18px', borderRadius: 7,
                                cursor: isJoining ? 'not-allowed' : 'pointer',
                                boxShadow: isJoining ? 'none' : '0 2px 8px rgba(13,148,136,0.3)',
                                transition: 'all 0.2s ease',
                            }} onMouseEnter={e => { if (!isJoining) e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                                {isJoining
                                    ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> joining…</>
                                    : <>join challenge</>}
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

                    {/* ── Left ── */}
                    <div>
                        {/* Title block */}
                        <div style={{ marginBottom: 28, animation: 'fadeInUp 0.5s ease-out' }}>
                            <h1 style={{ color: T.textHi, fontSize: 26, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.25 }}>
                                {data?.title}
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {isJoin && (
                                    <span style={{ fontSize: 12, color: T.green, display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                                        <CheckCircle size={13} /> enrolled
                                    </span>
                                )}
                                {data?.status && isJoin && (
                                    <span style={{ fontSize: 12, color: data.status === 'completed' ? T.green : T.blue }}>
                                        · {data.status === 'completed' ? 'completed' : 'in progress'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* ── Main tabs: description / tests ── */}
                        <div style={{ display: 'flex', borderBottom: `2px solid ${T.border}`, marginBottom: 28 }}>
                            {(['description', 'tests'] as const).map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                    background: 'none', border: 'none',
                                    borderBottom: `2px solid ${activeTab === tab ? T.teal : 'transparent'}`,
                                    color: activeTab === tab ? T.teal : T.textMid,
                                    fontSize: 13, fontWeight: activeTab === tab ? 700 : 400,
                                    padding: '10px 20px', cursor: 'pointer', marginBottom: -2,
                                    transition: 'all 0.2s ease',
                                }}>
                                    {tab === 'tests'
                                        ? `tests (${data?.test_cases?.length ?? 0})`
                                        : 'description'}
                                </button>
                            ))}
                        </div>

                        {/* ── Description tab ── */}
                        {activeTab === 'description' && (
                            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                {!hasAnyDescription ? (
                                    <div style={{ padding: '48px 0', textAlign: 'center', color: T.textDim, fontSize: 13 }}>
                                        no description available
                                    </div>
                                ) : (
                                    <>
                                        {descTabs.length > 1 && (
                                            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                                                {descTabs.map(t => (
                                                    <button key={t} onClick={() => setActiveDescTab(t)} style={{
                                                        background: activeDescTab === t ? T.tealBg : T.surface,
                                                        border: `1px solid ${activeDescTab === t ? T.tealBdr : T.border}`,
                                                        borderRadius: 6, color: activeDescTab === t ? T.teal : T.textMid,
                                                        fontSize: 12, fontWeight: activeDescTab === t ? 700 : 400,
                                                        padding: '6px 16px', cursor: 'pointer', fontFamily: mono,
                                                        transition: 'all 0.2s ease',
                                                    }}>
                                                        {descTabLabel[t]}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {(activeDescTab === 'pdf' || (descTabs.length === 1 && hasPdf)) && pdfUrl && (
                                            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', animation: 'fadeIn 0.3s ease-out' }}>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: '12px 18px', background: T.raised, borderBottom: `1px solid ${T.border}`,
                                                }}>
                                                    <span style={{ fontSize: 12, color: T.textMid, fontFamily: mono }}>challenge.pdf</span>
                                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{
                                                        color: T.teal, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5,
                                                        textDecoration: 'none', fontWeight: 600, transition: 'gap 0.2s',
                                                    }} onMouseEnter={e => e.currentTarget.style.gap = '8px'} onMouseLeave={e => e.currentTarget.style.gap = '5px'}>
                                                        <ExternalLink size={12} /> open in new tab
                                                    </a>
                                                </div>
                                                <iframe src={`${pdfUrl}#toolbar=0`} style={{ width: '100%', height: 620, display: 'block', border: 'none', background: '#fff' }} title="PDF" />
                                            </div>
                                        )}

                                        {(activeDescTab === 'image' || (descTabs.length === 1 && hasImg)) && imgUrl && (
                                            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', animation: 'fadeIn 0.3s ease-out' }}>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: '12px 18px', background: T.raised, borderBottom: `1px solid ${T.border}`,
                                                }}>
                                                    <span style={{ fontSize: 12, color: T.textMid, fontFamily: mono }}>description.png</span>
                                                    <a href={imgUrl} target="_blank" rel="noopener noreferrer" style={{ color: T.teal, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', fontWeight: 600 }}>
                                                        <ExternalLink size={12} /> open in new tab
                                                    </a>
                                                </div>
                                                <img src={imgUrl} alt="Challenge description" style={{ width: '100%', display: 'block', maxHeight: 600, objectFit: 'contain', background: '#fafafa' }} />
                                            </div>
                                        )}

                                        {(activeDescTab === 'markdown' || (descTabs.length === 1 && hasMarkdown)) && (
                                            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '28px 32px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animation: 'fadeIn 0.3s ease-out' }}>
                                                <MarkdownBlock content={data.description} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* ── Tests tab ── */}
                        {activeTab === 'tests' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'fadeIn 0.3s ease-out' }}>
                                {(!data?.test_cases || data.test_cases.length === 0) ? (
                                    <div style={{ padding: '48px 0', textAlign: 'center', color: T.textDim, fontSize: 13 }}>
                                        no test cases available
                                    </div>
                                ) : data.test_cases.map((tc: any, i: number) => (
                                    <div key={tc.id} style={{
                                        background: T.surface, border: `1px solid ${T.border}`,
                                        borderLeft: `3px solid ${T.teal}66`, borderRadius: 10,
                                        padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                        transition: 'all 0.2s ease', animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both`,
                                    }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: T.textHi, fontFamily: mono }}>
                                                test_{String(i + 1).padStart(2, '0')}
                                            </span>
                                            {tc.is_sample && (
                                                <span style={{
                                                    fontSize: 10, color: T.amber, fontWeight: 700,
                                                    background: T.amberBg, border: `1px solid #fde68a`,
                                                    borderRadius: 4, padding: '3px 9px', fontFamily: mono, letterSpacing: '0.1em',
                                                }}>SAMPLE</span>
                                            )}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                            {[
                                                { label: 'input', val: tc.input_content },
                                                { label: 'expected output', val: tc.output_content },
                                            ].map(({ label, val }) => (
                                                <div key={label}>
                                                    <div style={{ fontSize: 10, color: T.textDim, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, fontFamily: mono }}>
                                                        {label}
                                                    </div>
                                                    <pre style={{
                                                        background: T.raised, border: `1px solid ${T.border}`,
                                                        borderRadius: 8, padding: '12px 16px',
                                                        fontFamily: mono, fontSize: 13, color: T.textHi,
                                                        margin: 0, whiteSpace: 'pre-wrap', minHeight: 64, lineHeight: 1.65,
                                                    }}>
                                                        {val || '—'}
                                                    </pre>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right sidebar ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <button
                            onClick={isJoin ? goToEditor : joinChallenge}
                            disabled={isJoining}
                            style={{
                                width: '100%', padding: '14px 0',
                                background: isJoining ? T.raised : T.teal,
                                border: 'none', borderRadius: 8,
                                color: isJoining ? T.textMid : '#fff',
                                fontSize: 14, fontWeight: 700, cursor: isJoining ? 'not-allowed' : 'pointer',
                                fontFamily: sans,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: isJoining ? 'none' : '0 4px 12px rgba(13,148,136,0.25)',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { if (!isJoining && !isJoin) e.currentTarget.style.transform = 'scale(1.02)'; }}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {isJoin
                                ? <><Code size={15} /> open editor <ArrowRight size={14} /></>
                                : isJoining
                                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> joining…</>
                                : <>join challenge</>}
                        </button>

                        {/* Info card */}
                        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <div style={{ padding: '12px 18px', borderBottom: `1px solid ${T.border}`, fontSize: 11, color: T.textMid, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: mono, background: T.raised }}>
                                challenge info
                            </div>
                            {[
                                { label: 'difficulty', value: diff.label, color: diff.color },
                                { label: 'xp reward',  value: `${data?.xp_reward ?? 100} xp`, color: T.amber },
                                { label: 'test cases', value: `${data?.test_cases?.length ?? 0}`, color: T.textHi },
                                { label: 'participants', value: `${data?.participants_count ?? 0}`, color: T.textHi },
                            ].map(({ label, value, color }, idx, arr) => (
                                <div key={label} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '12px 18px',
                                    borderBottom: idx < arr.length - 1 ? `1px solid ${T.border}` : 'none',
                                    transition: 'background 0.2s ease',
                                }} onMouseEnter={e => e.currentTarget.style.background = T.raised} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                    <span style={{ fontSize: 12, color: T.textMid }}>{label}</span>
                                    <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: mono, textTransform: 'capitalize' }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Created / started */}
                        {(data?.created_at || data?.started_at) && (
                            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                {data?.created_at && (
                                    <div style={{ padding: '14px 18px', borderBottom: data?.started_at ? `1px solid ${T.border}` : 'none', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = T.raised} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div style={{ fontSize: 10, color: T.textDim, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 5, fontFamily: mono }}>created</div>
                                        <div style={{ fontSize: 13, color: T.textHi, fontWeight: 500 }}>
                                            {new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>
                                )}
                                {data?.started_at && isJoin && (
                                    <div style={{ padding: '14px 18px', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = T.raised} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div style={{ fontSize: 10, color: T.textDim, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 5, fontFamily: mono }}>started</div>
                                        <div style={{ fontSize: 13, color: T.textHi, fontWeight: 500 }}>
                                            {new Date(data.started_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes shimmer {
                        100% { transform: translateX(100%); }
                    }
                `}</style> */}
            </div>
        </HomeLayout>
    );
}