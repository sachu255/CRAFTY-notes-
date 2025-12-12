
import React, { useState } from 'react';
import { Bug, Send, AlertTriangle, CheckCircle, Info, Image, X } from 'lucide-react';

const CraftyBug: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [submitted, setSubmitted] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    
    // Simulate API call
    setTimeout(() => {
        setSubmitted(true);
        setTitle('');
        setDescription('');
        setSeverity('low');
        setAttachment(null);
    }, 1500);
  };

  const handleAttach = () => {
      // Simulate file picker
      setAttachment("https://via.placeholder.com/150");
  };

  if (submitted) {
      return (
          <div className="max-w-2xl mx-auto h-[calc(100vh-8rem)] flex items-center justify-center animate-in fade-in zoom-in">
              <div className="bg-white p-8 rounded-3xl shadow-xl text-center border border-green-100">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                      <CheckCircle size={40}/>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted!</h2>
                  <p className="text-gray-500 mb-6">Thanks for helping us squash bugs. The Crafter Studio team will look into it.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-colors"
                  >
                      Report Another
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-slide-in flex flex-col">
        {/* Header */}
        <div className="p-6 bg-red-50 border-b border-red-100 flex items-center gap-4">
            <div className="p-3 bg-red-200 text-red-700 rounded-xl">
                <Bug size={32}/>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Crafty Bug Reporter</h2>
                <p className="text-sm text-gray-500">Found a glitch? Let us know!</p>
            </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bug Title</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Note Lock not working with numbers"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what happened..."
                        className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none resize-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Attachment</label>
                    {attachment ? (
                        <div className="relative inline-block">
                            <img src={attachment} alt="attachment" className="h-20 rounded-lg border border-gray-200"/>
                            <button onClick={() => setAttachment(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12}/></button>
                        </div>
                    ) : (
                        <button type="button" onClick={handleAttach} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 font-medium">
                            <Image size={16}/> Add Screenshot
                        </button>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Severity</label>
                    <div className="flex gap-4">
                        {['low', 'medium', 'high'].map(sev => (
                            <button
                                key={sev}
                                type="button"
                                onClick={() => setSeverity(sev as any)}
                                className={`flex-1 py-3 rounded-xl border-2 font-bold capitalize transition-all
                                    ${severity === sev 
                                        ? (sev === 'low' ? 'border-green-500 bg-green-50 text-green-700' : sev === 'medium' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-red-500 bg-red-50 text-red-700') 
                                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'}
                                `}
                            >
                                {sev}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-sm text-blue-800 border border-blue-100">
                    <Info className="shrink-0"/>
                    <p>Your feedback helps us improve Crafter Notes. Please include specific details about steps to reproduce the issue.</p>
                </div>

                <button 
                    type="submit"
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                    <Send size={20}/> Submit Report
                </button>
            </form>
        </div>
    </div>
  );
};

export default CraftyBug;
