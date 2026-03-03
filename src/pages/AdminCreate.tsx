import { useNavigate, Link } from 'react-router-dom';
import Editor from '../components/Editor';
import { ArrowLeft } from 'lucide-react';

const AdminCreate = () => {
  const navigate = useNavigate();

  const handleSave = async (data: any) => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        navigate('/admin/dashboard');
      } else {
        alert('Failed to save intelligence report');
      }
    } catch (err) {
      console.error('Save error:', err);
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
