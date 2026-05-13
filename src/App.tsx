import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FileText, CheckCircle2, ChevronRight, Brain, AlertCircle, RefreshCcw, Home, Sparkles, BookOpen } from 'lucide-react';
import { MYSTERY_CASES, Case, Evidence } from './constants/cases';
import { evaluateCER, CERFeedback } from './services/geminiService';
import { sounds } from './lib/sounds';

export default function App() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans selection:bg-[#f97316]/30">
      <nav className="relative z-20 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedCase(null); }}>
          <div className="w-10 h-10 bg-[#f97316] flex items-center justify-center rounded-xl shadow-lg rotate-1">
            <Search className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-[#fafafa]">RASIB CER RACE</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#f97316] font-bold mt-[-2px]">Scientific Evidence Lab</p>
          </div>
        </div>
        
        {selectedCase && (
          <button 
            onClick={() => { setSelectedCase(null); }}
            className="flex items-center gap-2 text-sm font-bold hover:bg-[#27272a] transition-all bg-[#18181b] px-5 py-2.5 rounded-xl border border-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"
          >
            <Home className="w-4 h-4" />
            Exit Case
          </button>
        )}
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {!selectedCase ? (
            <motion.div key="selector">
              <CaseSelector onSelect={setSelectedCase} />
            </motion.div>
          ) : (
            <motion.div key={selectedCase.id}>
              <InvestigationRoom 
                mysteryCase={selectedCase} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-12 text-center opacity-20 text-[10px] uppercase tracking-[0.4em] font-bold">
        &copy; 2026 Scientific Evidence Laboratory &bull; Think. Evidence. Reason.
      </footer>
    </div>
  );
}

function CaseSelector({ onSelect }: { onSelect: (c: Case) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 py-8"
    >
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f97316]/10 text-[#f97316] text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          Neural Link Active
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#fafafa]">
          Available <span className="text-[#f97316]">Case Files</span>
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[280px]">
        {MYSTERY_CASES.map((mystery, idx) => (
          <motion.div
            key={mystery.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className={`group relative cursor-pointer ${idx === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'}`}
            onClick={() => {
              sounds.playSelect();
              onSelect(mystery);
            }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#f97316] to-[#09090b] rounded-[2rem] blur opacity-0 group-hover:opacity-10 transition duration-500" />
            <div className="relative h-full bg-[#18181b] border border-[#27272a] p-8 rounded-[2rem] flex flex-col justify-between hover:border-[#f97316]/50 transition-all">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    mystery.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500' : 
                    mystery.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {mystery.difficulty}
                  </div>
                  <BookOpen className="w-5 h-5 text-[#a1a1aa]" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-[#fafafa] leading-tight group-hover:text-[#f97316] transition-colors">{mystery.title}</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed line-clamp-3">
                  {mystery.scenario}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#fafafa] mt-6">
                Open Investigation
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}

        {/* Decorative Grid Item */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#18181b] to-[#27272a]/20 border border-[#27272a] p-8 rounded-[2rem] flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-12 h-12 bg-[#27272a] rounded-xl flex items-center justify-center">
            <Brain className="text-[#f97316] w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#fafafa] uppercase tracking-widest">Mastering CER</h4>
          <p className="text-[12px] text-[#71717a] max-w-[200px]">Unlock more cases as you progress through the laboratory training.</p>
        </div>
      </div>
    </motion.div>
  );
}

function InvestigationRoom({ mysteryCase }: { mysteryCase: Case }) {
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState("");
  const [status, setStatus] = useState<'working' | 'submitting' | 'result'>('working');
  const [aiResponse, setAiResponse] = useState<CERFeedback | null>(null);

  const toggleEvidence = (id: string) => {
    if (selectedEvidenceIds.includes(id)) {
      sounds.playDeselect();
      setSelectedEvidenceIds(selectedEvidenceIds.filter(i => i !== id));
    } else {
      sounds.playSelect();
      setSelectedEvidenceIds([...selectedEvidenceIds, id]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClaim || selectedEvidenceIds.length === 0 || !reasoning) {
      alert("Please complete all sections: Claim, Evidence, and Reasoning.");
      return;
    }

    setStatus('submitting');
    sounds.playSubmit();
    
    const evidenceTexts = mysteryCase.evidencePool
      .filter(e => selectedEvidenceIds.includes(e.id))
      .map(e => e.text);

    try {
      const result = await evaluateCER(mysteryCase, selectedClaim, evidenceTexts, reasoning);
      setAiResponse(result);
      if (result.isCorrect) sounds.playSuccess();
      else sounds.playError();
    } catch (e) {
      console.error(e);
      setAiResponse({
        isCorrect: false,
        feedback: "The research link was interrupted. Please try again.",
        suggestions: ["Check your network connection."]
      });
    }
    setStatus('result');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Dossier */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 space-y-6 sticky top-28"
      >
        <div className="bg-[#18181b] border border-[#27272a] p-8 rounded-[2rem] shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#f97316]/10 rounded-bl-[4rem] pointer-events-none"></div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#f97316] rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-black text-[10px] uppercase tracking-[0.25em] text-[#71717a]">Case Docket</h2>
            </div>
            
            <div className="p-6 bg-[#27272a]/30 rounded-2xl border-l-2 border-[#f97316] italic text-md leading-relaxed text-[#fafafa]/90">
              "{mysteryCase.scenario}"
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="font-black text-[10px] uppercase tracking-[0.25em] text-[#71717a]">Observation Log</h3>
            <div className="space-y-2">
              {mysteryCase.evidencePool.map((ev, idx) => (
                <button
                  key={ev.id}
                  onClick={() => toggleEvidence(ev.id)}
                  className={`w-full text-left p-4 rounded-[1.25rem] text-[13px] transition-all border flex gap-4 items-start ${
                    selectedEvidenceIds.includes(ev.id)
                      ? 'border-[#f97316] bg-[#f97316]/10 text-[#fafafa]'
                      : 'border-[#27272a] bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                    selectedEvidenceIds.includes(ev.id) ? 'bg-[#f97316] text-white' : 'bg-[#27272a] text-[#71717a]'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold leading-tight">{ev.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Lab Bench */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 space-y-6"
      >
        <AnimatePresence mode="wait">
          {status === 'result' && aiResponse ? (
            <motion.div 
              key="result"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className={`p-10 rounded-[2.5rem] shadow-2xl space-y-10 border ${
                aiResponse.isCorrect 
                  ? 'bg-green-500/10 border-green-500/20 text-[#fafafa]' 
                  : 'bg-red-500/5 border-red-500/20 text-[#fafafa]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${aiResponse.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {aiResponse.isCorrect ? <CheckCircle2 className="w-8 h-8 text-white" /> : <AlertCircle className="w-8 h-8 text-white" />}
                </div>
                <div className="text-right">
                  <h2 className={`text-4xl font-black tracking-tighter ${aiResponse.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {aiResponse.isCorrect ? 'CONFIRMED' : 'REJECTED'}
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#71717a] mt-1">Laboratory Synthesis</p>
                </div>
              </div>

              <div className="space-y-8">
                <p className="text-xl font-bold leading-relaxed text-[#fafafa]">
                  {aiResponse.feedback}
                </p>
                
                {aiResponse.suggestions.length > 0 && (
                  <div className="p-6 bg-[#18181b] rounded-2xl border border-[#27272a] space-y-5">
                    <h4 className="font-black text-[10px] uppercase tracking-widest text-[#f97316]">Peer Review:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiResponse.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-3 text-[13px] font-bold text-[#a1a1aa] items-center">
                          <div className="w-2 h-2 rounded-full bg-[#f97316]" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button 
                onClick={() => aiResponse.isCorrect ? window.location.reload() : setStatus('working')}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-xl ${
                  aiResponse.isCorrect 
                    ? 'bg-[#f97316] text-white hover:bg-[#ea580c]' 
                    : 'bg-[#fafafa] text-black hover:bg-[#a1a1aa]'
                }`}
              >
                {aiResponse.isCorrect ? 'Load Next Archive' : 'Return to Bench'}
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CLAIM BLOCK */}
              <div className="md:col-span-2 bg-[#18181b] p-8 rounded-[2rem] border border-[#27272a] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f97316] flex items-center justify-center font-black text-white">01</div>
                    <h3 className="font-black uppercase tracking-[0.25em] text-[10px] text-[#71717a]">Scientific Claim</h3>
                  </div>
                </div>
                
                <select 
                  value={selectedClaim || ""} 
                  onChange={(e) => {
                    sounds.playSelect();
                    setSelectedClaim(e.target.value);
                  }}
                  className="w-full p-5 bg-[#27272a]/50 border border-[#27272a] focus:border-[#f97316] rounded-2xl text-sm font-bold text-[#fafafa] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Formulate investigation claim...</option>
                  <option value={mysteryCase.correctClaim}>{mysteryCase.correctClaim}</option>
                  <option value="The witness is providing false information.">The witness is providing false information.</option>
                  <option value="Environmental factors caused the anomaly.">Environmental factors caused the anomaly.</option>
                </select>
              </div>

              {/* EVIDENCE BLOCK */}
              <div className="bg-[#18181b] p-8 rounded-[2rem] border border-[#27272a] space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#3b82f6] flex items-center justify-center font-black text-white">02</div>
                  <h3 className="font-black uppercase tracking-[0.25em] text-[10px] text-[#71717a]">Supporting Evidence</h3>
                </div>
                
                <div className="flex flex-wrap gap-2 min-h-[100px]">
                  <AnimatePresence>
                    {selectedEvidenceIds.length === 0 ? (
                      <div className="w-full border-2 border-dashed border-[#27272a] rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-[#4b5563]">
                        Link observations...
                      </div>
                    ) : (
                      selectedEvidenceIds.map((id) => (
                        <motion.div 
                          key={id} 
                          layoutId={id} 
                          className="px-4 py-2 bg-[#3b82f6]/10 text-[#3b82f6] text-[11px] font-black rounded-lg border border-[#3b82f6]/20 flex items-center gap-2"
                        >
                          F-{(mysteryCase.evidencePool.findIndex(e => e.id === id) + 1).toString().padStart(2, '0')}
                          <button onClick={() => toggleEvidence(id)} className="hover:text-white">×</button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* REASONING BLOCK */}
              <div className="bg-[#18181b] p-8 rounded-[2rem] border border-[#27272a] space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#8b5cf6] flex items-center justify-center font-black text-white">03</div>
                  <h3 className="font-black uppercase tracking-[0.25em] text-[10px] text-[#71717a]">Causal Reasoning</h3>
                </div>
                
                <textarea 
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Explain the connection..."
                  className="w-full h-[100px] p-5 bg-[#27272a]/50 border border-[#27272a] focus:border-[#8b5cf6] rounded-2xl text-sm font-bold text-[#fafafa] outline-none transition-all resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={status === 'submitting' || !selectedClaim || selectedEvidenceIds.length === 0 || !reasoning}
                className="md:col-span-2 group relative py-6 bg-[#fafafa] text-black rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-[#f97316] hover:text-white transition-all disabled:opacity-20 shadow-2xl"
              >
                {status === 'submitting' ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    ANALYZE SYNTHESIS
                    <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
