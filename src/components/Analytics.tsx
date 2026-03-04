import React, { useState } from 'react';
import { BarChart as BarChartIcon, Users, FileText, Eye, Globe, Smartphone, Monitor, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from 'recharts';
import { motion } from 'motion/react';

interface AnalyticsProps {
  data: {
    totalPosts: number;
    totalViews: number;
    totalVisitors: number;
    mostViewed: any;
    topPosts: any[];
    visitorTrend: any[];
    deviceStats: any;
    recentVisitors: any[];
  };
}

const Analytics = ({ data }: AnalyticsProps) => {
  const [showAllVisitors, setShowAllVisitors] = useState(false);
  const stats = [
    { label: 'Total Reports', value: data.totalPosts, icon: FileText, color: 'text-blue-500' },
    { label: 'Total Views', value: data.totalViews, icon: Eye, color: 'text-emerald-500' },
    { label: 'Total Visitors', value: data.totalVisitors, icon: Users, color: 'text-purple-500' },
    { label: 'System Uptime', value: '99.9%', icon: BarChartIcon, color: 'text-yellow-500' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-2xl">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-bold text-emerald-500">
            {payload[0].value} {payload[0].name === 'views' ? 'Views' : 'Visitors'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-12">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-white/5 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] text-zinc-600 uppercase tracking-[0.2em] font-bold">Live</span>
              </div>
            </div>
            <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">{stat.label}</h3>
            <p className="text-4xl font-bold tracking-tighter text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitor Trend Chart */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Visitor Trends
              </h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Last 30 Days Activity</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.visitorTrend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  hide 
                />
                <YAxis 
                  hide 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="visitors"
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Reports Chart */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-500" />
                Top Intelligence
              </h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Most Viewed Reports</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topPosts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Bar 
                  dataKey="views" 
                  name="views"
                  radius={[0, 10, 10, 0]}
                  barSize={20}
                >
                  {data.topPosts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#10b98144'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Traffic & Devices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden">
          <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Globe className="w-5 h-5 text-emerald-500" />
              Traffic Log
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active Stream</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6 font-bold">IP Address</th>
                  <th className="px-10 py-6 font-bold">Location</th>
                  <th className="px-10 py-6 font-bold">Device</th>
                  <th className="px-10 py-6 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {(showAllVisitors ? data.recentVisitors : data.recentVisitors.slice(0, 4)).map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-6 font-mono text-emerald-500/70">{v.ip.replace(/\.\d+$/, '.***')}</td>
                    <td className="px-10 py-6 font-bold text-zinc-400">{v.country}</td>
                    <td className="px-10 py-6 flex items-center gap-2 text-zinc-500">
                      {v.device === 'Mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                      <span className="font-bold uppercase tracking-widest text-[10px]">{v.device}</span>
                    </td>
                    <td className="px-10 py-6 text-zinc-600 font-medium">{new Date(v.visitTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.recentVisitors.length > 4 && (
            <div className="px-10 py-6 border-t border-white/5">
              <button
                onClick={() => setShowAllVisitors(!showAllVisitors)}
                className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors"
              >
                {showAllVisitors ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    See More ({data.recentVisitors.length - 4} more)
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-emerald-500" />
            Device Metrics
          </h3>
          <div className="space-y-8">
            {Object.entries(data.deviceStats).map(([device, count]: [string, any]) => (
              <div key={device} className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-500">{device}</span>
                  <span className="text-emerald-500">{Math.round((count / data.totalVisitors) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / data.totalVisitors) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-10 border-t border-white/5">
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] space-y-4">
              <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-bold uppercase tracking-widest">
                <Award className="w-3 h-3" />
                Top Performer
              </div>
              <p className="text-sm font-bold text-white leading-tight">{data.mostViewed?.title || 'N/A'}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{data.mostViewed?.views || 0} Total Views</span>
                <div className="px-2 py-0.5 bg-emerald-500 text-black text-[8px] font-black rounded uppercase">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
