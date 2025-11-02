import EditorComponent from '@/components/editor'
import Editor from '@/components/editor'

export default function page() {
  return (
    <div className="bg-gray-950 flex  text-white h-screen w-full p-4">
        <div className="w-3/5">
            <EditorComponent />
        </div>

    </div>
  )
}
