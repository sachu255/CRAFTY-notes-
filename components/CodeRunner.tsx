
import React, { useState, useEffect } from 'react';
import { generateWebCode } from '../services/geminiService';
import { Code, FileCode, Layers, Sparkles, Send, FileText, Loader2 } from 'lucide-react';

const CodeRunner: React.FC = () => {
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>Welcome to Code Runner</p>');
  const [css, setCss] = useState('body {\n  font-family: sans-serif;\n  background: #f0f0f0;\n  padding: 20px;\n}\nh1 { color: #3b82f6; }');
  const [js, setJs] = useState('console.log("Hello from JS!");');
  const [markdown, setMarkdown] = useState('# Hello Markdown\n\n- List item 1\n- List item 2\n\n**Bold Text**');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js' | 'md'>('html');
  const [srcDoc, setSrcDoc] = useState('');
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (activeTab === 'md') return; 
      setSrcDoc(`
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `);
    }, 500); 

    return () => clearTimeout(timeout);
  }, [html, css, js, activeTab]);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
        const result = await generateWebCode(aiPrompt);
        if (result.html) setHtml(result.html);
        if (result.css) setCss(result.css);
        if (result.js) setJs(result.js);
        setAiPrompt('');
        setAiOpen(false);
    } catch (e) {
        alert("Crafter Code AI failed to generate code. Try again.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const renderMarkdown = (md: string) => {
      // Simple markdown parser for preview
      return md
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        .replace(/\n/gim, '<br />');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
         <div className="flex gap-2 overflow-x-auto">
            <button onClick={() => setActiveTab('html')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'html' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-200'}`}><Code size={16} /> HTML</button>
            <button onClick={() => setActiveTab('css')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'css' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}><Layers size={16} /> CSS</button>
            <button onClick={() => setActiveTab('js')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'js' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600 hover:bg-gray-200'}`}><FileCode size={16} /> JS</button>
            <button onClick={() => setActiveTab('md')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'md' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-200'}`}><FileText size={16} /> MD</button>
         </div>

         <div className="flex items-center gap-2">
            <button onClick={() => setAiOpen(!aiOpen)} className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-bold shadow-md hover:scale-105 transition-transform"><Sparkles size={16} /> AI Code</button>
         </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          <div className="flex-1 bg-[#1e1e1e] overflow-hidden flex flex-col">
             <textarea
                value={activeTab === 'html' ? html : activeTab === 'css' ? css : activeTab === 'js' ? js : markdown}
                onChange={(e) => {
                    if (activeTab === 'html') setHtml(e.target.value);
                    else if (activeTab === 'css') setCss(e.target.value);
                    else if (activeTab === 'js') setJs(e.target.value);
                    else setMarkdown(e.target.value);
                }}
                className="flex-1 w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm border-none outline-none resize-none"
                spellCheck="false"
                placeholder={`Write your ${activeTab.toUpperCase()} code here...`}
             />
          </div>

          {/* AI Overlay Panel */}
          {aiOpen && (
              <div className="absolute top-0 left-0 w-full md:w-80 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200 z-10 flex flex-col shadow-2xl animate-slide-in">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2"><Sparkles className="text-purple-500" size={18}/> Code Gen</h3>
                      <button onClick={() => setAiOpen(false)} className="text-gray-400 hover:text-gray-600">Close</button>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                      <p className="text-sm text-gray-600 mb-4">Describe the website component.</p>
                      <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g. A red button..." className="w-full bg-gray-100 rounded-xl p-3 text-sm h-32 outline-none"/>
                      <button onClick={handleAiGenerate} disabled={isAiLoading || !aiPrompt} className="w-full mt-2 p-2 bg-purple-600 text-white rounded-lg disabled:opacity-50">{isAiLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Generate'}</button>
                  </div>
              </div>
          )}

          {/* Preview */}
          <div className="flex-1 bg-white border-l border-gray-200 flex flex-col relative">
              <div className="bg-gray-100 px-3 py-1 text-xs text-gray-500 border-b border-gray-200 flex justify-between items-center">
                  <span>Live Preview</span>
              </div>
              {activeTab === 'md' ? (
                  <div className="p-4 prose prose-sm overflow-auto h-full" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
              ) : (
                  <iframe srcDoc={srcDoc} title="output" sandbox="allow-scripts" className="flex-1 w-full h-full bg-white" width="100%" height="100%"/>
              )}
          </div>
      </div>
    </div>
  );
};

export default CodeRunner;
