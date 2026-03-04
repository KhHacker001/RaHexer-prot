import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import TagPage from './pages/TagPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminCreate from './pages/AdminCreate';
import AdminEdit from './pages/AdminEdit';
import { getSupabase } from './lib/supabase';
import ScrollToTop from './components/ScrollToTop';

function App() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const supabase = getSupabase();
        let ip = 'Unknown';
        let country = 'Unknown';

        try {
          const ipRes = await fetch('https://api.ipify.org?format=json');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            ip = ipData.ip;
          }
        } catch (e) {
          console.warn('IP fetch failed');
        }

        try {
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            country = geoData.country_name || 'Unknown';
          }
        } catch (e) {
          console.warn('Geo fetch failed');
        }
        
        await supabase.from('visitors').insert({
          ip,
          country,
          device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
          browser: navigator.userAgent.split(' ').pop(),
          path: window.location.pathname,
          visitTime: new Date().toISOString()
        });
      } catch (err) {
        // Silent fail for tracking to not disturb user experience
        console.debug('Visitor tracking failed:', err);
      }
    };
    trackVisitor();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white font-mono selection:bg-emerald-500 selection:text-black">
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/report/:tag/:slug" element={<PostDetail />} />
            <Route path="/tag/:tag" element={<TagPage />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<AdminCreate />} />
            <Route path="/admin/edit/:id" element={<AdminEdit />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
