import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Editor from '../components/Editor';
import { Post } from '../lib/db';
import { ArrowLeft } from 'lucide-react';

const AdminEdit = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.ok) {
          setPost(await res.json());
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSave = async (data: any) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        navigate('/admin/dashboard');
      } else {
        alert('Failed to update intelligence report');
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  if (loading) return (
    <div className="pt-40 pb-20 text-center">
      <div className="w-16 h-16 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8"></div>
      <p className="text-emerald-500 font-bold uppercase tracking-[0.4em] text-xs animate-pulse">Decrypting Intelligence Report</p>
    </div>
  );

  if (!post) return (
    <div className="pt-40 pb-20 text-center">
      <h1 className="text-4xl font-bold text-white mb-8">REPORT_NOT_FOUND</h1>
      <Link to="/admin/dashboard" className="text-emerald-500 font-bold uppercase tracking-widest text-xs hover:underline">Return to Dashboard</Link>
    </div>
  );

  return (
    <div className="pt-40 pb-20 container mx-auto px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <Editor initialData={post} onSave={handleSave} />
      </div>
    </div>
  );
};

export default AdminEdit;
