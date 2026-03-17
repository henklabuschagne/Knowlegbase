/**
 * DevApiPanel
 * 
 * A floating debug panel for developers to:
 * - View current API configuration (latency, error rate)
 * - Toggle simulated latency and error injection
 * - See data persistence status
 * - Reset all data to defaults
 * - Switch between user roles for testing
 */

import { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { apiConfig } from '../lib/api/config';
import { appStore } from '../lib/appStore';
import {
  Bug,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap,
  AlertTriangle,
  Database,
  Users,
  FileText,
  Tag,
  MessageSquare,
  Bell,
  Shield,
  Paperclip,
  LayoutTemplate,
  Activity,
  X,
  Settings,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function DevApiPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [resetting, setResetting] = useState(false);

  const {
    articles,
    users,
    tags,
    requests,
    notifications,
    feedback,
    approvals,
    attachments,
    templates,
    activityLogs,
    currentUser,
  } = useAppStore(
    'articles', 'users', 'tags', 'requests', 'notifications',
    'feedback', 'approvals', 'attachments', 'templates', 'activity', 'auth'
  );

  const [simulateLatency, setSimulateLatency] = useState(apiConfig.simulateLatency);
  const [errorRate, setErrorRate] = useState(apiConfig.errorRate);

  const handleToggleLatency = () => {
    apiConfig.simulateLatency = !apiConfig.simulateLatency;
    setSimulateLatency(apiConfig.simulateLatency);
  };

  const handleSetErrorRate = (rate: number) => {
    apiConfig.errorRate = rate;
    setErrorRate(rate);
  };

  const handleReset = async () => {
    if (!confirm('Reset ALL data to defaults? This will clear all localStorage and reload the page.')) return;
    setResetting(true);
    appStore.resetToDefaults();
    // Clear auth data too
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSwitchRole = (email: string) => {
    const user = users.find(u => u.email === email);
    if (!user) return;

    // Update auth
    const auth = {
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      roleId: user.roleId,
      roleName: user.roleName,
      teamId: user.teamId,
      teamName: user.teamName,
      clientId: user.clientId,
      clientName: user.clientName,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };

    // Save to localStorage (mimic what authService does)
    localStorage.setItem('accessToken', auth.accessToken);
    localStorage.setItem('refreshToken', auth.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      userId: auth.userId,
      email: auth.email,
      firstName: auth.firstName,
      lastName: auth.lastName,
      fullName: auth.fullName,
      roleId: auth.roleId,
      roleName: auth.roleName,
      teamId: auth.teamId,
      teamName: auth.teamName,
      clientId: auth.clientId,
      clientName: auth.clientName,
    }));

    appStore.setCurrentUser(auth);
    window.location.reload();
  };

  const storageUsed = (() => {
    let total = 0;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('kb_store_')) {
        total += (localStorage.getItem(key) || '').length * 2; // UTF-16
      }
    });
    return (total / 1024).toFixed(1);
  })();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] p-3 bg-brand-main text-white rounded-full shadow-lg hover:bg-brand-main-light transition-colors"
        title="Open Dev Panel"
      >
        <Settings className="w-5 h-5" />
      </button>
    );
  }

  const dataCounts = [
    { label: 'Articles', count: articles.length, icon: FileText, color: 'text-blue-500' },
    { label: 'Users', count: users.length, icon: Users, color: 'text-green-500' },
    { label: 'Tags', count: tags.length, icon: Tag, color: 'text-purple-500' },
    { label: 'Requests', count: requests.length, icon: MessageSquare, color: 'text-orange-500' },
    { label: 'Notifications', count: notifications.length, icon: Bell, color: 'text-yellow-500' },
    { label: 'Feedback', count: feedback.length, icon: MessageSquare, color: 'text-pink-500' },
    { label: 'Approvals', count: approvals.length, icon: Shield, color: 'text-red-500' },
    { label: 'Attachments', count: attachments.length, icon: Paperclip, color: 'text-teal-500' },
    { label: 'Templates', count: templates.length, icon: LayoutTemplate, color: 'text-indigo-500' },
    { label: 'Activity Logs', count: activityLogs.length, icon: Activity, color: 'text-gray-500' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-80 bg-gray-900 text-gray-100 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-green-400" />
          <span className="text-xs tracking-wide">DEV API PANEL</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 hover:bg-gray-700 rounded">
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-700 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Current User */}
          <div className="px-3 py-2 border-b border-gray-700/50">
            <div className="text-[10px] text-gray-400 mb-1">CURRENT USER</div>
            <div className="text-xs">
              {currentUser ? (
                <span>{currentUser.fullName} <Badge variant="outline" className="ml-1 text-[10px] py-0 border-gray-600 text-gray-300">{currentUser.roleName}</Badge></span>
              ) : (
                <span className="text-gray-500">Not logged in</span>
              )}
            </div>
          </div>

          {/* Quick Role Switch */}
          <div className="px-3 py-2 border-b border-gray-700/50">
            <div className="text-[10px] text-gray-400 mb-1.5">QUICK ROLE SWITCH</div>
            <div className="flex flex-wrap gap-1">
              {[
                { email: 'admin@company.com', label: 'Admin', color: 'bg-red-600/20 text-red-400 hover:bg-red-600/30' },
                { email: 'support@company.com', label: 'Support', color: 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' },
                { email: 'user@client1.com', label: 'User', color: 'bg-green-600/20 text-green-400 hover:bg-green-600/30' },
              ].map(role => (
                <button
                  key={role.email}
                  onClick={() => handleSwitchRole(role.email)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-colors ${role.color} ${currentUser?.email === role.email ? 'ring-1 ring-white/30' : ''}`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Configuration */}
          <div className="px-3 py-2 border-b border-gray-700/50">
            <div className="text-[10px] text-gray-400 mb-1.5">API SIMULATION</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>Latency ({apiConfig.minLatency}-{apiConfig.maxLatency}ms)</span>
                </div>
                <button
                  onClick={handleToggleLatency}
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    simulateLatency ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-500'
                  }`}
                >
                  {simulateLatency ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-3 h-3 text-orange-400" />
                  <span>Error Rate</span>
                </div>
                <div className="flex gap-1">
                  {[0, 0.1, 0.3, 0.5].map(rate => (
                    <button
                      key={rate}
                      onClick={() => handleSetErrorRate(rate)}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        errorRate === rate ? 'bg-orange-600/20 text-orange-400' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {rate === 0 ? '0%' : `${rate * 100}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Data Store Stats */}
          <div className="px-3 py-2 border-b border-gray-700/50">
            <div className="text-[10px] text-gray-400 mb-1.5">DATA STORE</div>
            <div className="grid grid-cols-2 gap-1">
              {dataCounts.map(item => (
                <div key={item.label} className="flex items-center gap-1.5 text-xs py-0.5">
                  <item.icon className={`w-3 h-3 ${item.color}`} />
                  <span className="text-gray-400">{item.label}:</span>
                  <span className="text-gray-200">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Persistence */}
          <div className="px-3 py-2 border-b border-gray-700/50">
            <div className="text-[10px] text-gray-400 mb-1.5">DATA PERSISTENCE</div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Database className="w-3 h-3 text-cyan-400" />
                <span className="text-gray-400">localStorage:</span>
                <span className="text-gray-200">{storageUsed} KB</span>
              </div>
              <span className="text-[10px] text-green-400">Auto-saved</span>
            </div>
          </div>

          {/* Reset Button */}
          <div className="px-3 py-2.5">
            <Button
              onClick={handleReset}
              disabled={resetting}
              variant="destructive"
              size="sm"
              className="w-full text-xs h-7"
            >
              <RotateCcw className={`w-3 h-3 mr-1.5 ${resetting ? 'animate-spin' : ''}`} />
              {resetting ? 'Resetting...' : 'Reset All Data to Defaults'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}