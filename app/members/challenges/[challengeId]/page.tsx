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

// ─── Markdown renderer ────────────────────────────────────────────────────────
function MarkdownBlock({ content }: { content: string }) {
    const html = content
        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="mb-pre"><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code class="mb-code">$1</code>')
        .replace(/^### (.+)$/gm, '<h3 class="mb-h3">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="mb-h2">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="mb-h1">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="mb-a">$1</a>')
        .replace(/^- (.+)$/gm, '<li class="mb-li">$1</li>')
        .replace(/\n\n/g, '</p><p class="mb-p">');
    return (
        <>
            <style>{`
                .mb-h1{color:${T.textHi};font-size:1.4rem;font-weight:800;margin:1.2rem 0 .5rem;font-family:${sans}}
                .mb-h2{color:${T.textHi};font-size:1.1rem;font-weight:700;margin:1.2rem 0 .4rem;padding-bottom:.4rem;border-bottom:2px solid ${T.border};font-family:${sans}}
                .mb-h3{color:${T.textMid};font-size:.95rem;font-weight:600;margin:1rem 0 .3rem;font-family:${sans}}
                .mb-p{color:${T.text};margin:.6rem 0;line-height:1.8;font-size:14px;font-family:${sans}}
                .mb-pre{background:${T.raised};border:1px solid ${T.border};border-radius:8px;padding:1rem 1.2rem;overflow-x:auto;margin:.8rem 0;font-family:${mono};font-size:12px;color:${T.teal};line-height:1.7}
                .mb-code{background:${T.raised};border:1px solid ${T.border};border-radius:4px;padding:.1em .4em;font-size:.85em;color:${T.teal};font-family:${mono}}
                .mb-a{color:${T.teal};text-decoration:underline;text-underline-offset:2px}
                .mb-li{color:${T.text};margin:.25rem 0 .25rem 1.4rem;list-style:disc;font-size:14px;line-height:1.7;font-family:${sans}}
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: `<p class="mb-p">${html}</p>` }} />
        </>
    );
}

function LoadingScreen({ message = 'loading…' }) {
    return (
        <HomeLayout>
            <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono }}>
                <div style={{ textAlign: 'center', color: T.textDim }}>
                    <Loader2 size={22} style={{ margin: '0 auto 14px', animation: 'spin 1s linear infinite', color: T.teal }} />
                    <p style={{ fontSize: 12, letterSpacing: '0.08em' }}>{message}</p>
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
            </div>
        </HomeLayout>
    );
}

export default function OneChallenge() {
    const router = useRouter();
    const { challengeId } = useParams<{ challengeId: string }>();
    const [data, setData] = useState<any>(null);
    const [isJoin, setIsJoin] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'tests'>('description');
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const cloudBase = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`/api/challenges/${challengeId}`, { headers: { 'Content-Type': 'application/json' } });
                const d = await res.json();
                setData(d);
                setIsJoin(d.join || false);
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        })();
    }, []);

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

    // ── Only render content types that actually exist ──────────────────────
    const hasPdf = !!data?.description_pdf;
    const hasImg = !!data?.description_img;
    const hasMarkdown = !!data?.description?.trim();
    const pdfUrl  = hasPdf ? `${cloudBase}/${data.description_pdf}` : null;
    const imgUrl  = hasImg ? `${cloudBase}/${data.description_img}` : null;
    const hasAnyDescription = hasPdf || hasImg || hasMarkdown;

    // Build tab list only from what exists
    type DescTab = 'pdf' | 'image' | 'markdown';
    const descTabs: DescTab[] = [
        ...(hasPdf      ? ['pdf'      as DescTab] : []),
        ...(hasImg      ? ['image'    as DescTab] : []),
        ...(hasMarkdown ? ['markdown' as DescTab] : []),
    ];

    const [activeDescTab, setActiveDescTab] = useState<DescTab | null>(null);

    // Set default desc tab once data loads
    useEffect(() => {
        if (descTabs.length > 0 && !activeDescTab) setActiveDescTab(descTabs[0]);
    }, [data]);

    const descTabLabel: Record<DescTab, string> = { pdf: 'PDF', image: 'image', markdown: 'description' };


    if (isRedirecting || isLoading) return <LoadingScreen message={isRedirecting ? 'opening editor…' : 'loading challenge…'} />;

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
                            fontSize: 13, textDecoration: 'none',
                        }}>
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
                            }}>
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
                                transition: 'all 0.15s',
                            }}>
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
                        <div style={{ marginBottom: 28 }}>
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
                                    transition: 'all 0.15s', fontFamily: sans,
                                }}>
                                    {tab === 'tests'
                                        ? `tests (${data?.test_cases?.length ?? 0})`
                                        : 'description'}
                                </button>
                            ))}
                        </div>

                        {/* ── Description tab ── */}
                        {activeTab === 'description' && (
                            <div>
                                {!hasAnyDescription ? (
                                    <div style={{ padding: '48px 0', textAlign: 'center', color: T.textDim, fontSize: 13 }}>
                                        no description available
                                    </div>
                                ) : (
                                    <>
                                        {/* Sub-tabs — only if more than one source */}
                                        {descTabs.length > 1 && (
                                            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                                                {descTabs.map(t => (
                                                    <button key={t} onClick={() => setActiveDescTab(t)} style={{
                                                        background: activeDescTab === t ? T.tealBg : T.surface,
                                                        border: `1px solid ${activeDescTab === t ? T.tealBdr : T.border}`,
                                                        borderRadius: 6, color: activeDescTab === t ? T.teal : T.textMid,
                                                        fontSize: 12, fontWeight: activeDescTab === t ? 700 : 400,
                                                        padding: '6px 16px', cursor: 'pointer', fontFamily: mono,
                                                        transition: 'all 0.15s',
                                                    }}>
                                                        {descTabLabel[t]}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {/* PDF */}
                                        {(activeDescTab === 'pdf' || (descTabs.length === 1 && hasPdf)) && pdfUrl && (
                                            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    padding: '12px 18px', background: T.raised, borderBottom: `1px solid ${T.border}`,
                                                }}>
                                                    <span style={{ fontSize: 12, color: T.textMid, fontFamily: mono }}>challenge.pdf</span>
                                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{
                                                        color: T.teal, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5,
                                                        textDecoration: 'none', fontWeight: 600,
                                                    }}>
                                                        <ExternalLink size={12} /> open in new tab
                                                    </a>
                                                </div>
                                                <iframe src={`${pdfUrl}#toolbar=0`} style={{ width: '100%', height: 620, display: 'block', border: 'none', background: '#fff' }} title="PDF" />
                                            </div>
                                        )}

                                        {/* Image */}
                                        {(activeDescTab === 'image' || (descTabs.length === 1 && hasImg)) && imgUrl && (
                                            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
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

                                        {/* Markdown */}
                                        {(activeDescTab === 'markdown' || (descTabs.length === 1 && hasMarkdown)) && (
                                            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '28px 32px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                                <MarkdownBlock content={data.description} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {/* ── Tests tab ── */}
                        {activeTab === 'tests' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {(!data?.test_cases || data.test_cases.length === 0) ? (
                                    <div style={{ padding: '48px 0', textAlign: 'center', color: T.textDim, fontSize: 13 }}>
                                        no test cases available
                                    </div>
                                ) : data.test_cases.map((tc: any, i: number) => (
                                    <div key={tc.id} style={{
                                        background: T.surface, border: `1px solid ${T.border}`,
                                        borderLeft: `3px solid ${T.teal}66`, borderRadius: 10,
                                        padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                                    }}>
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

                        {/* CTA */}
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
                                transition: 'all 0.15s',
                            }}
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
                                }}>
                                    <span style={{ fontSize: 12, color: T.textMid }}>{label}</span>
                                    <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: mono, textTransform: 'capitalize' }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Created / started */}
                        {(data?.created_at || data?.started_at) && (
                            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                                {data?.created_at && (
                                    <div style={{ padding: '14px 18px', borderBottom: data?.started_at ? `1px solid ${T.border}` : 'none' }}>
                                        <div style={{ fontSize: 10, color: T.textDim, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 5, fontFamily: mono }}>created</div>
                                        <div style={{ fontSize: 13, color: T.textHi, fontWeight: 500 }}>
                                            {new Date(data.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>
                                )}
                                {data?.started_at && isJoin && (
                                    <div style={{ padding: '14px 18px' }}>
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

                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        </HomeLayout>
    );
}