import { Volume2 } from 'lucide-react'
import React from 'react'

const dashbardcard1 = ({icon,title,discription, btnTitle,location}) => {
  return (
    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-6 border-2 border-violet-100 hover:border-violet-300 transition-all cursor-pointer"
    onClick={() => navigate('/text-to-speech')}>
 <div className="flex items-center mb-4">
   <div className="p-3 bg-violet-100 rounded-lg">
     <Volume2 size={24} className="text-violet-600" />
   </div>
   <div className="ml-4">
     <h4 className="text-lg font-semibold text-violet-800">Text to Speech</h4>
     <p className="text-violet-600">Convert your text into natural speech</p>
   </div>
 </div>
 <p className="text-gray-600 mb-4">Transform written content into clear, natural-sounding speech. Perfect for learning pronunciation and listening practice.</p>
 <button className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition-colors">
   Start Converting
 </button>
</div>
  )
}

export default dashbardcard1