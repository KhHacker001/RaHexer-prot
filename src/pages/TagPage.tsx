import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { Post } from '../lib/db';
import { getSupabase } from '../lib/supabase';
import { Tag as TagIcon, ArrowLeft } from 'lucide-react';

const TagPage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .contains('tags', [tag])
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
  }, [tag]);

  return (
    <div className="pt-40 pb-20 container mx-auto px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-16 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Intelligence Feed
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-bold tracking-[0.3em] uppercase">
              <TagIcon className="w-4 h-4" />
              Classification
            </div>
            <h1 className="text-6xl font-bold tracking-tight text-white uppercase">{tag}</h1>
          </div>
          <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
            {posts.length} Intelligence Reports Found
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] bg-zinc-900/50 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/[0.02] border border-white/5 rounded-[3rem]">
            <p className="text-zinc-500 font-bold uppercase tracking-widest">No reports found with this classification.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagPage;
