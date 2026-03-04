import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, FileText, ArrowUpRight } from 'lucide-react';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Report', path: '/#latest-intel', icon: <FileText className="w-5 h-5" /> },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.includes('#')) {
      const id = path.split('#')[1];
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className={`relative flex justify-between items-center px-8 py-2 rounded-full border transition-all duration-500 ${
            scrolled 
              ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl' 
              : 'bg-transparent border-transparent'
          }`}>
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                  <div className="w-3 h-3 bg-black rounded-sm"></div>
                </div>
                <span className="text-lg font-bold tracking-tight text-white">
                  RaHexer<span className="text-emerald-500">.</span>
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={(e) => {
                    if (link.name === 'Home') {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                      handleLinkClick(e, link.path);
                    }
                  }}
                  className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-4 w-[1px] bg-white/10"></div>
              <Link
                to="/"
                className="flex items-center gap-2 text-[13px] font-semibold text-white group"
              >
                Get Access
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white ml-4"
              >
                <Menu className="w-6 h-6" />
              </button>
            </nav>

            {/* Mobile Menu Toggle (Always on right) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-black border-r border-white/10 z-[70] p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-16">
                <Link to="/" className="flex items-center gap-3" onClick={() => setIsSidebarOpen(false)}>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-black rounded-sm"></div>
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">RaHexer</span>
                </Link>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                    className="text-2xl font-bold text-white hover:text-emerald-500 transition-colors flex items-center gap-4"
                  >
                    <span className="text-emerald-500">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
                <div className="h-[1px] bg-white/10 my-4"></div>
                <Link
                  to="/"
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-lg font-bold text-emerald-500 flex items-center gap-2"
                >
                  Get Access
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
