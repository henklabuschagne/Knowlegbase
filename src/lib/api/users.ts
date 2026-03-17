/**
 * Mock API Layer - Users Domain
 * Mirrors: UserController + AuthController endpoints
 */

import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { UserDto, CreateUserRequest, UpdateUserRequest } from '../../types/dto';
import type { AuthResponse } from '../../types/dto';

// POST /api/auth/login
export async function login(email: string, password: string): Promise<ApiResult<AuthResponse>> {
  if (!email?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Email is required');
  }
  return mockApiCall(() => {
    const user = appStore.loginUser(email);
    if (!user) throw new Error('Invalid credentials');
    return user;
  });
}

// POST /api/auth/logout
export async function logout(): Promise<ApiResult<void>> {
  return mockApiCall(() => appStore.logoutUser());
}

// GET /api/users
export async function getUsers(): Promise<ApiResult<UserDto[]>> {
  return mockApiCall(() => appStore.users);
}

// GET /api/users/:id
export async function getUserById(id: number): Promise<ApiResult<UserDto>> {
  return mockApiCall(() => {
    const user = appStore.users.find(u => u.userId === id);
    if (!user) throw new Error(`User ${id} not found`);
    return user;
  });
}

// POST /api/users
export async function createUser(data: CreateUserRequest): Promise<ApiResult<UserDto>> {
  if (!data.email?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Email is required');
  }
  if (!data.firstName?.trim() || !data.lastName?.trim()) {
    return errorResponse('VALIDATION_ERROR', 'First name and last name are required');
  }
  // Check for duplicate email
  if (appStore.users.some(u => u.email === data.email)) {
    return errorResponse('DUPLICATE_ERROR', 'A user with this email already exists');
  }
  return mockApiCall(() => appStore.createUser(data));
}

// PUT /api/users/:id
export async function updateUser(id: number, data: UpdateUserRequest): Promise<ApiResult<UserDto>> {
  return mockApiCall(() => {
    const result = appStore.updateUser(id, data);
    if (!result) throw new Error(`User ${id} not found`);
    return result;
  });
}

// DELETE /api/users/:id
export async function deleteUser(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteUser(id);
    if (!result) throw new Error(`User ${id} not found`);
    return result;
  });
}

// GET /api/users/roles
export async function getRoles(): Promise<ApiResult<typeof appStore.roles>> {
  return mockApiCall(() => appStore.roles);
}

// GET /api/users/teams
export async function getTeams(): Promise<ApiResult<typeof appStore.teams>> {
  return mockApiCall(() => appStore.teams);
}

// GET /api/users/clients
export async function getClients(): Promise<ApiResult<typeof appStore.clients>> {
  return mockApiCall(() => appStore.clients);
}