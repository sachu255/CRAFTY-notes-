
import React, { useState } from 'react';
import { generateXmlCode } from '../services/geminiService';
import { Play, FileCode, Braces, Zap, Loader2, Sparkles, Send, Copy, Check } from 'lucide-react';

const XmlRunner: React.FC = () => {
  const [xmlContent, setXmlContent] = useState('<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <app>\n    <name>Crafty Notes</name>\n    <version>6.0</version>\n    <developer>Sachu</developer>\n  </app>\n</root>');
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const runXml = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      
      if (parseError.length > 0) {
        setError("Invalid XML: " + parseError[0].textContent);
        setOutput(null);
      } else {
        setError(null);
        // Pretty print attempt for "Run" view
        setOutput("XML is Valid.\n\nStructure:\n" + formatXml(xmlContent));
      }
    } catch (e) {
        setError("Parsing Error");
    }
  };

  const formatXml = (xml: string) => {
      // Basic formatter for display
      let formatted = '';
      let reg = /(>)(<)(\/*)/g;
      xml = xml.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      xml.split('\r\n').forEach(function(node) {
          let indent = 0;
          if (node.match( /.+<\/\w[^>]*>$/ )) {
              indent = 0;
          } else if (node.match( /^<\/\w/ )) {
              if (pad !== 0) {
                  pad -= 1;
              }
          } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
              indent = 1;
          } else {
              indent = 0;
          }

          let padding = '';
          for (let i = 0; i < pad; i++) {
              padding += '  ';
          }

          formatted += padding + node + '\r\n';
          pad += indent;
      });
      return formatted;
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
        const result = await generateXmlCode(aiPrompt);
        setXmlContent(result);
        setAiPrompt('');
        setAiOpen(false);
        setError(null);
        setOutput(null);
    } catch (e) {
        alert("Update Coder failed to generate XML.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-slide-in">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-orange-50">
         <div className="flex items-center gap-2 text-orange-700">
            <div className="bg-orange-200 p-2 rounded-lg"><FileCode size={20}/></div>
            <h2 className="font-bold">XML Runner</h2>
         </div>

         <div className="flex items-center gap-2">
            <button 
                onClick={runXml}
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
            >
                <Play size={16} /> Run / Validate
            </button>
            <button 
                onClick={() => setAiOpen(!aiOpen)}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:scale-105 transition-transform"
            >
                <Zap size={16} /> Update Coder AI
            </button>
         </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Editor */}
          <div className="flex-1 bg-[#1e1e1e] overflow-hidden flex flex-col relative">
             <div className="absolute top-2 right-2 z-10">
                 <button onClick={copyToClipboard} className="text-gray-400 hover:text-white p-2 bg-white/10 rounded-md">
                     {copied ? <Check size={16}/> : <Copy size={16}/>}
                 </button>
             </div>
             <textarea
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                className="flex-1 w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm border-none outline-none resize-none leading-relaxed"
                spellCheck="false"
                placeholder="<!-- Write your XML here -->"
             />
          </div>

          {/* AI Overlay Panel */}
          {aiOpen && (
              <div className="absolute top-0 right-0 w-full md:w-80 h-full bg-white/95 backdrop-blur-xl border-l border-gray-200 z-20 flex flex-col shadow-2xl animate-slide-in">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2"><Sparkles className="text-blue-500" size={18}/> Update Coder</h3>
                      <button onClick={() => setAiOpen(false)} className="text-gray-400 hover:text-gray-600">Close</button>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                      <p className="text-sm text-gray-600 mb-4">
                          I am Update Coder, a specialized AI for XML generation. Tell me what data structure you need.
                      </p>
                      <div className="space-y-2">
                          {['Sitemap', 'RSS Feed', 'Configuration File', 'User Database'].map(suggestion => (
                              <button 
                                key={suggestion}
                                onClick={() => setAiPrompt(`Create a ${suggestion} XML structure`)}
                                className="block w-full text-left px-3 py-2 text-xs bg-gray-100 hover:bg-blue-50 text-gray-700 rounded-lg transition-colors"
                              >
                                  Generate {suggestion}
                              </button>
                          ))}
                      </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                      <div className="relative">
                          <textarea 
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              placeholder="e.g. A list of 5 books with authors..."
                              className="w-full bg-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-200 outline-none pr-10 resize-none h-24"
                          />
                          <button 
                              onClick={handleAiGenerate}
                              disabled={isAiLoading || !aiPrompt}
                              className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                              {isAiLoading ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>}
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* Preview / Output */}
          <div className="flex-1 bg-gray-50 border-l border-gray-200 flex flex-col p-4 overflow-auto">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Braces size={14}/> Parser Output</h3>
              {error ? (
                  <div className="p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 font-mono text-sm whitespace-pre-wrap">
                      {error}
                  </div>
              ) : output ? (
                  <div className="p-4 bg-white text-gray-800 rounded-xl border border-gray-200 font-mono text-sm whitespace-pre-wrap h-full overflow-auto shadow-inner">
                      {output}
                  </div>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                      <Play size={48} className="mb-2 opacity-20"/>
                      <p>Click Run to validate XML</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default XmlRunner;
