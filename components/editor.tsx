"use client"
import { Editor, useMonaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

const LANG_EXT: Record<string, string> = { python: 'py', javascript: 'js', typescript: 'ts', java: 'java', c: 'c' };

export default function EditorComponent({
    onMount, Language, setLanguage, value, setValue,
}: {
    onMount: (editor: any) => void;
    Language: string;
    setLanguage: (lang: string) => void;
    value: string;
    setValue: (val: string) => void;
}) {
    const monaco = useMonaco();
    const editorRef = useRef<any>(null);
    const [cursor, setCursor] = useState({ line: 1, col: 1 });
    const [lines, setLines] = useState(1);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!monaco) return;
        monaco.editor.defineTheme('void', {
            base: 'vs-dark', inherit: true,
            rules: [
                { token: 'comment', foreground: '2e2e2e', fontStyle: 'italic' },
                { token: 'keyword', foreground: '777777' },
                { token: 'string', foreground: '8a8a8a' },
                { token: 'number', foreground: 'aaaaaa' },
                { token: 'type', foreground: '777777' },
                { token: 'function', foreground: 'c0c0c0' },
                { token: 'variable', foreground: 'b0b0b0' },
                { token: 'operator', foreground: '555555' },
            ],
            colors: {
                'editor.background': '#080808',
                'editor.foreground': '#c8c8c8',
                'editorLineNumber.foreground': '#1e1e1e',
                'editorLineNumber.activeForeground': '#444444',
                'editor.lineHighlightBackground': '#0e0e0e',
                'editor.selectionBackground': '#1e1e1e',
                'editorCursor.foreground': '#dddddd',
                'editorGutter.background': '#080808',
                'scrollbarSlider.background': '#181818',
                'scrollbarSlider.hoverBackground': '#222222',
                'editor.inactiveSelectionBackground': '#161616',
                'editorIndentGuide.background1': '#111111',
                'editorBracketMatch.background': '#181818',
                'editorBracketMatch.border': '#2e2e2e',
                'editorWidget.background': '#0d0d0d',
                'editorWidget.border': '#1e1e1e',
                'list.hoverBackground': '#0f0f0f',
                'dropdown.background': '#0d0d0d',
                'editorSuggestWidget.background': '#0d0d0d',
                'editorSuggestWidget.border': '#1e1e1e',
            },
        });
        monaco.editor.setTheme('void');
    }, [monaco]);

    const handleMount = (editor: any) => {
        editorRef.current = editor;
        onMount(editor);
        editor.onDidChangeCursorPosition((e: any) =>
            setCursor({ line: e.position.lineNumber, col: e.position.column })
        );
        editor.onDidChangeModelContent(() =>
            setLines(editor.getModel()?.getLineCount() ?? 1)
        );
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(editorRef.current?.getValue() ?? '');
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const ext = LANG_EXT[Language] ?? 'txt';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#080808' }}>

            {/* ── Tab bar ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid #141414', height: 36, flexShrink: 0,
                background: '#060606',
            }}>
                <div style={{ display: 'flex', alignItems: 'stretch', height: '100%', flex: 1 }}>
                    {/* Active tab */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '0 16px',
                        borderRight: '1px solid #141414',
                        background: '#080808',
                        color: '#555',
                        fontSize: 11,
                        letterSpacing: '0.04em',
                        position: 'relative',
                        flexShrink: 0,
                    }}>
                        {/* top line = active */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: '#2e2e2e' }} />
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>solution.{ext}</span>
                    </div>
                    <div style={{ flex: 1, borderBottom: '1px solid #141414', background: '#060606' }} />
                </div>

                {/* Copy btn */}
                <button onClick={handleCopy} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: copied ? '#22c55e' : '#2a2a2a', fontSize: 11,
                    padding: '0 14px', height: '100%',
                    letterSpacing: '0.05em', transition: 'color 0.2s',
                    display: 'flex', alignItems: 'center', gap: 5,
                    borderLeft: '1px solid #141414',
                }}>
                    {copied
                        ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>copied</>
                        : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>copy</>
                    }
                </button>
            </div>

            {/* ── Monaco ── */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Editor
                    height="100%"
                    theme="void"
                    language={Language}
                    value={value}
                    onChange={(val) => setValue(val ?? '')}
                    onMount={handleMount}
                    loading={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#1e1e1e', fontSize: 11, letterSpacing: '0.12em' }}>
                            loading…
                        </div>
                    }
                    options={{
                        fontSize: 13,
                        fontFamily: "'IBM Plex Mono', 'Fira Code', Consolas, monospace",
                        fontLigatures: true,
                        lineHeight: 22,
                        minimap: { enabled: false },
                        scrollbar: { verticalScrollbarSize: 3, horizontalScrollbarSize: 3, useShadows: false },
                        padding: { top: 24, bottom: 24 },
                        renderLineHighlight: 'line',
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        cursorStyle: 'line',
                        cursorWidth: 1,
                        smoothScrolling: true,
                        bracketPairColorization: { enabled: false },
                        guides: { indentation: false, bracketPairs: false },
                        wordWrap: 'off',
                        tabSize: 4,
                        insertSpaces: true,
                        autoClosingBrackets: 'always',
                        autoClosingQuotes: 'always',
                        quickSuggestions: { other: true, comments: false, strings: false },
                        parameterHints: { enabled: true },
                        renderWhitespace: 'none',
                        stickyScroll: { enabled: false },
                        folding: false,
                        glyphMargin: false,
                        overviewRulerBorder: false,
                        overviewRulerLanes: 0,
                        hideCursorInOverviewRuler: true,
                        scrollBeyondLastLine: false,
                        lineNumbersMinChars: 4,
                    }}
                />
            </div>

            {/* ── Status bar ── */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px', height: 22,
                borderTop: '1px solid #111',
                background: '#050505',
                flexShrink: 0,
                color: '#252525', fontSize: 10,
                letterSpacing: '0.08em',
                fontFamily: "'IBM Plex Mono', monospace",
            }}>
                <span style={{ textTransform: 'uppercase' }}>{Language} · {lines} ln</span>
                <span>Ln {cursor.line} · Col {cursor.col} · UTF-8</span>
            </div>
        </div>
    );
}
