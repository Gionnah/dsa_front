import { ArrowBigDownDash, CloudCheck, File, Play } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CODE_SNIPPETS } from '@/lib/constant';

export default function Console({setLanguage, setValue}: {setLanguage: (lang: string) => void, setValue: (code: string) => void}) {
  return (
    <div className='w-full px-4'>
        <div className="p-2 rounded-t-lg bg-blue-900/15">
            <div className="option flex items-end justify-between">
                <div className="select text-white pb-2">
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
            </div>
            <div className="header flex gap-2 items-center text-sm">
                <button className='flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer border text-teal-500 hover:bg-teal-600/10 transition-all duration-200 hover:shadow-lg hover:scale-105 border-teal-500 border-dashed'>Run <Play className='w-4 h-4'/></button>
                <button className='flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-600/15 transition-all duration-200 text-gray-300 hover:shadow-lg '>Subject <File className='w-4 h-4'/></button>
                <button className='flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-600/15 transition-all duration-200 text-gray-300 hover:shadow-lg '>Input(s) <ArrowBigDownDash className='w-4 h-4'/></button>
                
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800/60 text-white rounded-lg hover:bg-gray-700 transition">
                    save <CloudCheck className="w-4 h-4" />
                </button>
            </div>
        </div>
        <div className="h-[30vh] w-full shadow-inner shadow-black bg-neutral-800 border border-gray-900 mt-2 rounded-b-lg p-4 text-sm text-green-400 font-mono overflow-y-auto">
            <p className='my-1 text-gray-200'>Output: </p>
            {/* Console Output Area */}
        </div>
        <div className="h-[30vh] w-full bg-neutral-800/30 mt-2 rounded-lg p-4 text-sm text-green-400 font-mono overflow-y-auto">
        {/* Console Output Area */}
            <p className='my-2 text-gray-200'>Test: </p>
        </div>
    </div>
  )
}
