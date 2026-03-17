/**
 * Mock Authentication Initialization
 * 
 * Pre-initializes authentication data in localStorage when mock mode is enabled.
 * This ensures the app starts with admin already logged in without any async delays.
 */

import { MOCK_MODE_ENABLED } from './mockMode.config';
import { MOCK_USERS } from './mockData.service';
import type { AuthResponse } from '../../types/dto';
import { appStore } from '../../lib/appStore';

/**
 * Initialize mock admin session in localStorage
 * This runs synchronously before the app renders
 */
export const initializeMockAuth = () => {
  console.log('🔍 initializeMockAuth called, MOCK_MODE_ENABLED:', MOCK_MODE_ENABLED);
  
  if (!MOCK_MODE_ENABLED) {
    console.log('❌ Mock mode disabled, skipping auth initialization');
    return;
  }

  // Check if already authenticated
  const existingToken = localStorage.getItem('accessToken');
  if (existingToken) {
    console.log('✅ Already authenticated, token exists:', existingToken.substring(0, 20) + '...');
    return; // Already logged in
  }

  // Find admin user from mock data
  const adminUser = MOCK_USERS.find(u => u.roleName === 'Admin');
  if (!adminUser) {
    console.error('❌ Mock Mode: Admin user not found in mock data');
    return;
  }

  // Create auth response
  const authResponse: AuthResponse = {
    userId: adminUser.userId,
    email: adminUser.email,
    firstName: adminUser.firstName,
    lastName: adminUser.lastName,
    fullName: adminUser.fullName,
    roleId: adminUser.roleId,
    roleName: adminUser.roleName,
    teamId: adminUser.teamId,
    teamName: adminUser.teamName,
    clientId: adminUser.clientId,
    clientName: adminUser.clientName,
    accessToken: 'mock-access-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };

  // Save to localStorage
  localStorage.setItem('accessToken', authResponse.accessToken);
  localStorage.setItem('refreshToken', authResponse.refreshToken);
  localStorage.setItem('user', JSON.stringify({
    userId: authResponse.userId,
    email: authResponse.email,
    firstName: authResponse.firstName,
    lastName: authResponse.lastName,
    fullName: authResponse.fullName,
    roleId: authResponse.roleId,
    roleName: authResponse.roleName,
    teamId: authResponse.teamId,
    teamName: authResponse.teamName,
    clientId: authResponse.clientId,
    clientName: authResponse.clientName,
  }));

  // Sync with centralized appStore
  appStore.setCurrentUser(authResponse);

  console.log('🎭 Mock Mode: Admin session pre-initialized');
  console.log(`👤 Logged in as: ${authResponse.fullName} (${authResponse.roleName})`);
  console.log('🔑 Access token:', authResponse.accessToken);
};