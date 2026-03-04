import { useState, useEffect } from 'react';
import Terminal from '../components/Terminal';
import PostCard from '../components/PostCard';
import { Post } from '../lib/db';
import { getSupabase } from '../lib/supabase';
import { ArrowRight, Terminal as TerminalIcon, Shield, Zap } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-32 pb-20 space-y-32">
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-5xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold tracking-widest text-zinc-500 uppercase">
              Intelligence Feed 4.0
            </div>
            <div className="h-[1px] w-12 bg-white/10"></div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-12 leading-[0.95]">
            Securing the <br />
            <span className="text-zinc-500">Digital Frontier.</span>
          </h1>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <p className="text-xl text-zinc-400 leading-relaxed font-medium">
              RaHexer is a premier intelligence publication dedicated to high-fidelity cybersecurity research and technical deep-dives.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => document.getElementById('latest-intel')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 group"
              >
                Latest Reports
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Terminal Section */}
      <section className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Terminal />
          </div>
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">System Integrity Verified.</h2>
              <p className="text-zinc-500 leading-relaxed">
                Our platform provides real-time monitoring and analysis of emerging threats, ensuring you stay ahead of the curve in an ever-evolving landscape.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <Shield className="w-6 h-6 text-emerald-500" />
                <h4 className="font-bold">Encrypted Intel</h4>
                <p className="text-xs text-zinc-600">Secure data transmission protocols.</p>
              </div>
              <div className="space-y-3">
                <Zap className="w-6 h-6 text-emerald-500" />
                <h4 className="font-bold">Zero-Day Alerts</h4>
                <p className="text-xs text-zinc-600">Immediate notification of vulnerabilities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Repository */}
      <section id="latest-intel" className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-bold tracking-[0.3em] uppercase">
              <TerminalIcon className="w-4 h-4" />
              Repository
            </div>
            <h2 className="text-5xl font-bold tracking-tight">Latest Intelligence</h2>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors">All Reports</button>
            <button className="px-6 py-2 rounded-full border border-white/10 text-xs font-bold hover:bg-white/5 transition-colors">Research</button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] bg-zinc-900/50 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
