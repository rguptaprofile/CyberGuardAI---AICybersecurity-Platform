import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Mail, 
  CreditCard, 
  Network, 
  Eye, 
  Lightbulb,
  BarChart3,
  Settings
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Email Security', href: '/email-security', icon: Mail },
  { name: 'Fraud Detection', href: '/fraud-detection', icon: CreditCard },
  { name: 'Network Security', href: '/network-security', icon: Network },
  { name: 'Media Verification', href: '/media-verification', icon: Eye },
  { name: 'Innovation Hub', href: '/innovation', icon: Lightbulb },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-72 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700">
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-700">
              <Shield className="h-8 w-8 text-cyan-400" />
              <span className="ml-3 text-xl font-bold text-white">CyberGuard AI</span>
            </div>
            
            {/* Navigation */}
            <nav className="flex flex-1 flex-col px-3 py-6">
              <ul role="list" className="flex flex-1 flex-col gap-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/10'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="pl-72 flex-1">
          <main className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
          
          {/* Contact Footer */}
          <footer className="border-t border-slate-700 bg-slate-800/30 backdrop-blur-xl">
            <div className="px-8 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Developer</h3>
                  <div className="space-y-1 text-sm text-slate-300">
                    <p><span className="font-medium text-cyan-400">Developer:</span> RAHUL RAJ</p>
                    <p><span className="font-medium text-cyan-400">Email:</span> rahul_ua2503cdh466@iitp.ac.in</p>
                    <p><span className="font-medium text-cyan-400">Mobile:</span> (+91) 6209980667</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span>CyberGuard AI Platform © 2024</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}