import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Shield, Terminal as TerminalIcon, AlertTriangle } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabase();
      
      // Clear any existing broken session first
      await supabase.auth.signOut();

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Access Denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-20 container mx-auto px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Secure Access</h1>
          <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs">Intelligence Repository Login</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative">
                <TerminalIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-white/20 outline-none transition-all font-medium"
                  placeholder="admin@rahexer.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-4">Passcode</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:border-white/20 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              {loading ? 'Authenticating...' : 'Establish Session'}
            </button>
          </form>
        </div>

        <p className="mt-12 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-[0.4em]">
          Unauthorized access is strictly prohibited
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
