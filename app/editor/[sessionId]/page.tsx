"use client"
import Console from '@/components/console'
import EditorComponent from '@/components/editor'
import { CODE_SNIPPETS } from '@/lib/constant';
import { useRef, useState } from 'react';

export default function page() {
    const editorRef = useRef(null);
    const [code, setCode] = useState<string>(CODE_SNIPPETS["python"]);
    const [Language, setLanguage] = useState<string>("python");
    const [output, setOutput] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const runCode = async () => {
        setLoading(true);
        alert("Running code..."+ code);
        const res = await fetch("/api/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                source_code: code,
                language_id: 71, // Python 3
            }),
        });

        const { token } = await res.json();

        // Poll result until it's ready
        let result;
        while (true) {
            const r = await fetch(`/api/submissions?token=${token}`);
            result = await r.json();
            if (result.status?.id > 2) break; // 1: In Queue, 2: Processing
            await new Promise((r) => setTimeout(r, 1000));
        }

        setOutput(result.stdout  || "No output");
        setError(result.stderr)
        setLoading(false);
    };

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }

    return (
        <div className="bg-neutral-900 flex text-white h-screen w-full p-4">
            <div className="w-4/6">
                <EditorComponent value={code} setValue={setCode} onMount={onMount} Language={Language} setLanguage={setLanguage}/>
            </div>
            <div className="w-2/6">
                <Console error={error} output={output} runCode={runCode} loading={loading} setLanguage={setLanguage} setValue={setCode}/>
            </div>
        </div>
  )
}
