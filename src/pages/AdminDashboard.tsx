import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Analytics from '../components/Analytics';
import { getSupabase } from '../lib/supabase';
import { Plus, Edit, Trash2, LogOut, FileText, LayoutDashboard, Share2, Check } from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return navigate('/admin');

        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('createdAt', { ascending: false });

        const { data: visitorsData, error: visitorsError } = await supabase
          .from('visitors')
          .select('*');

        if (postsError || visitorsError) throw postsError || visitorsError;

        setPosts(postsData || []);

        // Calculate analytics manually
        const totalViews = postsData?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
        const mostViewed = [...(postsData || [])].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
        const topPosts = [...(postsData || [])]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map(p => ({ name: p.title.substring(0, 20) + (p.title.length > 20 ? '...' : ''), views: p.views || 0 }));

        const dailyStats: Record<string, number> = {};
        for (let i = 0; i < 30; i++) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          dailyStats[d.toISOString().split('T')[0]] = 0;
        }

        visitorsData?.forEach(v => {
          const date = v.visitTime?.split('T')[0];
          if (dailyStats[date] !== undefined) {
            dailyStats[date]++;
          }
        });

        const visitorTrend = Object.entries(dailyStats)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        const deviceStats = visitorsData?.reduce((acc: any, v) => {
          acc[v.device] = (acc[v.device] || 0) + 1;
          return acc;
        }, {}) || {};

        setAnalytics({
          totalPosts: postsData?.length || 0,
          totalViews,
          totalVisitors: visitorsData?.length || 0,
          mostViewed,
          topPosts,
          visitorTrend,
          deviceStats,
          recentVisitors: [...(visitorsData || [])].reverse()
        });

      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this intelligence report?')) return;
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const copyShareLink = (post: any) => {
    const baseUrl = window.location.origin;
    const shareUrl = post.slug && post.tags?.[0] 
      ? `${baseUrl}/report/${post.tags[0]}/${post.slug}` 
      : `${baseUrl}/post/${post.id}`;
    
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return (
    <div className="pt-40 pb-20 text-center">
      <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8"></div>
      <p className="text-emerald-500 font-bold uppercase tracking-[0.4em] text-xs animate-pulse">Synchronizing Command Center</p>
    </div>
  );

  return (
    <div className="pt-40 pb-20 container mx-auto px-6 space-y-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-bold tracking-[0.3em] uppercase">
            <LayoutDashboard className="w-4 h-4" />
            Control
          </div>
          <h1 className="text-6xl font-bold tracking-tight text-white uppercase">Command Center</h1>
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">System Administrator Dashboard</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/create"
            className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all shadow-xl uppercase tracking-widest text-xs"
          >
            <Plus className="w-4 h-4" />
            New Intelligence
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </div>

      {analytics && <Analytics data={analytics} />}

      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="px-10 py-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-500" />
              Intelligence Repository
            </h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{posts.length} Classified Reports Stored</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Database Online</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] text-zinc-500 uppercase tracking-[0.3em]">
                <th className="px-10 py-6 font-bold">Report Title</th>
                <th className="px-10 py-6 font-bold">Classifications</th>
                <th className="px-10 py-6 font-bold">Engagement</th>
                <th className="px-10 py-6 font-bold">Timestamp</th>
                <th className="px-10 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-8">
                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors text-lg">{post.title}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-[10px] text-zinc-600 font-mono uppercase">ID: {post.id}</div>
                      {post.slug && <div className="text-[10px] text-emerald-500/50 font-mono uppercase">SLUG: {post.slug}</div>}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-wrap gap-2">
                      {post.tags && Array.isArray(post.tags) && post.tags.map((tag: string) => (
                        <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-white/5 border border-white/10 text-zinc-400 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-lg">{post.views}</span>
                      <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Total Views</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => copyShareLink(post)}
                        className={`p-3 rounded-2xl border transition-all ${
                          copiedId === post.id 
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                        title="Copy Share Link"
                      >
                        {copiedId === post.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                      </button>
                      <Link
                        to={`/admin/edit/${post.id}`}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                        title="Edit Report"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-3 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Delete Report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
