import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Mail,
  CreditCard,
  Network,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../lib/supabase';

const threatData = [
  { name: 'Jan', threats: 65 },
  { name: 'Feb', threats: 89 },
  { name: 'Mar', threats: 123 },
  { name: 'Apr', threats: 98 },
  { name: 'May', threats: 156 },
  { name: 'Jun', threats: 178 },
];

const distributionData = [
  { name: 'Phishing', value: 45, color: '#EF4444' },
  { name: 'Fraud', value: 25, color: '#F59E0B' },
  { name: 'Intrusion', value: 20, color: '#0EA5E9' },
  { name: 'Deepfake', value: 10, color: '#10B981' },
];

export default function Dashboard() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentThreats();
  }, []);

  const fetchRecentThreats = async () => {
    try {
      const { data, error } = await supabase
        .from('threat_detections')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setThreats(data || []);
    } catch (error) {
      console.error('Error fetching threats:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'Active Threats',
      value: '247',
      change: '+12%',
      changeType: 'increase',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      name: 'Threats Blocked',
      value: '1,429',
      change: '+18%',
      changeType: 'increase',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      name: 'Detection Rate',
      value: '99.7%',
      change: '+0.3%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      name: 'System Health',
      value: '100%',
      change: '0%',
      changeType: 'neutral',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
  ];

  const modules = [
    {
      name: 'Email Security',
      description: 'Phishing & spam detection',
      icon: Mail,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      status: 'Active',
      threats: 156,
    },
    {
      name: 'Fraud Detection',
      description: 'Financial transaction monitoring',
      icon: CreditCard,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      status: 'Active',
      threats: 89,
    },
    {
      name: 'Network Security',
      description: 'Intrusion detection system',
      icon: Network,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      status: 'Active',
      threats: 67,
    },
    {
      name: 'Media Verification',
      description: 'Deepfake & misinformation',
      icon: Eye,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      status: 'Active',
      threats: 34,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
        <p className="mt-2 text-slate-400">Real-time threat monitoring and AI-powered cybersecurity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-400' : 
                stat.changeType === 'decrease' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-slate-400 ml-1">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Timeline */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Threat Detection Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={threatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="threats" 
                stroke="#06B6D4" 
                strokeWidth={2}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Threat Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Threat Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-300">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Security Modules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Security Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.name}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-slate-500 transition-all duration-200"
            >
              <div className={`p-2 rounded-lg ${module.bgColor} w-fit mb-3`}>
                <module.icon className={`h-5 w-5 ${module.color}`} />
              </div>
              <h4 className="font-semibold text-white mb-1">{module.name}</h4>
              <p className="text-sm text-slate-400 mb-3">{module.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                  {module.status}
                </span>
                <span className="text-sm font-semibold text-white">{module.threats}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Threats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Recent Threat Detections</h3>
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading recent threats...</div>
        ) : threats.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No recent threats detected</div>
        ) : (
          <div className="space-y-3">
            {threats.map((threat) => (
              <div key={threat.id} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      threat.severity === 'critical' ? 'bg-red-500/20' :
                      threat.severity === 'high' ? 'bg-orange-500/20' :
                      threat.severity === 'medium' ? 'bg-yellow-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        threat.severity === 'critical' ? 'text-red-400' :
                        threat.severity === 'high' ? 'text-orange-400' :
                        threat.severity === 'medium' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{threat.description}</p>
                      <p className="text-sm text-slate-400">{threat.source}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      threat.severity === 'critical' ? 'bg-red-900/50 text-red-400' :
                      threat.severity === 'high' ? 'bg-orange-900/50 text-orange-400' :
                      threat.severity === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-blue-900/50 text-blue-400'
                    }`}>
                      {threat.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}