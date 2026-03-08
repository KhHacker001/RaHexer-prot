import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, ArrowLeft, Share2, ShieldCheck, Clock, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, useScroll, useSpring } from 'motion/react';
import { Post } from '../lib/db';
import { getSupabase } from '../lib/supabase';

const PostDetail = () => {
  const { id, slug, tag } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const supabase = getSupabase();
        let query = supabase.from('posts').select('*');
        
        if (slug && tag) {
          query = query.eq('slug', slug).contains('tags', [tag]);
        } else {
          query = query.eq('id', id);
        }

        const { data, error } = await query.single();
        
        if (error) throw error;
        if (data) {
          setPost(data);
          // Increment views
          await supabase
            .from('posts')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', data.id);
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, slug, tag]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-500 font-bold uppercase tracking-[0.4em] text-xs animate-pulse">Decrypting Intel</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <h1 className="text-8xl font-black text-white/5">404</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest">Intelligence Report Not Found</p>
          <Link to="/" className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all">Return to Feed</Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <article className="relative">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className="pt-40 pb-20 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Intelligence Feed
            </Link>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3" />}
              {copied ? 'Link Copied' : 'Share Report'}
            </button>
          </div>

          <header className="space-y-12 mb-20">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-[0.3em]">
                {post.tags?.[0] || 'Unclassified'}
              </span>
              <div className="h-[1px] flex-1 bg-white/10"></div>
              <div className="flex items-center gap-6 text-[11px] font-medium text-zinc-500 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {readingTime} Min Read
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[0.95] text-white">
              {post.title}
            </h1>

            <div className="flex items-center gap-8 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-zinc-700" />
                {post.views} Views
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                Verified Report
              </span>
            </div>
          </header>

          {post.imageUrl && (
            <div className="aspect-[16/9] rounded-[3rem] overflow-hidden mb-20 bg-zinc-900 border border-white/5 relative group">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          )}

          <div className="prose-custom">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <footer className="mt-32 pt-12 border-t border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex flex-wrap gap-4">
                {post.tags && Array.isArray(post.tags) && post.tags.map(tag => (
                  <Link 
                    key={tag} 
                    to={`/tag/${tag}`}
                    className="text-[10px] font-bold uppercase tracking-widest px-6 py-2 bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">End of Intelligence Report</span>
                <div className="w-12 h-[1px] bg-white/10"></div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
};

export default PostDetail;
