import { useNavigate, Link } from 'react-router-dom';
import Editor from '../components/Editor';
import { ArrowLeft } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

const AdminCreate = () => {
  const navigate = useNavigate();

  const handleSave = async (data: any) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('posts').insert({
        ...data,
        createdAt: new Date().toISOString(),
        views: 0
      });

      if (!error) {
        navigate('/admin/dashboard');
      } else {
        throw error;
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save intelligence report');
    }
  };

  return (
    <div className="pt-40 pb-20 container mx-auto px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 text-xs font-bold uppercase tracking-widest group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <Editor onSave={handleSave} />
      </div>
    </div>
  );
};

export default AdminCreate;
