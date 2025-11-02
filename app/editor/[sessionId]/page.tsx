"use client"
import Console from '@/components/console'
import EditorComponent from '@/components/editor'
import { useRef, useState } from 'react';

export default function page() {
    const editorRef = useRef(null);
    const [value, setValue] = useState<string>("");
    const [Language, setLanguage] = useState<string>("");

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }
  return (
    <div className="bg-neutral-900 flex text-white h-screen w-full p-4">
        <div className="w-3/5">
            <EditorComponent value={value} setValue={setValue} onMount={onMount} Language={Language} setLanguage={setLanguage}/>
        </div>
        <div className="w-2/5">
            <Console setLanguage={setLanguage} setValue={setValue}/>
        </div>
    </div>
  )
}
