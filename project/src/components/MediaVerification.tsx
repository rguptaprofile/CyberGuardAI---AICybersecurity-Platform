import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Upload, Camera, AlertTriangle, CheckCircle, Image, Video, Mic } from 'lucide-react';
import Webcam from 'react-webcam';
import { supabase } from '../lib/supabase';

export default function MediaVerification() {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'audio'>('image');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeMedia = async (mediaData?: string) => {
    setAnalyzing(true);
    setResult(null);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResult = {
        isDeepfake: Math.random() > 0.7,
        confidenceScore: Math.random() * 0.3 + 0.7,
        manipulationTypes: [
          'Face swap detected',
          'Audio synthesis',
          'Temporal inconsistencies',
          'Compression artifacts'
        ].filter(() => Math.random() > 0.6),
        technicalAnalysis: {
          resolution: '1920x1080',
          frameRate: activeTab === 'video' ? '30fps' : null,
          bitrate: activeTab === 'audio' ? '320kbps' : null,
          metadata: 'Original metadata preserved'
        },
        riskLevel: Math.random() > 0.5 ? 'high' : 'low'
      };

      setResult(mockResult);

      // Save analysis results
      await supabase.from('scan_results').insert({
        scan_type: `media_verification_${activeTab}`,
        result: mockResult,
        confidence_score: mockResult.confidenceScore
      });

      // Create threat detection if deepfake detected
      if (mockResult.isDeepfake) {
        await supabase.from('threat_detections').insert({
          type: 'deepfake',
          severity: mockResult.confidenceScore > 0.8 ? 'high' : 'medium',
          description: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} deepfake detected`,
          source: 'Media Verification System',
          metadata: mockResult
        });
      }

    } catch (error) {
      console.error('Error analyzing media:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setUseWebcam(false);
    }
  };

  const captureWebcam = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      analyzeMedia(imageSrc);
    }
  };

  const tabs = [
    { id: 'image', label: 'Image Analysis', icon: Image },
    { id: 'video', label: 'Video Analysis', icon: Video },
    { id: 'audio', label: 'Audio Analysis', icon: Mic },
  ];

  const stats = [
    { label: 'Media Analyzed', value: '2,847', color: 'text-blue-400' },
    { label: 'Deepfakes Detected', value: '156', color: 'text-red-400' },
    { label: 'Authentic Content', value: '2,691', color: 'text-green-400' },
    { label: 'Detection Accuracy', value: '97.8%', color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Media Verification</h1>
        <p className="mt-2 text-slate-400">AI-powered deepfake and misinformation detection</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Media Upload/Capture */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Eye className="h-6 w-6 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Verification
            </h2>
          </div>

          <div className="space-y-4">
            {activeTab === 'image' && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setUseWebcam(!useWebcam)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    useWebcam 
                      ? 'bg-cyan-500/20 text-cyan-300' 
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  Use Webcam
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !useWebcam 
                      ? 'bg-cyan-500/20 text-cyan-300' 
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </button>
              </div>
            )}

            {useWebcam && activeTab === 'image' ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <button
                  onClick={captureWebcam}
                  disabled={analyzing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Camera className="h-4 w-4" />
                  Capture & Analyze
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={
                    activeTab === 'image' ? 'image/*' :
                    activeTab === 'video' ? 'video/*' : 'audio/*'
                  }
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-300 mb-2">
                    Click to upload {activeTab} file
                  </p>
                  <p className="text-sm text-slate-400">
                    {activeTab === 'image' && 'PNG, JPG, GIF up to 10MB'}
                    {activeTab === 'video' && 'MP4, AVI, MOV up to 100MB'}
                    {activeTab === 'audio' && 'MP3, WAV, AAC up to 50MB'}
                  </p>
                </div>

                {file && (
                  <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                    <p className="text-sm text-slate-300">Selected: {file.name}</p>
                    <button
                      onClick={() => analyzeMedia()}
                      disabled={analyzing}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      {analyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Analyzing {activeTab}...
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Analyze {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
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
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Upload or capture media to see analysis results</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Authenticity Status */}
              <div className={`p-4 rounded-lg border ${
                result.isDeepfake 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {result.isDeepfake ? (
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  )}
                  <span className={`font-semibold ${
                    result.isDeepfake ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {result.isDeepfake ? 'Potential Deepfake Detected' : 'Content Appears Authentic'}
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Confidence: {(result.confidenceScore * 100).toFixed(1)}%
                </p>
              </div>

              {/* Manipulation Details */}
              {result.manipulationTypes && result.manipulationTypes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-3">Detected Manipulations</h3>
                  <ul className="space-y-2">
                    {result.manipulationTypes.map((manipulation: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                        <span className="text-slate-300">{manipulation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technical Analysis */}
              <div>
                <h3 className="font-semibold text-white mb-3">Technical Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Resolution:</span>
                    <span className="text-white">{result.technicalAnalysis.resolution}</span>
                  </div>
                  {result.technicalAnalysis.frameRate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Frame Rate:</span>
                      <span className="text-white">{result.technicalAnalysis.frameRate}</span>
                    </div>
                  )}
                  {result.technicalAnalysis.bitrate && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bitrate:</span>
                      <span className="text-white">{result.technicalAnalysis.bitrate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Level:</span>
                    <span className={`font-medium ${
                      result.riskLevel === 'high' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}