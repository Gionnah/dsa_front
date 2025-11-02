import { CloudCheck } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { CODE_SNIPPETS, Languages_version } from "@/lib/constant";



const Languages = Object.entries(Languages_version);

export default function EditorComponent({onMount, Language, setLanguage, value, setValue}: {onMount: (editor: any) => void, Language: string, setLanguage: (lang: string) => void, value: string, setValue: (lang: string) => void}) {

    return (
        <div className="">
            <div className="mt-2 rounded-lg">
                <Editor 
                    className="rounded-lg shadow-lg"
                    height="90vh" 
                    theme="vs-dark"
                    language={Language}
                    defaultLanguage="python" 
                    defaultValue={CODE_SNIPPETS["python"]}
                    value={value}
                    onChange={(val) => setValue(val || "")}
                    onMount={onMount}
                />
            </div>
        </div>
  )
}
