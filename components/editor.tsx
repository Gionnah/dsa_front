import { Editor } from "@monaco-editor/react";
import Loader from "./Loader";

export default function EditorComponent({onMount, Language, setLanguage, value, setValue}: {onMount: (editor: any) => void, Language: string, setLanguage: (lang: string) => void, value: string, setValue: (lang: string) => void}) {

    return (
        <div className="">
            <div className="mt-2 rounded-lg">
                <Editor 
                    className="rounded-lg shadow-lg"
                    height="90vh" 
                    theme="vs-dark"
                    language={Language}
                    defaultLanguage={Language} 
                    defaultValue={value}
                    value={value}
                    onChange={(val) => setValue(val || "")}
                    onMount={onMount}
                    loading={<Loader variant="dots" color="blue" />}
                />
            </div>
        </div>
  )
}
