"use client"
import { useState, useEffect, useRef } from 'react';
import { CODE_SNIPPETS } from '@/lib/constant';
import InstructionsDrawer from './InstructionsDrawer';

// ─── tiny icon helpers ────────────────────────────────────────────────────────
const Icon = ({ d, size = 13, stroke = '#555', fill = 'none', sw = 1.5 }: { d: string; size?: number; stroke?: string; fill?: string; sw?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const PlayIcon = ({ color = '#555' }) => (
    <svg width={12} height={12} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
);

const LANGUAGES = [
    { value: 'python',     label: 'python' },
    { value: 'javascript', label: 'javascript' },
    { value: 'c',          label: 'c' }
];

// Console color palette — lifted from pure black to a dark blue-gray tint
const C = {
    bg:         '#0e0f14',
    surface:    '#13151e',
    border:     '#252d3d',
    borderSoft: '#1e2535',
    text:       '#8892a4',
    textDim:    '#3d4a60',
    textFaint:  '#2a3347',
    teal:       '#2dd4bf',
    tealDim:    '#134e4a',
    amber:      '#f59e0b',
    amberDim:   '#78350f',
    green:      '#22c55e',
    red:        '#ef4444',
};

// ─── Test row ─────────────────────────────────────────────────────────────────
function TestRow({ index, item, isSelected, onClick, result }: {
    index: number; item: number; isSelected: boolean;
    onClick: () => void; result: any;
}) {
    const passed = result?.passed;
    const hasResult = result !== null && result !== undefined;
    const accentColor = isSelected ? C.teal : hasResult ? (passed ? C.green : C.red) : C.borderSoft;

    return (
        <div onClick={onClick} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: `1px solid ${C.borderSoft}`,
            cursor: 'pointer',
            background: isSelected ? C.surface : 'transparent',
            borderLeft: `2px solid ${accentColor}`,
            transition: 'background 0.12s',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: C.textFaint, fontSize: 10, fontVariantNumeric: 'tabular-nums', width: 18 }}>
                    {String(index + 1).padStart(2, '0')}
                </span>
                <span style={{ color: C.text, fontSize: 11, letterSpacing: '0.04em' }}>test_{item}</span>
            </div>
            <span style={{
                fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: hasResult ? (passed ? C.green : C.red) : C.textFaint,
            }}>
                {hasResult ? (passed ? 'pass' : 'fail') : 'idle'}
            </span>
        </div>
    );
}

// ─── Output panel ─────────────────────────────────────────────────────────────
function OutputPanel({ output, error, resTest, activeMode, loading }: {
    output: string; error: string; resTest: any; activeMode: 'code' | 'test'; loading: boolean;
}) {
    if (loading) return (
        <div style={{ padding: 16, color: C.teal, fontSize: 11, letterSpacing: '0.1em', opacity: 0.5 }}>
            running…
        </div>
    );

    if (activeMode === 'test' && resTest) {
        const { data } = resTest;
        if (!data) return (
            <div style={{ padding: 16, color: C.red, fontSize: 11 }}>{resTest.message || 'Error'}</div>
        );
        const { success, passed_tests, total_tests, results, message } = data;
        return (
            <div style={{ padding: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ color: success ? C.green : C.red, fontSize: 12, letterSpacing: '0.04em' }}>
                        {success ? '✓ all passed' : '✗ some failed'}
                    </span>
                    <span style={{ color: C.textDim, fontSize: 10 }}>{passed_tests}/{total_tests}</span>
                </div>
                {results?.filter((r: any) => !r.passed).map((r: any, i: number) => (
                    <div key={i} style={{ marginBottom: 14, borderLeft: `1px solid ${C.border}`, paddingLeft: 12 }}>
                        <div style={{ color: C.textDim, fontSize: 10, marginBottom: 8, letterSpacing: '0.06em' }}>test_{r.test_number}</div>
                        <div style={{ marginBottom: 6 }}>
                            <div style={{ color: C.textFaint, fontSize: 9, letterSpacing: '0.08em', marginBottom: 3 }}>EXPECTED</div>
                            <pre style={{ color: '#4ade80', fontSize: 11, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{r.expected_output}</pre>
                        </div>
                        <div style={{ marginBottom: 6 }}>
                            <div style={{ color: C.textFaint, fontSize: 9, letterSpacing: '0.08em', marginBottom: 3 }}>GOT</div>
                            <pre style={{ color: '#f87171', fontSize: 11, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{r.user_output}</pre>
                        </div>
                        {r.error && <pre style={{ color: C.amber, fontSize: 11, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{r.error}</pre>}
                        {r.execution_time && <div style={{ color: C.textFaint, fontSize: 10, marginTop: 4 }}>{r.execution_time}s</div>}
                    </div>
                ))}
                {message && <div style={{ color: C.text, fontSize: 10, marginTop: 8 }}>{message}</div>}
            </div>
        );
    }

    if (!output && !error) return (
        <div style={{ padding: 16, color: C.textFaint, fontSize: 11, letterSpacing: '0.08em' }}>no output yet</div>
    );

    return (
        <div style={{ padding: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
            {output && output !== 'No output' && (
                <pre style={{ color: '#a3e4d7', fontSize: 12, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{output}</pre>
            )}
            {error && (
                <pre style={{ color: '#f87171', fontSize: 12, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{error}</pre>
            )}
        </div>
    );
}

// ─── Main Console ─────────────────────────────────────────────────────────────
export default function Console({
    error, code, id, output, loading, loadingSubmit, submitCode,
    runCode, setLanguage, setValue, runSingleTest, runAllTest,
    challengeData, resTest, activeMode, onSave, loadingSave, executionTime,
    Language,
}: {
    error: string; submitCode: (code: string, id: string) => void;
    output: string; id: string; loading: boolean; loadingSubmit: boolean;
    code: string; runCode: () => void; setLanguage: (lang: string) => void;
    setValue: (code: string) => void; challengeData: any;
    runSingleTest: (id: number) => void; runAllTest: () => void; resTest: any;
    activeMode: 'code' | 'test'; onSave: () => void; loadingSave: boolean;
    executionTime?: number; Language: string;
}) {
    const [selectedTestIndex, setSelectedTestIndex] = useState(-1);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [activePanel, setActivePanel] = useState<'output' | 'tests'>('output');

    const getTestResult = (index: number) => {
        if (!resTest?.data?.results) return null;
        return resTest.data.results.find((r: any) => r.test_number === index + 1) ?? null;
    };

    const testCases = challengeData?.test_cases ?? [];
    const passCount = resTest?.data?.passed_tests;
    const totalCount = resTest?.data?.total_tests;

    const Btn = ({ children, onClick, disabled = false, style = {} }: any) => (
        <button onClick={onClick} disabled={disabled} style={{
            background: 'none', border: `1px solid ${C.borderSoft}`, borderRadius: 3,
            color: disabled ? C.textFaint : C.textDim, fontSize: 11, letterSpacing: '0.05em',
            padding: '6px 14px', cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s', fontFamily: "'IBM Plex Mono', monospace",
            display: 'flex', alignItems: 'center', gap: 6,
            ...style,
        }}>{children}</button>
    );

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            background: C.bg, fontFamily: "'IBM Plex Mono', monospace",
            overflow: 'hidden',
        }}>
            {/* ── Instructions Drawer ── */}
            <InstructionsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                challengeData={challengeData}
                cloudinaryBase={`{process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_URL}`}
            />

            {/* ── Submit confirm modal ── */}
            {showSubmitConfirm && (
                <div style={{
                    position: 'fixed', inset: 0, background: '#000000cc',
                    zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{
                        background: '#11121a', border: `1px solid ${C.borderSoft}`,
                        borderRadius: 6, padding: 28, maxWidth: 380, width: '90%',
                    }}>
                        <div style={{ color: '#888', fontSize: 12, marginBottom: 8, letterSpacing: '0.06em' }}>SUBMIT CHALLENGE</div>
                        <p style={{ color: C.textDim, fontSize: 11, lineHeight: 1.6, marginBottom: 6 }}>
                            This will end the challenge and lock your submission. Points are awarded based on passing tests.
                        </p>
                        <p style={{ color: C.textFaint, fontSize: 11, lineHeight: 1.6, marginBottom: 20 }}>
                            You can retry later, but this attempt will be scored.
                        </p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setShowSubmitConfirm(false)} style={{
                                flex: 1, background: 'none', border: `1px solid ${C.borderSoft}`,
                                color: C.textDim, fontSize: 11, padding: '8px 0', borderRadius: 3,
                                cursor: 'pointer', letterSpacing: '0.05em',
                            }}>cancel</button>
                            <button onClick={() => { submitCode(code, id); setShowSubmitConfirm(false); }} style={{
                                flex: 1, background: C.surface, border: `1px solid ${C.border}`,
                                color: '#888', fontSize: 11, padding: '8px 0', borderRadius: 3,
                                cursor: 'pointer', letterSpacing: '0.05em',
                            }}>submit →</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Action bar ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px',
                borderBottom: `1px solid #1a1c26`,
                background: '#0b0c11',
                flexShrink: 0, gap: 8,
            }}>
                {/* Run */}
                <button
                    onClick={runCode}
                    disabled={loading}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        background: loading ? 'transparent' : C.surface,
                        border: `1px solid ${C.borderSoft}`,
                        color: loading ? C.textFaint : C.text,
                        fontSize: 11, padding: '6px 14px', borderRadius: 3,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        letterSpacing: '0.05em', transition: 'all 0.15s',
                        fontFamily: "'IBM Plex Mono', monospace",
                    }}
                >
                    <PlayIcon color={loading ? C.textFaint : C.text} />
                    {loading ? 'running…' : 'run'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {/* Language selector */}
                    <div style={{ position: 'relative' }}>
                        <select
                            value={Language}
                            onChange={e => setLanguage(e.target.value)}
                            style={{
                                appearance: 'none',
                                background: C.surface,
                                border: `1px solid ${C.borderSoft}`,
                                borderRadius: 3,
                                color: C.text,
                                fontSize: 11,
                                padding: '6px 24px 6px 10px',
                                fontFamily: "'IBM Plex Mono', monospace",
                                cursor: 'pointer',
                                letterSpacing: '0.04em',
                                outline: 'none',
                            }}
                        >
                            {LANGUAGES.map(l => (
                                <option key={l.value} value={l.value}>{l.label}</option>
                            ))}
                        </select>
                        {/* caret */}
                        <svg
                            width="8" height="8" viewBox="0 0 24 24"
                            fill="none" stroke={C.textDim} strokeWidth="2"
                            style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>

                    {/* Instructions */}
                    <Btn onClick={() => setDrawerOpen(true)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                        </svg>
                        instructions
                    </Btn>

                    {/* Run all tests */}
                    <Btn onClick={runAllTest} disabled={loading}>
                        run all tests
                    </Btn>

                    {/* Submit */}
                    <button
                        onClick={() => setShowSubmitConfirm(true)}
                        disabled={loadingSubmit}
                        style={{
                            background: C.surface, border: `1px solid ${C.border}`,
                            color: loadingSubmit ? C.textFaint : C.textDim, fontSize: 11,
                            padding: '6px 14px', borderRadius: 3,
                            cursor: loadingSubmit ? 'not-allowed' : 'pointer',
                            letterSpacing: '0.05em', fontFamily: "'IBM Plex Mono', monospace",
                        }}
                    >
                        {loadingSubmit ? 'submitting…' : 'submit'}
                    </button>
                </div>
            </div>

            {/* ── Panel tabs ── */}
            <div style={{
                display: 'flex', alignItems: 'center',
                borderBottom: '1px solid #111',
                background: '#0b0c11',
                flexShrink: 0,
            }}>
                {(['output', 'tests'] as const).map(tab => (
                    <button key={tab} onClick={() => setActivePanel(tab)} style={{
                        background: 'none', border: 'none',
                        borderBottom: `1px solid ${activePanel === tab ? C.border : 'transparent'}`,
                        color: activePanel === tab ? C.textDim : C.textFaint,
                        fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '8px 14px', cursor: 'pointer',
                        transition: 'all 0.15s', fontFamily: "'IBM Plex Mono', monospace",
                        marginBottom: -1,
                    }}>
                        {tab}
                        {tab === 'tests' && totalCount != null && (
                            <span style={{ marginLeft: 6, color: C.textFaint }}>{passCount}/{totalCount}</span>
                        )}
                    </button>
                ))}

                {/* Execution time */}
                {executionTime != null && executionTime > 0 && (
                    <span style={{ marginLeft: 'auto', paddingRight: 12, color: C.textFaint, fontSize: 10, letterSpacing: '0.06em' }}>
                        {executionTime}ms
                    </span>
                )}
            </div>

            {/* ── Output panel ── */}
            {activePanel === 'output' && (
                <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.borderSoft} ${C.bg}` }}>
                    <OutputPanel output={output} error={error} resTest={resTest} activeMode={activeMode} loading={loading} />
                </div>
            )}

            {/* ── Tests panel ── */}
            {activePanel === 'tests' && (
                <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: `${C.borderSoft} ${C.bg}` }}>
                    {testCases.length === 0 ? (
                        <div style={{ padding: 16, color: C.textFaint, fontSize: 11, letterSpacing: '0.08em' }}>no test cases</div>
                    ) : (
                        testCases.map((tc: any, i: number) => (
                            <TestRow
                                key={tc.id}
                                index={i}
                                item={tc.id}
                                isSelected={selectedTestIndex === i}
                                result={getTestResult(i)}
                                onClick={() => {
                                    setSelectedTestIndex(i);
                                    runSingleTest(tc.id);
                                    setActivePanel('output');
                                }}
                            />
                        ))
                    )}
                </div>
            )}

            {/* ── Bottom meta ── */}
            <div style={{
                borderTop: '1px solid #111',
                padding: '6px 14px',
                background: '#090a0f',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <span style={{ color: C.textFaint, fontSize: 10, letterSpacing: '0.06em' }}>
                    {testCases.length} test{testCases.length !== 1 ? 's' : ''}
                </span>
                {resTest?.data && (
                    <span style={{
                        fontSize: 10, letterSpacing: '0.06em',
                        color: resTest.data.success ? '#16a34a' : '#dc2626',
                    }}>
                        {resTest.data.passed_tests}/{resTest.data.total_tests} passed
                    </span>
                )}
            </div>
        </div>
    );
}