import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, AlertTriangle, TrendingUp, DollarSign, User, MapPin, Clock, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { supabase } from '../lib/supabase';

const fraudTrendsData = [
  { month: 'Jan', attempts: 45, blocked: 43, success: 2 },
  { month: 'Feb', attempts: 52, blocked: 49, success: 3 },
  { month: 'Mar', attempts: 38, blocked: 37, success: 1 },
  { month: 'Apr', attempts: 61, blocked: 58, success: 3 },
  { month: 'May', attempts: 49, blocked: 47, success: 2 },
  { month: 'Jun', attempts: 55, blocked: 53, success: 2 },
];

const riskFactorsData = [
  { factor: 'High Amount', count: 23 },
  { factor: 'Foreign Location', count: 18 },
  { factor: 'Unusual Time', count: 15 },
  { factor: 'New Merchant', count: 12 },
  { factor: 'Multiple Cards', count: 8 },
];

export default function FraudDetection() {
  const [transactionAmount, setTransactionAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [location, setLocation] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [merchantCategory, setMerchantCategory] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [realTimeAlerts, setRealTimeAlerts] = useState<any[]>([]);

  const analyzeTransaction = async () => {
    if (!transactionAmount || !merchant) return;
    
    setAnalyzing(true);
    setRiskScore(null);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock risk calculation
    const amount = parseFloat(transactionAmount);
    let risk = 0;
    
    if (amount > 1000) risk += 0.3;
    if (amount > 5000) risk += 0.2;
    if (merchant.toLowerCase().includes('casino') || merchant.toLowerCase().includes('crypto')) risk += 0.4;
    if (location && location.toLowerCase().includes('foreign')) risk += 0.2;
    if (merchantCategory === 'high-risk') risk += 0.3;
    if (cardNumber.length > 0 && cardNumber.startsWith('4')) risk += 0.1; // Visa cards
    
    const finalRisk = Math.min(0.95, risk + Math.random() * 0.2);
    
    const analysisResult = {
      riskScore: finalRisk,
      amount: transactionAmount,
      merchant,
      location,
      cardNumber: cardNumber.slice(-4),
      riskFactors: [
        amount > 1000 && 'High transaction amount',
        location?.toLowerCase().includes('foreign') && 'Foreign location',
        merchant.toLowerCase().includes('casino') && 'High-risk merchant category',
        merchantCategory === 'high-risk' && 'Suspicious merchant type'
      ].filter(Boolean),
      recommendation: finalRisk > 0.7 ? 'Block Transaction' : 
                     finalRisk > 0.4 ? 'Manual Review Required' : 'Approve Transaction'
    };
    
    setRiskScore(finalRisk);
    
    // Save to database
    await supabase.from('scan_results').insert({
      scan_type: 'fraud_detection',
      result: analysisResult,
      confidence_score: finalRisk
    });
    
    // Create threat detection if high risk
    if (finalRisk > 0.6) {
      await supabase.from('threat_detections').insert({
        type: 'fraud',
        severity: finalRisk > 0.8 ? 'high' : 'medium',
        description: `Fraudulent transaction detected: $${transactionAmount} at ${merchant}`,
        source: 'Fraud Detection System',
        metadata: analysisResult
      });
    }
    
    setAnalyzing(false);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 0.7) return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (score >= 0.4) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const transactions = [
    { id: '1', amount: '$2,450.00', merchant: 'Online Electronics Store', risk: 0.85, status: 'Flagged', time: '2 min ago', location: 'Unknown' },
    { id: '2', amount: '$89.99', merchant: 'Coffee Shop Downtown', risk: 0.12, status: 'Approved', time: '5 min ago', location: 'New York, US' },
    { id: '3', amount: '$1,200.00', merchant: 'ATM Withdrawal - Foreign', risk: 0.67, status: 'Under Review', time: '8 min ago', location: 'London, UK' },
    { id: '4', amount: '$45.50', merchant: 'Gas Station', risk: 0.08, status: 'Approved', time: '12 min ago', location: 'California, US' },
    { id: '5', amount: '$5,000.00', merchant: 'Crypto Exchange', risk: 0.92, status: 'Blocked', time: '15 min ago', location: 'Singapore' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Fraud Detection</h1>
        <p className="mt-2 text-slate-400">AI-powered financial fraud detection and prevention</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Transactions Today', value: '8,429', icon: CreditCard, color: 'text-blue-400' },
          { label: 'Fraud Prevented', value: '$127K', icon: DollarSign, color: 'text-green-400' },
          { label: 'Flagged Transactions', value: '47', icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Detection Rate', value: '99.2%', icon: TrendingUp, color: 'text-purple-400' },
        ].map((stat, index) => (
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
        {/* Transaction Analyzer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <CreditCard className="h-6 w-6 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Transaction Risk Analysis</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Transaction Amount ($)
              </label>
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="1000.00"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Merchant
              </label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Online Store, ATM, etc."
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Card Number (Last 4 digits)
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234"
                maxLength={4}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Merchant Category
              </label>
              <select
                value={merchantCategory}
                onChange={(e) => setMerchantCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              >
                <option value="">Select category</option>
                <option value="retail">Retail</option>
                <option value="restaurant">Restaurant</option>
                <option value="gas-station">Gas Station</option>
                <option value="online">Online Store</option>
                <option value="atm">ATM</option>
                <option value="high-risk">High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Transaction Time
              </label>
              <input
                type="time"
                value={transactionTime}
                onChange={(e) => setTransactionTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            <button
              onClick={analyzeTransaction}
              disabled={!transactionAmount || !merchant || analyzing}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Analyzing Risk...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  Analyze Transaction
                </>
              )}
            </button>
          </div>

          {/* Risk Score Display */}
          {riskScore !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-6 rounded-lg border border-slate-600 bg-slate-700/20"
            >
              <div className="text-center mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskLevel(riskScore).bg} ${getRiskLevel(riskScore).color} mb-2`}>
                  {getRiskLevel(riskScore).level} Risk
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {(riskScore * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-slate-400">Fraud Risk Score</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Recommendation:</span>
                  <span className={`ml-2 font-medium ${
                    riskScore > 0.7 ? 'text-red-400' :
                    riskScore > 0.4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {riskScore > 0.7 ? 'Block Transaction' :
                     riskScore > 0.4 ? 'Manual Review' : 'Approve Transaction'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Processing Time:</span>
                  <span className="text-white ml-2">0.23s</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Recent Transactions</h2>
          
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const risk = getRiskLevel(transaction.risk);
              return (
                <motion.div 
                  key={transaction.id} 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 hover:border-slate-500 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{transaction.amount}</span>
                      <span className="text-xs text-slate-400">•••• {Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${risk.bg} ${risk.color}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{transaction.merchant}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {transaction.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {transaction.time}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Risk:</span>
                      <span className={`text-xs font-medium ${risk.color}`}>
                        {(transaction.risk * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-16 bg-slate-600 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          transaction.risk >= 0.7 ? 'bg-red-400' :
                          transaction.risk >= 0.4 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${transaction.risk * 100}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Fraud Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="attempts" stroke="#F59E0B" strokeWidth={2} name="Attempts" />
              <Line type="monotone" dataKey="blocked" stroke="#10B981" strokeWidth={2} name="Blocked" />
              <Line type="monotone" dataKey="success" stroke="#EF4444" strokeWidth={2} name="Successful Fraud" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Risk Factors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskFactorsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" />
              <YAxis dataKey="factor" type="category" stroke="#9CA3AF" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}