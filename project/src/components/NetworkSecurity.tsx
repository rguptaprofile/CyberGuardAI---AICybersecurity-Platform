import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Network, Shield, AlertTriangle, Activity, Server, Wifi, Lock, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '../lib/supabase';

const networkTrafficData = [
  { time: '00:00', normal: 45, suspicious: 2, blocked: 1 },
  { time: '04:00', normal: 32, suspicious: 1, blocked: 0 },
  { time: '08:00', normal: 78, suspicious: 5, blocked: 3 },
  { time: '12:00', normal: 95, suspicious: 8, blocked: 4 },
  { time: '16:00', normal: 87, suspicious: 12, blocked: 7 },
  { time: '20:00', normal: 65, suspicious: 6, blocked: 2 },
];

const intrusionData = [
  { time: '1h', attempts: 12 },
  { time: '2h', attempts: 8 },
  { time: '3h', attempts: 15 },
  { time: '4h', attempts: 23 },
  { time: '5h', attempts: 18 },
  { time: '6h', attempts: 9 },
];

export default function NetworkSecurity() {
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [ipAddress, setIpAddress] = useState('');
  const [portRange, setPortRange] = useState('1-1000');
  const [realTimeThreats, setRealTimeThreats] = useState<any[]>([]);

  useEffect(() => {
    // Simulate real-time threat detection
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newThreat = {
          id: Date.now(),
          type: ['Port Scan', 'DDoS Attempt', 'Brute Force', 'SQL Injection'][Math.floor(Math.random() * 4)],
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
          timestamp: new Date().toLocaleTimeString(),
          blocked: Math.random() > 0.3
        };
        
        setRealTimeThreats(prev => [newThreat, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const performNetworkScan = async () => {
    if (!ipAddress) return;
    
    setScanning(true);
    setScanResults(null);

    try {
      // Simulate network scanning
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = {
        target: ipAddress,
        portRange,
        openPorts: [22, 80, 443, 8080].filter(() => Math.random() > 0.5),
        vulnerabilities: [
          'Outdated SSH version detected',
          'Weak SSL/TLS configuration',
          'Unnecessary services running'
        ].filter(() => Math.random() > 0.6),
        riskScore: Math.random() * 0.4 + 0.3,
        scanDuration: '2.3 seconds',
        hostsUp: Math.floor(Math.random() * 10) + 1
      };

      setScanResults(mockResults);

      // Save scan results
      await supabase.from('scan_results').insert({
        scan_type: 'network_security',
        result: mockResults,
        confidence_score: mockResults.riskScore
      });

      // Create threat detection if high risk
      if (mockResults.riskScore > 0.6) {
        await supabase.from('threat_detections').insert({
          type: 'intrusion',
          severity: mockResults.riskScore > 0.8 ? 'high' : 'medium',
          description: `Network vulnerability detected on ${ipAddress}`,
          source: 'Network Scanner',
          metadata: mockResults
        });
      }

    } catch (error) {
      console.error('Error performing network scan:', error);
    } finally {
      setScanning(false);
    }
  };

  const stats = [
    { label: 'Active Connections', value: '1,247', icon: Network, color: 'text-blue-400' },
    { label: 'Blocked Attacks', value: '89', icon: Shield, color: 'text-green-400' },
    { label: 'Intrusion Attempts', value: '23', icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Network Health', value: '98%', icon: Activity, color: 'text-cyan-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Network Security</h1>
        <p className="mt-2 text-slate-400">AI-powered intrusion detection and network monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Network Scanner */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Server className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Network Scanner</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target IP Address
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Port Range
              </label>
              <input
                type="text"
                value={portRange}
                onChange={(e) => setPortRange(e.target.value)}
                placeholder="1-1000"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <button
              onClick={performNetworkScan}
              disabled={!ipAddress || scanning}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {scanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Scanning Network...
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4" />
                  Start Network Scan
                </>
              )}
            </button>
          </div>

          {/* Scan Results */}
          {scanResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 rounded-lg border border-slate-600 bg-slate-700/30"
            >
              <h3 className="font-semibold text-white mb-3">Scan Results</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target:</span>
                  <span className="text-white">{scanResults.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Open Ports:</span>
                  <span className="text-white">{scanResults.openPorts.join(', ') || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vulnerabilities:</span>
                  <span className="text-red-400">{scanResults.vulnerabilities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Score:</span>
                  <span className={`font-medium ${
                    scanResults.riskScore > 0.7 ? 'text-red-400' :
                    scanResults.riskScore > 0.4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {(scanResults.riskScore * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Real-time Threats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Zap className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Real-time Threats</h2>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {realTimeThreats.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No threats detected</p>
              </div>
            ) : (
              realTimeThreats.map((threat) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg bg-slate-700/30 border border-slate-600"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{threat.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      threat.blocked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {threat.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p>Source: {threat.source}</p>
                    <div className="flex justify-between">
                      <span>Severity: {threat.severity}</span>
                      <span>{threat.timestamp}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Network Traffic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Network Traffic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={networkTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="normal" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="suspicious" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              <Area type="monotone" dataKey="blocked" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Intrusion Attempts</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={intrusionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
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
                dataKey="attempts" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}