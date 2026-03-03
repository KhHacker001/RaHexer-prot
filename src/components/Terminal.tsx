import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const Terminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const fullLines = [
    '> Initializing RaHexer Blogs...',
    '> Loading secure kernel...',
    '> Checking system integrity...',
    '> Access Granted...',
    '> Loading latest intelligence...',
    '> System Ready.'
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < fullLines.length) {
        setLines(prev => [...prev, fullLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="px-8 py-5 flex justify-between items-center border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/5 border border-white/10"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Secure Session</span>
        </div>
      </div>
      <div className="p-10 font-mono text-sm min-h-[320px] leading-loose">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={(line && typeof line === 'string' && line.includes('Granted')) ? 'text-emerald-400' : 'text-zinc-400'}
          >
            <span className="text-zinc-600 mr-4">[{i.toString().padStart(2, '0')}]</span>
            {line}
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-4 bg-emerald-500 ml-2 translate-y-0.5"
        ></motion.div>
      </div>
    </div>
  );
};

export default Terminal;
