import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { CodePreview } from './components/CodePreview';
import { LoadingScreen } from './components/LoadingScreen';
import { generateCodeFromImage } from './services/geminiService';
import { AppState, GenerationResult } from './types';
import { Code2, Wand2, Github, Link, Check } from 'lucide-react';

function App() {
  const [state, setState] = useState<AppState>(AppState.UPLOAD);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleImageSelected = async (base64: string) => {
    setState(AppState.GENERATING);
    setError(null);

    try {
      const code = await generateCodeFromImage(base64);
      setResult({ code, originalImage: base64 });
      setState(AppState.PREVIEW);
    } catch (err) {
      console.error(err);
      setError("Failed to generate code. Please verify your API key and try again.");
      setState(AppState.ERROR);
    }
  };

  const resetApp = () => {
    setState(AppState.UPLOAD);
    setResult(null);
    setError(null);
  };

  const handleShareApp = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-white selection:bg-brand-500/30 overflow-hidden flex flex-col">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
             backgroundSize: '32px 32px' 
           }}>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* Navbar */}
        <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 shrink-0">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-400 cursor-pointer" onClick={resetApp}>
              <div className="p-2 bg-brand-500/10 rounded-lg">
                <Code2 size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-brand-500">
                Pixel2Code
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={handleShareApp}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium group"
              >
                {linkCopied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Link size={18} className="group-hover:text-brand-400 transition-colors" />
                )}
                <span className={linkCopied ? "text-green-400" : ""}>
                  {linkCopied ? 'Copied Link!' : 'Share App'}
                </span>
              </button>

              <a href="#" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium hidden sm:flex">
                <Github size={20} />
                <span className="hidden sm:inline">Star on GitHub</span>
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
            
            {state === AppState.UPLOAD && (
              <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-y-auto">
                <div className="text-center mb-12 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-6">
                    <Wand2 size={14} />
                    <span>Powered by Gemini 3.0 Pro</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                    Turn Screenshots into <br/>
                    <span className="text-brand-400">Clean Code</span>
                  </h1>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    Upload any UI design, mockup, or screenshot. 
                    Our AI instantly generates production-ready HTML & Tailwind CSS.
                  </p>
                </div>
                
                <UploadZone onImageSelected={handleImageSelected} />
                
                <div className="mt-12 grid grid-cols-3 gap-8 text-center text-slate-500 text-sm opacity-50">
                  <p>Fast Generation</p>
                  <p>Tailwind CSS</p>
                  <p>Responsive Ready</p>
                </div>
              </div>
            )}

            {state === AppState.GENERATING && (
              <div className="flex-1 flex items-center justify-center">
                <LoadingScreen />
              </div>
            )}

            {state === AppState.PREVIEW && result && (
              <div className="flex-1 min-h-0">
                <CodePreview 
                  code={result.code} 
                  originalImage={result.originalImage} 
                  onBack={resetApp} 
                />
              </div>
            )}

            {state === AppState.ERROR && (
              <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                   <div className="text-4xl">⚠️</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Generation Failed</h3>
                <p className="text-slate-400 max-w-md mb-8">{error}</p>
                <button 
                  onClick={resetApp}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
                >
                  Try Again
                </button>
              </div>
            )}

          </div>
        </main>

        <footer className="border-t border-white/5 py-4 text-center text-slate-600 text-sm shrink-0">
          <p>© {new Date().getFullYear()} Pixel2Code. Built with Gemini AI & React.</p>
        </footer>

      </div>
    </div>
  );
}

export default App;