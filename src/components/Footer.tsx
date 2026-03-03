import { Link } from 'react-router-dom';
import { Lock, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="pt-32 pb-16 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-6 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-sm"></div>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                RaHexer<span className="text-emerald-500">.</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
              A premier intelligence publication dedicated to high-fidelity cybersecurity research and technical deep-dives.
            </p>
          </div>
          
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => document.getElementById('latest-intel')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  Intelligence <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </li>
              <li><Link to="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">Research <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link to="/" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">Archive <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Connect</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="text-zinc-500 hover:text-white transition-colors">Discord</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
          <p className="text-xs text-zinc-600 font-medium">
            © {year} RaHexer Intelligence. All rights reserved.
          </p>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
              <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
              System Active
            </div>
            <Link to="/admin" className="text-zinc-800 hover:text-zinc-400 transition-colors">
              <Lock className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
