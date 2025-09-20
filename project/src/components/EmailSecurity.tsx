import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle, Scan, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EmailSecurity() {
  const [emailContent, setEmailContent] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyzeEmail = async () => {
    if (!emailContent.trim()) return;
    
    setScanning(true);
    setResult(null);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const analysisResult = {
        isPhishing: emailContent.toLowerCase().includes('urgent') || 
                   emailContent.toLowerCase().includes('click here') ||
                   emailContent.toLowerCase().includes('verify account'),
        confidenceScore: Math.random() * 0.3 + 0.7,
        threats: [
          'Suspicious links detected',
          'Urgency indicators present',
          'Generic greeting used'
        ].filter(() => Math.random() > 0.5),
        sentiment: 'suspicious',
        domain: 'unknown-sender.com'
      };

      setResult(analysisResult);

      // Save to database
      await supabase.from('scan_results').insert({
        scan_type: 'email_security',
        result: analysisResult,
        confidence_score: analysisResult.confidenceScore
      });

      if (analysisResult.isPhishing) {
        await supabase.from('threat_detections').insert({
          type: 'phishing',
          severity: analysisResult.confidenceScore > 0.8 ? 'high' : 'medium',
          description: 'Phishing email detected',
          source: 'Email Scanner',
          metadata: analysisResult
        });
      }

    } catch (error) {
      console.error('Error analyzing email:', error);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Email Security</h1>
        <p className="mt-2 text-slate-400">AI-powered phishing and scam email detection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Analysis Tool */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Mail className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Email Analysis</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Content
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste the email content here for analysis..."
                rows={8}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <button
              onClick={analyzeEmail}
              disabled={!emailContent.trim() || scanning}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {scanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  Analyze Email
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Analysis Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Analysis Results</h2>

          {!result ? (
            <div className="text-center py-12 text-slate-400">
              <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Run an email analysis to see results</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Threat Status */}
              <div className={`p-4 rounded-lg border ${
                result.isPhishing 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {result.isPhishing ? (
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  )}
                  <span className={`font-semibold ${
                    result.isPhishing ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {result.isPhishing ? 'Phishing Detected' : 'Email appears safe'}
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Confidence: {(result.confidenceScore * 100).toFixed(1)}%
                </p>
              </div>

              {/* Threat Details */}
              {result.threats && result.threats.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-3">Detected Issues</h3>
                  <ul className="space-y-2">
                    {result.threats.map((threat: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                        <span className="text-slate-300">{threat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-600">
                <div>
                  <p className="text-sm text-slate-400">Sender Domain</p>
                  <p className="text-white font-medium">{result.domain}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Risk Level</p>
                  <p className={`font-medium ${
                    result.isPhishing ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {result.isPhishing ? 'High' : 'Low'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Email Security Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { label: 'Emails Scanned Today', value: '1,247', color: 'text-blue-400' },
          { label: 'Phishing Blocked', value: '89', color: 'text-red-400' },
          { label: 'Clean Emails', value: '1,158', color: 'text-green-400' },
        ].map((stat, index) => (
          <div key={stat.label} className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}