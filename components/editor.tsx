"use client"
import { CloudCheck } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { DiffEditor, Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import { on } from "events";
import { CODE_SNIPPETS, Languages_version } from "@/lib/constant";



const Languages = Object.entries(Languages_version);

export default function EditorComponent() {
    const editorRef = useRef(null);
    const [value, setValue] = useState<string>("");
    const [Language, setLanguage] = useState<string>("");

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }
    return (
        <div>
            <div className="option flex items-end justify-between">
                <div className="select text-white">
                    <p className="text-gray-600 py-2">Language: </p>
                    <Select onValueChange={(value: string) => {setLanguage(value); setValue( CODE_SNIPPETS[value]);}}>
                        <SelectTrigger className="w-[120px] text-white bg-gray-800">
                            <SelectValue placeholder="python 3" />
                        </SelectTrigger>
                        <SelectContent className="text-white">
                            <SelectGroup className="bg-gray-800">
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="javascript">Javascript</SelectItem>
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="python">python 3</SelectItem>
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="java">Java</SelectItem>
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="php">Php</SelectItem>
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="c">C</SelectItem>
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="r">R</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <button className="flex items-center justify-center gap-2 px-3 py-1 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition">
                    save <CloudCheck className="w-4 h-4" />
                </button>
            </div>
            <div className="mt-2 rounded-lg">
                <Editor 
                    className="rounded-lg"
                    height="80vh" 
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
