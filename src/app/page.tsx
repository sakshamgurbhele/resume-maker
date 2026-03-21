"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Briefcase, Play, Download, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [latexCode, setLatexCode] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [results, setResults] = useState<{
    latex: string;
    score: number;
    missingKeywords: string[];
  } | null>(null);

  const startOptimization = async () => {
    if (!latexCode.trim() || !jobDesc.trim()) return;

    setStatus('running');
    setProgressLog([]);
    setResults(null);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latexCode,
          jobDescription: jobDesc,
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Parse SSE
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || ''; // keep the incomplete part in the buffer

        for (const part of parts) {
          if (!part.trim()) continue;
          
          let eventType = 'message';
          let dataStr = '';

          const lines = part.split('\n');
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.replace('event:', '').trim();
            } else if (line.startsWith('data:')) {
              dataStr = line.replace('data:', '').trim();
            }
          }

          if (dataStr) {
            try {
              const data = JSON.parse(dataStr);
              
              if (eventType === 'progress') {
                setProgressLog((prev) => [...prev, data.message]);
              } else if (eventType === 'complete') {
                setResults({
                  latex: data.latex,
                  score: data.score,
                  missingKeywords: data.missingKeywords || [],
                });
                setStatus('success');
              } else if (eventType === 'error') {
                setProgressLog((prev) => [...prev, `Error: ${data.message}`]);
                setStatus('error');
              }
            } catch (err) {
              console.error("Failed to parse SSE data", err);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setProgressLog((prev) => [...prev, "A fatal network error occurred."]);
    }
  };

  const downloadTex = () => {
    if (!results) return;
    const blob = new Blob([results.latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-resume.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    if (!results) return;
    try {
      const res = await fetch('/api/compile-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexCode: results.latex }),
      });

      if (!res.ok) throw new Error('Failed to compile PDF');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to compile PDF. The LaTeX code might contain syntax errors or missing packages.");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12 selection:bg-indigo-200">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-2"
          >
            <Briefcase className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            AI Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Tailor</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Optimize your LaTeX resume against any job description automatically. Our AI edits your resume iteratively until it achieves an ATS score of 90+.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Panel 1: LaTeX */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3 text-slate-700 font-semibold">
              <FileText className="w-5 h-5 text-indigo-500"/>
              <h2>Original LaTeX Resume</h2>
            </div>
            <textarea 
              value={latexCode}
              onChange={(e) => setLatexCode(e.target.value)}
              placeholder="Paste your .tex source code here..."
              className="flex-1 min-h-[400px] w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </motion.div>

          {/* Input Panel 2: Job Desc */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3 text-slate-700 font-semibold">
              <Briefcase className="w-5 h-5 text-violet-500"/>
              <h2>Job Description</h2>
            </div>
            <textarea 
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the target job description here..."
              className="flex-1 min-h-[400px] w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all resize-none leading-relaxed"
            />
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            disabled={status === 'running' || !latexCode || !jobDesc}
            onClick={startOptimization}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-full text-lg shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <div className="flex items-center space-x-2">
              {status === 'running' ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  <span>Start Optimization</span>
                </>
              )}
            </div>
          </button>
        </motion.div>

        {/* Status & Results Area */}
        <AnimatePresence>
          {(status === 'running' || status === 'success' || status === 'error') && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 48 }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="max-w-3xl mx-auto space-y-8">
                  
                  {/* Progress Logs */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                      {status === 'running' ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500"/> : <CheckCircle className="w-4 h-4 text-emerald-500"/>}
                      Process Log
                    </h3>
                    <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm h-64 overflow-y-auto space-y-2 text-slate-300">
                      {progressLog.map((log, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3"
                        >
                          <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                          <span className={`${log.includes('Score') ? 'text-indigo-400 font-semibold' : ''} ${log.includes('Error') ? 'text-rose-400' : ''}`}>
                            {log}
                          </span>
                        </motion.div>
                      ))}
                      {progressLog.length === 0 && <span className="text-slate-500 animate-pulse">Waiting to start...</span>}
                      {status === 'running' && <span className="block w-2 h-4 bg-indigo-500 animate-pulse mt-2"/>}
                    </div>
                  </div>

                  {/* Final Results */}
                  {status === 'success' && results && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col md:flex-row items-center gap-8 justify-between"
                    >
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                          <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Final ATS Score</p>
                          <div className="flex items-end justify-center md:justify-start gap-2">
                            <span className="text-5xl font-black text-indigo-600">{results.score}</span>
                            <span className="text-xl text-indigo-300 font-bold mb-1">/100</span>
                          </div>
                        </div>

                        {results.missingKeywords && results.missingKeywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="text-sm text-slate-500 mr-2 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1"/> Unmatched keywords:
                            </span>
                            {results.missingKeywords.map(kw => (
                              <span key={kw} className="px-2 py-1 bg-white border border-rose-200 text-rose-600 text-xs rounded-md font-medium">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button 
                          onClick={downloadTex}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm"
                        >
                          <FileText className="w-5 h-5"/>
                          Download .TEX
                        </button>
                        <button 
                          onClick={downloadPdf}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl border border-transparent hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          <Download className="w-5 h-5"/>
                          Download .PDF
                        </button>
                      </div>

                    </motion.div>
                  )}

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
