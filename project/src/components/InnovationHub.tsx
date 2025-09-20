import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Users, Code, Trophy, Star, GitBranch, Zap, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

const projects = [
  {
    id: 1,
    title: 'Quantum-Resistant Encryption',
    description: 'Developing post-quantum cryptographic algorithms to secure against future quantum computing threats.',
    category: 'Cryptography',
    difficulty: 'Advanced',
    contributors: 23,
    stars: 156,
    progress: 78,
    tags: ['Quantum', 'Encryption', 'Security'],
    status: 'Active'
  },
  {
    id: 2,
    title: 'AI-Powered Threat Hunting',
    description: 'Machine learning models for proactive threat detection and automated incident response.',
    category: 'AI/ML',
    difficulty: 'Intermediate',
    contributors: 45,
    stars: 289,
    progress: 92,
    tags: ['AI', 'Threat Detection', 'Automation'],
    status: 'Active'
  },
  {
    id: 3,
    title: 'Blockchain Security Audit Tool',
    description: 'Automated smart contract vulnerability scanner with real-time monitoring capabilities.',
    category: 'Blockchain',
    difficulty: 'Advanced',
    contributors: 18,
    stars: 134,
    progress: 65,
    tags: ['Blockchain', 'Smart Contracts', 'Audit'],
    status: 'Active'
  },
  {
    id: 4,
    title: 'Zero-Trust Network Framework',
    description: 'Open-source implementation of zero-trust architecture for enterprise networks.',
    category: 'Network Security',
    difficulty: 'Expert',
    contributors: 67,
    stars: 412,
    progress: 85,
    tags: ['Zero-Trust', 'Network', 'Enterprise'],
    status: 'Featured'
  }
];

const challenges = [
  {
    id: 1,
    title: 'Deepfake Detection Challenge',
    description: 'Build the most accurate deepfake detection model using our dataset.',
    prize: '$10,000',
    participants: 234,
    deadline: '2024-03-15',
    difficulty: 'Advanced'
  },
  {
    id: 2,
    title: 'IoT Security Framework',
    description: 'Design a comprehensive security framework for IoT device management.',
    prize: '$7,500',
    participants: 156,
    deadline: '2024-02-28',
    difficulty: 'Intermediate'
  },
  {
    id: 3,
    title: 'Phishing Email Classifier',
    description: 'Create an AI model that can identify sophisticated phishing attempts.',
    prize: '$5,000',
    participants: 189,
    deadline: '2024-04-10',
    difficulty: 'Beginner'
  }
];

export default function InnovationHub() {
  const [activeTab, setActiveTab] = useState<'projects' | 'challenges' | 'contribute'>('projects');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [contributionForm, setContributionForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner'
  });

  const handleStarProject = (projectId: number) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    setContributionForm({ title: '', description: '', category: '', difficulty: 'Beginner' });
  };

  const tabs = [
    { id: 'projects', label: 'Open Projects', icon: Code },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'contribute', label: 'Contribute', icon: Lightbulb },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Innovation Hub</h1>
        <p className="mt-2 text-slate-400">Open innovation in cybersecurity defense - collaborate, compete, and contribute</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', value: '47', icon: Code, color: 'text-blue-400' },
          { label: 'Contributors', value: '1,234', icon: Users, color: 'text-green-400' },
          { label: 'Challenges', value: '12', icon: Trophy, color: 'text-yellow-400' },
          { label: 'Solutions Deployed', value: '89', icon: Zap, color: 'text-purple-400' },
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

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-slate-400 mb-3">{project.description}</p>
                  </div>
                  {project.status === 'Featured' && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.contributors}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {project.stars}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStarProject(project.id);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                  >
                    <Star className="h-4 w-4" />
                    Star
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="h-6 w-6 text-yellow-400" />
                      <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                    </div>
                    <p className="text-slate-300 mb-4">{challenge.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{challenge.prize}</div>
                    <div className="text-sm text-slate-400">Prize Pool</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">{challenge.participants}</div>
                    <div className="text-sm text-slate-400">Participants</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <div className="text-lg font-semibold text-white">{challenge.deadline}</div>
                    <div className="text-sm text-slate-400">Deadline</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <div className={`text-lg font-semibold ${
                      challenge.difficulty === 'Advanced' ? 'text-red-400' :
                      challenge.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {challenge.difficulty}
                    </div>
                    <div className="text-sm text-slate-400">Difficulty</div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200">
                  <Target className="h-4 w-4" />
                  Join Challenge
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'contribute' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-700">
              <div className="text-center mb-8">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white mb-2">Contribute Your Ideas</h2>
                <p className="text-slate-400">Share your cybersecurity innovation with the community</p>
              </div>

              <form onSubmit={handleSubmitContribution} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={contributionForm.title}
                    onChange={(e) => setContributionForm({...contributionForm, title: e.target.value})}
                    required
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="Enter your project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={contributionForm.description}
                    onChange={(e) => setContributionForm({...contributionForm, description: e.target.value})}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="Describe your cybersecurity innovation..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={contributionForm.category}
                      onChange={(e) => setContributionForm({...contributionForm, category: e.target.value})}
                      required
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <option value="">Select category</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Cryptography">Cryptography</option>
                      <option value="Network Security">Network Security</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="IoT Security">IoT Security</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={contributionForm.difficulty}
                      onChange={(e) => setContributionForm({...contributionForm, difficulty: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <GitBranch className="h-4 w-4" />
                  Submit Contribution
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}