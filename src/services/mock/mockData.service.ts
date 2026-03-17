/**
 * Mock Data Service
 * 
 * Provides comprehensive mock data for all entities in the knowledge base system.
 * Data structures match the backend DTOs exactly.
 */

import type {
  AuthResponse,
  ArticleDto,
  ArticleListDto,
  TagDto,
  UserDto,
  RoleDto,
  TeamDto,
  ClientDto,
  ArticleRequestDto,
  NotificationDto,
  FeedbackDto,
  ApprovalDto,
  ArticleVersionDto,
  AttachmentDto,
  ArticleTemplateDto as TemplateDto,
  PagedResultDto,
} from '../../types/dto';

// =====================================================
// USERS & AUTHENTICATION
// =====================================================

export const MOCK_USERS: UserDto[] = [
  {
    userId: 1,
    email: 'admin@company.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    roleId: 1,
    roleName: 'Admin',
    teamId: 1,
    teamName: 'Engineering',
    clientId: undefined,
    clientName: undefined,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-11-26T10:30:00Z',
  },
  {
    userId: 2,
    email: 'support@company.com',
    firstName: 'Support',
    lastName: 'User',
    fullName: 'Support User',
    roleId: 2,
    roleName: 'Support',
    teamId: 2,
    teamName: 'Customer Success',
    clientId: undefined,
    clientName: undefined,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    lastLoginAt: '2024-11-26T09:15:00Z',
  },
  {
    userId: 3,
    email: 'user@client1.com',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    roleId: 3,
    roleName: 'User',
    teamId: undefined,
    teamName: undefined,
    clientId: 1,
    clientName: 'Acme Corporation',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    lastLoginAt: '2024-11-25T16:45:00Z',
  },
  {
    userId: 4,
    email: 'user@client2.com',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    roleId: 3,
    roleName: 'User',
    teamId: undefined,
    teamName: undefined,
    clientId: 2,
    clientName: 'Global Tech Inc',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    lastLoginAt: '2024-11-26T08:20:00Z',
  },
  {
    userId: 5,
    email: 'internal@company.com',
    firstName: 'Internal',
    lastName: 'Staff',
    fullName: 'Internal Staff',
    roleId: 3,
    roleName: 'User',
    teamId: 1,
    teamName: 'Engineering',
    clientId: undefined,
    clientName: undefined,
    isActive: true,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    lastLoginAt: '2024-11-26T11:00:00Z',
  },
];

export const MOCK_ROLES: RoleDto[] = [
  {
    roleId: 1,
    roleName: 'Admin',
    description: 'Full system access with all permissions',
    isActive: true,
  },
  {
    roleId: 2,
    roleName: 'Support',
    description: 'Can review article requests and provide support',
    isActive: true,
  },
  {
    roleId: 3,
    roleName: 'User',
    description: 'Can view articles, submit requests, and provide feedback',
    isActive: true,
  },
];

export const MOCK_TEAMS: TeamDto[] = [
  {
    teamId: 1,
    teamName: 'Engineering',
    description: 'Software development and engineering team',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    teamId: 2,
    teamName: 'Customer Success',
    description: 'Customer support and success team',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    teamId: 3,
    teamName: 'Product',
    description: 'Product management team',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const MOCK_CLIENTS: ClientDto[] = [
  {
    clientId: 1,
    clientName: 'Acme Corporation',
    description: 'Enterprise software solutions provider',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    clientId: 2,
    clientName: 'Global Tech Inc',
    description: 'International technology company',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    clientId: 3,
    clientName: 'Startup Innovations',
    description: 'Fast-growing tech startup',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
  },
];

// =====================================================
// TAGS
// =====================================================

export const MOCK_TAGS: TagDto[] = [
  {
    tagId: 1,
    tagName: 'Internal',
    tagTypeId: 1,
    tagTypeName: 'Visibility',
    colorCode: '#3b82f6',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 2,
    tagName: 'External',
    tagTypeId: 1,
    tagTypeName: 'Visibility',
    colorCode: '#10b981',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 3,
    tagName: 'v2.0',
    tagTypeId: 2,
    tagTypeName: 'Version',
    colorCode: '#8b5cf6',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 4,
    tagName: 'v2.1',
    tagTypeId: 2,
    tagTypeName: 'Version',
    colorCode: '#8b5cf6',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 5,
    tagName: 'v3.0',
    tagTypeId: 2,
    tagTypeName: 'Version',
    colorCode: '#8b5cf6',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 6,
    tagName: 'Engineering',
    tagTypeId: 3,
    tagTypeName: 'Team',
    colorCode: '#f59e0b',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 7,
    tagName: 'Customer Success',
    tagTypeId: 3,
    tagTypeName: 'Team',
    colorCode: '#f59e0b',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 8,
    tagName: 'Acme Corporation',
    tagTypeId: 4,
    tagTypeName: 'Client',
    colorCode: '#ec4899',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 9,
    tagName: 'Global Tech Inc',
    tagTypeId: 4,
    tagTypeName: 'Client',
    colorCode: '#ec4899',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 10,
    tagName: 'Authentication',
    tagTypeId: 5,
    tagTypeName: 'Module',
    colorCode: '#06b6d4',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 11,
    tagName: 'API',
    tagTypeId: 5,
    tagTypeName: 'Module',
    colorCode: '#06b6d4',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 12,
    tagName: 'Dashboard',
    tagTypeId: 5,
    tagTypeName: 'Module',
    colorCode: '#06b6d4',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 13,
    tagName: 'Security',
    tagTypeId: 5,
    tagTypeName: 'Module',
    colorCode: '#06b6d4',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    tagId: 14,
    tagName: 'Webhooks',
    tagTypeId: 5,
    tagTypeName: 'Module',
    colorCode: '#06b6d4',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const MOCK_TAG_TYPES = [
  {
    tagTypeId: 1,
    tagTypeName: 'Visibility',
  },
  {
    tagTypeId: 2,
    tagTypeName: 'Version',
  },
  {
    tagTypeId: 3,
    tagTypeName: 'Team',
  },
  {
    tagTypeId: 4,
    tagTypeName: 'Client',
  },
  {
    tagTypeId: 5,
    tagTypeName: 'Module',
  },
];

// =====================================================
// ARTICLES
// =====================================================

const ARTICLE_CONTENT_1 = `# Getting Started with Authentication

## Overview

This comprehensive guide will walk you through setting up authentication in our platform. Authentication is a critical component of securing your application and protecting user data.

> **Important:** This guide assumes you have admin-level access to your organization's dashboard. If you don't have the necessary permissions, please contact your system administrator.

### What You'll Learn

In this article, you'll discover how to:
- Set up OAuth 2.0 authentication for your application
- Configure API credentials securely
- Implement the complete authentication flow
- Handle tokens and session management
- Troubleshoot common authentication issues

## Prerequisites

Before you begin, ensure you have:
- An active account with admin privileges
- API credentials from your dashboard
- Basic understanding of OAuth 2.0 protocol
- Node.js 16+ or Python 3.8+ installed

### Required Tools

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 16+ | Runtime environment |
| npm/yarn | Latest | Package management |
| Git | 2.0+ | Version control |
| Code Editor | Any | Development |

## Step-by-Step Implementation

Follow these steps carefully to implement authentication in your application. The process involves configuring OAuth settings, implementing the authentication flow, and making authenticated requests.

### Step 1: Create API Credentials

Navigate to **Settings > API** and click **"Create New Credentials"**

You'll receive:
- **Client ID** - Public identifier for your application
- **Client Secret** - Private key (keep this secure!)
- **API Key** - For server-to-server calls

> **Security Warning:** Store these credentials securely using environment variables or a secrets manager. Never commit them to version control or expose them in client-side code.

**Example .env file:**
\`\`\`bash
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
API_KEY=your_api_key_here
REDIRECT_URI=https://yourapp.com/callback
\`\`\`

### Step 2: Configure OAuth Settings

Add your redirect URLs in the OAuth settings panel. Make sure to configure both development and production URLs correctly.

**Redirect URLs:**
- **Development:** \`http://localhost:3000/callback\`
- **Staging:** \`https://staging.yourapp.com/callback\`
- **Production:** \`https://yourapp.com/callback\`

> **Note:** Redirect URLs must match exactly, including the protocol (http/https), domain, port, and path. Trailing slashes matter!

### Step 3: Implement Authentication Flow

Use our official SDK to implement the authentication flow:

**Node.js/Express Example:**
\`\`\`javascript
import { Auth } from '@company/sdk';
import express from 'express';

const app = express();

// Initialize the Auth client
const auth = new Auth({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI
});

// Step 1: Initiate the login flow
app.get('/login', (req, res) => {
  const authUrl = auth.getAuthorizationUrl({
    scope: ['read:profile', 'write:data'],
    state: generateRandomState() // CSRF protection
  });
  res.redirect(authUrl);
});

// Step 2: Handle the OAuth callback
app.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // Validate state to prevent CSRF attacks
    if (!validateState(state)) {
      throw new Error('Invalid state parameter');
    }
    
    // Exchange authorization code for tokens
    const tokens = await auth.exchangeCodeForTokens(code);
    
    // Store tokens securely in session
    req.session.accessToken = tokens.accessToken;
    req.session.refreshToken = tokens.refreshToken;
    req.session.expiresAt = Date.now() + tokens.expiresIn * 1000;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Authentication error:', error);
    res.redirect('/login?error=auth_failed');
  }
});

// Helper functions
function generateRandomState() {
  return crypto.randomBytes(32).toString('hex');
}

function validateState(state) {
  // Implement state validation logic
  return true;
}
\`\`\`

**Python/Flask Example:**
\`\`\`python
from flask import Flask, redirect, request, session
from company_sdk import Auth
import os

app = Flask(__name__)
app.secret_key = os.environ['SESSION_SECRET']

auth = Auth(
    client_id=os.environ['CLIENT_ID'],
    client_secret=os.environ['CLIENT_SECRET'],
    redirect_uri=os.environ['REDIRECT_URI']
)

@app.route('/login')
def login():
    auth_url = auth.get_authorization_url(
        scope=['read:profile', 'write:data']
    )
    return redirect(auth_url)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    tokens = auth.exchange_code_for_tokens(code)
    
    session['access_token'] = tokens['access_token']
    session['refresh_token'] = tokens['refresh_token']
    
    return redirect('/dashboard')
\`\`\`

### Step 4: Making Authenticated Requests

Once authenticated, include the access token in your API requests:

\`\`\`javascript
// Using fetch API
async function getUserProfile(accessToken) {
  const response = await fetch('https://api.example.com/user/profile', {
    headers: {
      'Authorization': \`Bearer \${accessToken}\`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  const userData = await response.json();
  return userData;
}

// Using axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  }
});

const { data } = await api.get('/user/profile');
\`\`\`

### Step 5: Implement Token Refresh

Access tokens expire after 1 hour. Implement automatic token refresh to maintain authentication:

\`\`\`javascript
async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://api.example.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })
  });
  
  const tokens = await response.json();
  return tokens;
}

// Middleware to check and refresh tokens
async function ensureAuthenticated(req, res, next) {
  const { accessToken, refreshToken, expiresAt } = req.session;
  
  // Check if token is expired or about to expire (5 min buffer)
  if (Date.now() >= expiresAt - 300000) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      req.session.accessToken = newTokens.access_token;
      req.session.expiresAt = Date.now() + newTokens.expires_in * 1000;
    } catch (error) {
      return res.redirect('/login');
    }
  }
  
  next();
}
\`\`\`

## Security Best Practices

### 1. Store Credentials Securely
- Use environment variables for API credentials
- Never hardcode secrets in source code
- Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate credentials regularly

### 2. Implement PKCE (Proof Key for Code Exchange)
For public clients (mobile apps, SPAs), use PKCE to prevent authorization code interception attacks:

\`\`\`javascript
const pkce = require('pkce-challenge');

// Generate PKCE challenge
const { code_verifier, code_challenge } = pkce();

// Include in authorization URL
const authUrl = auth.getAuthorizationUrl({
  code_challenge: code_challenge,
  code_challenge_method: 'S256'
});

// Include verifier when exchanging code
const tokens = await auth.exchangeCodeForTokens(code, {
  code_verifier: code_verifier
});
\`\`\`

### 3. Validate All Inputs
Always validate redirect URIs, state parameters, and tokens to prevent security vulnerabilities.

## Troubleshooting

### Common Issues

#### Error: "Invalid redirect_uri"
**Symptoms:** Authentication fails with redirect URI mismatch error

**Solutions:**
- Verify the redirect URI exactly matches the one configured in your settings
- Check for trailing slashes - they must match exactly
- Ensure protocol (http/https) matches
- Verify domain and port are correct

#### Error: "Invalid client credentials"
**Symptoms:** API returns 401 Unauthorized

**Solutions:**
- Ensure you're using the correct Client ID and Secret
- Check that your credentials haven't expired
- Verify you're making requests to the correct environment (staging vs production)
- Confirm credentials are properly URL-encoded

#### Tokens expiring too quickly
**Symptoms:** Users are logged out frequently

**Solutions:**
- Access tokens expire after 1 hour by default
- Implement refresh token logic to obtain new access tokens automatically
- Consider using our session management SDK for automatic token refresh
- Check if your token refresh logic is working correctly

#### CORS errors in browser
**Symptoms:** Browser console shows CORS policy errors

**Solutions:**
- Ensure your domain is added to allowed origins in dashboard settings
- Check that you're including proper CORS headers
- For development, ensure localhost is whitelisted
- Verify you're not mixing http and https

## Advanced Topics

### Single Sign-On (SSO)
Enterprise customers can enable SSO integration with SAML 2.0 or OpenID Connect. [Contact support](mailto:support@example.com) for configuration assistance.

### Multi-Factor Authentication
Require users to provide additional verification factors beyond username and password. See our [MFA Implementation Guide](#) for details.

### Session Management
Learn how to manage user sessions, handle concurrent logins, and implement session timeout policies in our [Session Management Guide](#).

## Additional Resources

- [API Reference Documentation](https://api-docs.example.com)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Security Best Practices](https://security.example.com)
- [SDK Documentation](https://sdk-docs.example.com)

## Need Help?

If you're still experiencing issues or have questions:
- 📧 Email: [support@example.com](mailto:support@example.com)
- 💬 Live Chat: Available in your dashboard
- 📚 [Community Forum](https://community.example.com)
- 🎥 [Video Tutorials](https://learn.example.com)

---

*Last updated: November 20, 2024 • Version 3.0*`;

const ARTICLE_CONTENT_2 = `# API Rate Limiting Guide

## Introduction

Understanding our API rate limits is crucial for building reliable integrations. This guide covers everything you need to know about rate limits, how to handle them gracefully, and best practices for optimization.

> **Quick Reference:** Most common rate limit is 1,000 requests/hour for Professional plans. Check the [Rate Limits by Plan](#rate-limits-by-plan) section for your specific tier.

### Why Rate Limiting?

Rate limiting protects our infrastructure and ensures fair resource allocation across all users. It prevents abuse and helps maintain consistent API performance for everyone.

**Key Benefits:**
- **Stability:** Prevents system overload
- **Fairness:** Equal access for all users
- **Security:** Mitigates DDoS attacks
- **Cost Control:** Manages infrastructure costs

## Rate Limits by Plan

Choose the plan that best fits your application's needs:

### Free Tier

Perfect for testing and development:

| Metric | Limit |
|--------|-------|
| Hourly Requests | 100 |
| Daily Requests | 1,000 |
| Burst Limit | 10 req/sec |
| Concurrent Connections | 5 |

**Ideal for:**
- Testing and development
- Personal projects
- Small applications
- Proof of concepts

### Professional

For production applications:

| Metric | Limit |
|--------|-------|
| Hourly Requests | 1,000 |
| Daily Requests | 10,000 |
| Burst Limit | 50 req/sec |
| Concurrent Connections | 25 |

**Ideal for:**
- Production applications
- Small to medium businesses
- Mobile applications
- Web applications

### Enterprise

Custom limits tailored to your needs:

| Metric | Limit |
|--------|-------|
| Hourly Requests | Custom |
| Daily Requests | Custom |
| Burst Limit | Custom |
| Concurrent Connections | Custom |

**Features:**
- Dedicated rate limit pools
- Priority support (24/7)
- Custom SLAs
- Dedicated account manager

[Contact sales for pricing](mailto:sales@example.com)

## Understanding Rate Limit Headers

### Response Headers

Monitor these headers in **every** API response to track your usage:

| Header | Description | Example Value |
|--------|-------------|---------------|
| \`X-RateLimit-Limit\` | Maximum requests allowed in current window | \`1000\` |
| \`X-RateLimit-Remaining\` | Requests remaining in current window | \`857\` |
| \`X-RateLimit-Reset\` | Unix timestamp when limit resets | \`1640995200\` |
| \`Retry-After\` | Seconds to wait before retrying (on 429 errors) | \`3600\` |
| \`X-RateLimit-Used\` | Number of requests used in current window | \`143\` |

### Example Response

\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 857
X-RateLimit-Reset: 1640995200
X-RateLimit-Used: 143

{
  "data": { ... }
}
\`\`\`

## HTTP Status Codes

### 429 Too Many Requests

You've exceeded your rate limit. Wait for the time specified in the \`Retry-After\` header before retrying.

**Response Example:**
\`\`\`json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded your rate limit. Please retry after 3600 seconds.",
    "retry_after": 3600,
    "limit": 1000,
    "used": 1000,
    "reset": 1640995200
  }
}
\`\`\`

### 503 Service Unavailable

Our servers are temporarily overloaded. Implement exponential backoff and retry.

**Response Example:**
\`\`\`json
{
  "error": {
    "code": "service_unavailable",
    "message": "The service is temporarily unavailable. Please try again later.",
    "retry_after": 60
  }
}
\`\`\`

## Best Practices

### 1. Implement Exponential Backoff

Handle rate limits gracefully by implementing exponential backoff:

**Python Example:**
\`\`\`python
import time
import requests
from typing import Optional, Dict, Any

def make_api_request(
    url: str, 
    headers: Optional[Dict[str, str]] = None,
    max_retries: int = 3
) -> Dict[str, Any]:
    """
    Make an API request with exponential backoff retry logic.
    
    Args:
        url: The API endpoint URL
        headers: Optional HTTP headers
        max_retries: Maximum number of retry attempts
        
    Returns:
        JSON response data
        
    Raises:
        Exception: If max retries exceeded
    """
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)
        
        # Success
        if response.status_code == 200:
            return response.json()
        
        # Rate limited
        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 60))
            wait_time = retry_after * (2 ** attempt)  # Exponential backoff
            print(f"Rate limited. Waiting {wait_time} seconds...")
            time.sleep(wait_time)
            continue
        
        # Service unavailable
        if response.status_code == 503:
            wait_time = 2 ** attempt  # Start with 1, 2, 4 seconds
            print(f"Service unavailable. Waiting {wait_time} seconds...")
            time.sleep(wait_time)
            continue
        
        # Other errors
        response.raise_for_status()
    
    raise Exception(f"Max retries ({max_retries}) exceeded")

# Usage
try:
    data = make_api_request(
        'https://api.example.com/data',
        headers={'Authorization': 'Bearer YOUR_TOKEN'}
    )
    print(data)
except Exception as e:
    print(f"Request failed: {e}")
\`\`\`

**JavaScript/Node.js Example:**
\`\`\`javascript
async function makeApiRequest(url, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Success
      if (response.ok) {
        return await response.json();
      }
      
      // Rate limited
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        const waitTime = retryAfter * Math.pow(2, attempt) * 1000;
        console.log(\`Rate limited. Waiting \${waitTime / 1000} seconds...\`);
        await sleep(waitTime);
        continue;
      }
      
      // Service unavailable
      if (response.status === 503) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(\`Service unavailable. Waiting \${waitTime / 1000} seconds...\`);
        await sleep(waitTime);
        continue;
      }
      
      // Other errors
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }
  
  throw new Error(\`Max retries (\${maxRetries}) exceeded\`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
try {
  const data = await makeApiRequest('https://api.example.com/data', {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  });
  console.log(data);
} catch (error) {
  console.error('Request failed:', error);
}
\`\`\`

### 2. Implement Response Caching

Reduce API calls by caching responses when appropriate:

**Node.js with Redis:**
\`\`\`javascript
const redis = require('redis');
const client = redis.createClient();

const CACHE_TTL = 300; // 5 minutes

async function fetchWithCache(url, options = {}) {
  const cacheKey = \`api_cache:\${url}\`;
  
  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    console.log('Cache hit');
    return JSON.parse(cached);
  }
  
  // Make API request
  console.log('Cache miss - fetching from API');
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Store in cache
  await client.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
  
  return data;
}
\`\`\`

**In-Memory Cache (Simple):**
\`\`\`javascript
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

async function fetchWithCache(url, options = {}) {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  // Return cached data if valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Cache hit');
    return cached.data;
  }
  
  // Fetch from API
  console.log('Cache miss - fetching from API');
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Store in cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  // Clean up old cache entries periodically
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  
  return data;
}
\`\`\`

### 3. Use Batch Endpoints

Instead of making multiple individual requests, use batch endpoints when available:

**Bad - Multiple Requests:**
\`\`\`javascript
// Makes 100 API calls!
for (const userId of userIds) {
  const user = await fetch(\`/api/users/\${userId}\`);
}
\`\`\`

**Good - Single Batch Request:**
\`\`\`javascript
// Makes 1 API call
const users = await fetch('/api/users/batch', {
  method: 'POST',
  body: JSON.stringify({ ids: userIds })
});
\`\`\`

### 4. Monitor Your Usage

Track your API usage to avoid hitting limits:

\`\`\`javascript
class RateLimitMonitor {
  constructor() {
    this.usage = {
      limit: 0,
      remaining: 0,
      reset: 0,
      used: 0
    };
  }
  
  updateFromHeaders(headers) {
    this.usage = {
      limit: parseInt(headers.get('X-RateLimit-Limit')),
      remaining: parseInt(headers.get('X-RateLimit-Remaining')),
      reset: parseInt(headers.get('X-RateLimit-Reset')),
      used: parseInt(headers.get('X-RateLimit-Used'))
    };
    
    // Warn if approaching limit
    const percentUsed = (this.usage.used / this.usage.limit) * 100;
    if (percentUsed > 80) {
      console.warn(\`Warning: \${percentUsed.toFixed(1)}% of rate limit used\`);
    }
  }
  
  getStatus() {
    return this.usage;
  }
  
  shouldThrottle() {
    return this.usage.remaining < 10;
  }
}

const monitor = new RateLimitMonitor();

async function monitoredRequest(url, options = {}) {
  const response = await fetch(url, options);
  monitor.updateFromHeaders(response.headers);
  
  if (monitor.shouldThrottle()) {
    console.warn('Approaching rate limit - throttling requests');
    await sleep(1000); // Wait 1 second
  }
  
  return response.json();
}
\`\`\`

### 5. Implement Request Queuing

Queue requests to stay within rate limits:

\`\`\`javascript
class RequestQueue {
  constructor(maxPerSecond = 10) {
    this.queue = [];
    this.processing = false;
    this.maxPerSecond = maxPerSecond;
    this.interval = 1000 / maxPerSecond;
  }
  
  async add(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({ url, options, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const { url, options, resolve, reject } = this.queue.shift();
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
    
    setTimeout(() => {
      this.processing = false;
      this.process();
    }, this.interval);
  }
}

// Usage
const queue = new RequestQueue(10); // Max 10 requests per second

// Add requests to queue
const promises = userIds.map(id => 
  queue.add(\`/api/users/\${id}\`)
);

const results = await Promise.all(promises);
\`\`\`

## Optimizing Your Integration

### Use Webhooks Instead of Polling

Instead of repeatedly checking for updates, use webhooks to receive real-time notifications:

**Bad - Polling (wastes rate limit):**
\`\`\`javascript
// Checks every 10 seconds = 360 requests/hour
setInterval(async () => {
  const updates = await fetch('/api/updates');
}, 10000);
\`\`\`

**Good - Webhooks (zero rate limit impact):**
\`\`\`javascript
// Register webhook once
await fetch('/api/webhooks', {
  method: 'POST',
  body: JSON.stringify({
    url: 'https://yourapp.com/webhooks',
    events: ['update.created']
  })
});

// Receive real-time notifications at your endpoint
app.post('/webhooks', (req, res) => {
  const update = req.body;
  processUpdate(update);
  res.sendStatus(200);
});
\`\`\`

### Request Only What You Need

Use field selection to reduce payload size and processing time:

\`\`\`javascript
// Request only needed fields
const user = await fetch('/api/users/123?fields=id,name,email');

// Instead of fetching everything
const user = await fetch('/api/users/123'); // Returns 50+ fields
\`\`\`

## Handling Common Scenarios

### Scenario 1: Background Processing

For background jobs that process many items:

\`\`\`javascript
async function processBatch(items, batchSize = 10) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process batch
    await Promise.all(
      batch.map(item => processItem(item))
    );
    
    // Wait between batches to avoid rate limits
    if (i + batchSize < items.length) {
      await sleep(1000);
    }
  }
}
\`\`\`

### Scenario 2: User-Triggered Actions

For immediate user requests, prioritize them:

\`\`\`javascript
class PriorityQueue {
  constructor() {
    this.high = [];
    this.normal = [];
  }
  
  add(request, priority = 'normal') {
    if (priority === 'high') {
      this.high.push(request);
    } else {
      this.normal.push(request);
    }
  }
  
  next() {
    return this.high.shift() || this.normal.shift();
  }
}
\`\`\`

## Upgrading Your Plan

If you consistently hit rate limits, consider upgrading:

1. Check your usage in the [Dashboard](https://app.example.com/usage)
2. Review our [Pricing Plans](https://example.com/pricing)
3. [Contact Sales](mailto:sales@example.com) for custom Enterprise plans

## FAQs

**Q: Do rate limits reset at midnight?**
A: No, rate limits use a sliding window that resets based on when your first request was made in the current period.

**Q: Are rate limits per API key or per account?**
A: Rate limits are per API key. You can create multiple API keys for different applications.

**Q: What happens to queued requests when I hit the limit?**
A: Requests are rejected with a 429 status. You must implement retry logic in your application.

**Q: Can I get a temporary rate limit increase?**
A: Yes, contact support for special events or migrations. We can provide temporary increases on a case-by-case basis.

## Additional Resources

- [API Documentation](https://api-docs.example.com)
- [Webhook Guide](https://docs.example.com/webhooks)
- [Performance Best Practices](https://docs.example.com/performance)
- [Status Page](https://status.example.com)

## Support

Having issues with rate limits?
- 📧 Email: [support@example.com](mailto:support@example.com)
- 💬 Live Chat: Available on your dashboard
- 📚 [Knowledge Base](https://help.example.com)
- 🐛 [Report a Bug](https://github.com/example/api/issues)

---

*Last updated: November 15, 2024 • Version 2.1*`;

const ARTICLE_CONTENT_3 = `# Dashboard Customization

## Overview

Transform your dashboard into a personalized command center that matches your unique workflow. Our fully customizable dashboard helps you focus on what matters most and increases your productivity.

> **Time Saver:** A well-configured dashboard can reduce the time spent navigating between screens by up to 60%.

### What You Can Customize

- Widget placement and sizing
- Color themes and layouts
- Visible data and metrics
- Shortcuts and quick actions
- Default views and filters

## Available Widgets

Choose from our comprehensive widget library to build your perfect dashboard:

### Analytics & Metrics

#### Analytics Widget
Track key performance metrics in real-time:
- **Active Users** - Current online users
- **Request Volume** - API requests per hour
- **Response Times** - Average API latency
- **Error Rates** - Failed requests percentage
- **Conversion Metrics** - User engagement stats

**Best For:** Admins, Support Managers, DevOps

#### Performance Dashboard
Monitor system health and performance:
- CPU and memory usage
- Database query performance  
- Cache hit rates
- Background job status

**Best For:** System Administrators, Technical Teams

### Activity & Collaboration

#### Recent Activity Feed
Stay updated with the latest changes from your team:
- 📄 New articles published
- ⏳ Pending approvals
- ✏️ Recent edits and updates
- 👥 User activity and logins
- 💬 Comments and feedback
- 🔔 System notifications

**Filtering Options:**
- Filter by user, team, or department
- Filter by activity type
- Filter by date range
- Search within activities

**Best For:** All Users, Team Leads

#### Team Collaboration
See what your team is working on:
- Active editors
- Assigned tasks
- Upcoming deadlines
- Team announcements

**Best For:** Managers, Team Members

### Productivity Tools

#### Quick Actions Panel
Access frequently used features with one click:
- ➕ Create new article
- 📝 Submit article request  
- 🔍 Search knowledge base
- 📊 View analytics
- ⚙️ Access settings
- 📥 Export reports

**Customization:**
- Add up to 12 quick actions
- Reorder based on priority
- Group by category
- Pin favorites

**Best For:** Power Users, Content Creators

#### My Tasks Widget
Manage your work in one place:
- Articles to review
- Pending approvals
- Assigned requests
- Draft articles
- Due dates and reminders

**Best For:** Support Staff, Admins

### Content Management

#### Article Stats
Monitor your content performance:
- Most viewed articles
- Top search queries
- Article ratings
- Feedback summary
- Version history

**Best For:** Content Managers, Admins

#### Pending Approvals
Quick access to items awaiting review:
- New article submissions
- Article update requests  
- User access requests
- Approval queue count

**Best For:** Approvers, Managers

### Search & Discovery

#### Search Bar Widget
Enhanced search capabilities:
- Instant search results
- Recent searches
- Saved search filters
- AI-powered suggestions

**Best For:** All Users

#### Popular Articles
Discover trending content:
- Most viewed this week
- Highest rated
- Recently updated
- Recommended for you

**Best For:** End Users, Support Teams

## Customization Guide

### Step 1: Enter Edit Mode

1. Navigate to your dashboard
2. Click the **"Customize Dashboard"** button in the top right corner
3. Your dashboard enters edit mode with visual indicators:
   - Drag handles appear on each widget
   - Grid lines become visible
   - Widget menu opens on the right

> **Tip:** Use keyboard shortcut \`Ctrl + K\` (or \`Cmd + K\` on Mac) to quickly toggle edit mode.

### Step 2: Add Widgets

1. Click **"Add Widget"** button
2. Browse available widgets by category:
   - Analytics & Metrics
   - Activity & Collaboration
   - Productivity Tools
   - Content Management
   - Search & Discovery
3. Click on a widget to add it to your dashboard
4. Widget appears in the first available space

**Widget Categories:**

| Category | Widgets Available | Common Use |
|----------|-------------------|------------|
| Analytics | 8 widgets | Performance monitoring |
| Activity | 5 widgets | Team collaboration |
| Productivity | 6 widgets | Daily tasks |
| Content | 7 widgets | Content management |
| Search | 3 widgets | Information discovery |

### Step 3: Arrange and Resize Widgets

#### Rearranging Widgets
1. **Hover** over a widget header to reveal the drag handle
2. **Click and hold** the drag handle
3. **Drag** the widget to your desired position
4. Widgets automatically snap to a 12-column grid layout
5. Other widgets shift to accommodate the move

#### Resizing Widgets
1. **Hover** over widget edges or corners
2. **Click and drag** the resize handles
3. Widgets snap to grid boundaries
4. Minimum size constraints prevent widgets from becoming too small

**Available Sizes:**
- **Small:** 1x1 grid cells (perfect for quick stats)
- **Medium:** 2x2 grid cells (balanced view)
- **Large:** 3x2 grid cells (detailed information)
- **Wide:** 4x2 grid cells (full-width displays)
- **Extra Large:** 4x4 grid cells (dashboards and charts)

### Step 4: Configure Widget Settings

Each widget has customizable settings:

1. Click the **gear icon** ⚙️ on any widget
2. Configure widget-specific options:
   - **Display Settings:** Choose what data to show
   - **Refresh Rate:** How often to update (real-time to hourly)
   - **Filters:** Apply default filters
   - **Appearance:** Colors, chart types, density
3. Click **"Apply"** to save changes

**Example: Analytics Widget Settings**
\`\`\`json
{
  "metrics": ["activeUsers", "requestVolume", "errorRate"],
  "refreshInterval": 30,
  "timeRange": "24h",
  "chartType": "line",
  "showLegend": true,
  "colorScheme": "blue"
}
\`\`\`

### Step 5: Save Your Layout

1. Review your customized dashboard
2. Click **"Save Layout"** in the top right
3. Optionally name your layout:
   - "Default View"
   - "Morning Routine"
   - "Weekly Review"
   - "Support Dashboard"
4. Click **"Confirm"** to save

Your customizations are:
- ✅ Automatically saved to your profile
- ✅ Synced across all your devices
- ✅ Backed up in the cloud
- ✅ Exportable and shareable

> **Pro Tip:** Create multiple dashboard layouts for different tasks (e.g., "Morning Review", "Weekly Planning") and switch between them easily.

## Advanced Features

### Dashboard Themes

Choose from predefined themes or create your own:

#### Pre-built Themes
- **Light Mode** - Clean, minimal design
- **Dark Mode** - Reduced eye strain
- **High Contrast** - Improved accessibility
- **Compact** - More widgets in less space
- **Comfortable** - Generous spacing

#### Custom Themes
\`\`\`javascript
// Create custom theme
const customTheme = {
  name: "Ocean Breeze",
  colors: {
    primary: "#0891b2",
    secondary: "#06b6d4",
    background: "#ecfeff",
    text: "#164e63"
  },
  spacing: "comfortable",
  borderRadius: 8,
  shadows: true
};
\`\`\`

### Multiple Dashboard Layouts

Create and save multiple layouts for different purposes:

1. Click **"Layouts"** dropdown
2. Select **"Create New Layout"**
3. Name your layout (e.g., "Content Review", "Analytics Deep Dive")
4. Build your specialized dashboard
5. Save and switch between layouts anytime

**Example Use Cases:**

| Layout Name | Purpose | Widgets Included |
|-------------|---------|------------------|
| Morning Review | Daily standup | Activity Feed, Tasks, Quick Stats |
| Content Planning | Article management | Pending Approvals, Article Stats, Calendar |
| Performance Monitoring | System health | Analytics, Performance, Error Logs |
| Support Dashboard | Customer support | Recent Tickets, Popular Articles, Search |

### Keyboard Shortcuts

Speed up your workflow with keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| \`Ctrl/Cmd + K\` | Toggle edit mode |
| \`Ctrl/Cmd + S\` | Save layout |
| \`Ctrl/Cmd + Z\` | Undo last change |
| \`Ctrl/Cmd + Shift + A\` | Add widget |
| \`Ctrl/Cmd + Shift + R\` | Reset to default |
| \`Ctrl/Cmd + 1-9\` | Switch between saved layouts |
| \`Esc\` | Exit edit mode |

### Widget Templates

Use pre-configured widget templates for common scenarios:

#### Manager Dashboard Template
- Team Activity Feed
- Approval Queue
- Performance Metrics
- Task Assignment Widget

#### Content Creator Template
- Article Editor Shortcuts
- Draft Articles List
- Publishing Calendar
- Content Analytics

#### Support Dashboard Template
- Recent Tickets
- Popular Articles
- Search Analytics
- Customer Feedback

**To apply a template:**
1. Click **"Templates"** in the dashboard menu
2. Browse available templates
3. Click **"Apply Template"**
4. Customize as needed

## Sharing Dashboard Layouts

Share your optimized dashboard layouts with your team:

### Export Layout

\`\`\`javascript
// Export dashboard configuration
const dashboardConfig = {
  version: "2.0",
  widgets: [
    {
      id: "analytics-1",
      type: "analytics",
      position: { x: 0, y: 0, w: 4, h: 2 },
      settings: { /* ... */ }
    },
    // ... more widgets
  ],
  theme: "light",
  refreshInterval: 30
};

// Download as JSON
downloadJSON(dashboardConfig, 'my-dashboard.json');
\`\`\`

### Import Layout

1. Click **"Import Layout"**
2. Upload your JSON file
3. Preview the layout
4. Click **"Apply"** to use it

### Team Templates

Admins can create organization-wide templates:

1. Navigate to **Admin > Dashboard Templates**
2. Click **"Create Team Template"**
3. Configure the template
4. Assign to user roles:
   - **Admins** get full analytics dashboard
   - **Support** get customer-focused dashboard
   - **Users** get simplified dashboard
5. New users automatically get the role-appropriate template

## Mobile Optimization

Your dashboard automatically adapts to mobile devices:

### Mobile Features
- **Responsive Layout:** Widgets stack vertically on small screens
- **Touch Gestures:** Swipe to rearrange, pinch to resize
- **Simplified Views:** Compact widget versions for mobile
- **Offline Mode:** View cached data without connection

### Mobile Best Practices
- Use 1-2 column layouts for mobile
- Prioritize essential widgets at the top
- Enable "Mobile Optimized" mode in settings
- Test your layout on different screen sizes

## Accessibility Features

Our dashboard supports various accessibility needs:

- **Screen Reader Support:** ARIA labels and semantic HTML
- **Keyboard Navigation:** Full keyboard control
- **High Contrast Mode:** Better visibility
- **Text Scaling:** Respects browser font size settings
- **Reduced Motion:** Option to disable animations

Enable accessibility features in **Settings > Accessibility**

## Troubleshooting

### Widgets Not Loading

**Problem:** Widgets show loading spinners indefinitely

**Solutions:**
1. Check your internet connection
2. Refresh the page (F5 or Ctrl+R)
3. Clear browser cache
4. Disable browser extensions temporarily
5. Check [Status Page](https://status.example.com) for outages

### Layout Not Saving

**Problem:** Changes disappear after refresh

**Solutions:**
1. Ensure you clicked "Save Layout"
2. Check browser localStorage is enabled
3. Verify you have proper permissions
4. Try a different browser
5. Contact support if issue persists

### Performance Issues

**Problem:** Dashboard feels slow or laggy

**Solutions:**
1. Reduce number of widgets (recommended: < 12)
2. Increase refresh intervals for data-heavy widgets
3. Disable auto-refresh for unused widgets
4. Clear browser cache
5. Use a modern browser (Chrome, Firefox, Edge)

## Best Practices

### For Content Managers
- **Quick Actions** + **Article Stats** + **Pending Approvals**
- Set refresh rate to 5 minutes for balanced performance
- Pin frequently accessed articles

### For Support Staff
- **Recent Activity** + **Popular Articles** + **Search Widget**
- Enable real-time updates for activity feed
- Save common search filters

### For Administrators
- **Analytics** + **Performance** + **Team Activity** + **Approval Queue**
- Create separate layouts for daily vs weekly review
- Export layouts regularly as backup

### For End Users
- **Search Bar** + **Quick Actions** + **Popular Articles**
- Keep layout simple with 3-5 widgets
- Focus on content discovery

## Additional Resources

- [Video Tutorial: Dashboard Customization](https://learn.example.com/dashboard-customization)
- [Widget Configuration Guide](https://docs.example.com/widgets)
- [Dashboard API Documentation](https://api-docs.example.com/dashboard)
- [Community Layouts](https://community.example.com/dashboard-layouts)

## Need Help?

- 📧 Email: [support@example.com](mailto:support@example.com)
- 💬 Live Chat: Click the chat icon in bottom right
- 📚 [Help Center](https://help.example.com)
- 🎥 [Video Tutorials](https://learn.example.com)

---

*Last updated: March 5, 2024 • Version 1.0*`;

const ARTICLE_CONTENT_4 = `# Advanced Security Features

## Overview

Protect your account and data with our comprehensive security features. This guide covers advanced security options including two-factor authentication, IP whitelisting, session management, and audit logging.

> **Security First:** Implementing these security features can reduce unauthorized access attempts by up to 99.9%.

### Security Features Covered

- **Two-Factor Authentication (2FA)** - Add an extra layer of account security
- **IP Whitelisting** - Restrict access to trusted networks
- **Session Management** - Monitor and control active sessions
- **Audit Logs** - Track all security-related events
- **API Key Rotation** - Regularly update API credentials
- **Role-Based Access Control (RBAC)** - Fine-grained permissions

## Two-Factor Authentication (2FA)

Two-factor authentication adds an additional layer of security beyond just your password. Even if someone obtains your password, they cannot access your account without the second factor.

### Supported 2FA Methods

| Method | Security Level | Convenience | Best For |
|--------|---------------|-------------|----------|
| Authenticator App | ⭐⭐⭐⭐⭐ High | ⭐⭐⭐⭐ Good | Most users |
| SMS Code | ⭐⭐⭐ Medium | ⭐⭐⭐⭐⭐ Excellent | Quick setup |
| Hardware Key | ⭐⭐⭐⭐⭐ Highest | ⭐⭐⭐ Fair | Enterprise users |
| Backup Codes | ⭐⭐⭐⭐ High | ⭐⭐ Poor | Emergency access |

### Setup Instructions - Authenticator App (Recommended)

#### Step 1: Access Security Settings
1. Log in to your account
2. Navigate to **Settings > Security**
3. Locate the **Two-Factor Authentication** section
4. Click **"Enable 2FA"**

#### Step 2: Choose Authenticator App
1. Select **"Authenticator App"** from the options
2. Download a recommended app if you don't have one:
   - **Google Authenticator** (iOS/Android)
   - **Microsoft Authenticator** (iOS/Android)
   - **Authy** (iOS/Android/Desktop)
   - **1Password** (Cross-platform, requires subscription)

#### Step 3: Scan QR Code
1. A QR code will appear on screen
2. Open your authenticator app
3. Tap the **"+"** or **"Add"** button
4. Scan the QR code with your phone's camera

> **Cannot scan?** Click "Enter code manually" and type the setup key into your authenticator app.

#### Step 4: Enter Verification Code
1. Your authenticator app will generate a 6-digit code
2. Enter this code in the verification field
3. Click **"Verify and Enable"**

#### Step 5: Save Backup Codes
1. You'll receive 10 backup codes
2. **Store these securely** - they're your emergency access method
3. Download them as a text file or print them
4. Keep them in a secure location (password manager, safe)

**Example backup codes:**
\`\`\`
1a2b-3c4d-5e6f
7g8h-9i0j-1k2l
3m4n-5o6p-7q8r
9s0t-1u2v-3w4x
5y6z-7a8b-9c0d
1e2f-3g4h-5i6j
7k8l-9m0n-1o2p
3q4r-5s6t-7u8v
9w0x-1y2z-3a4b
5c6d-7e8f-9g0h
\`\`\`

### Setup Instructions - Hardware Key

For maximum security, use a physical hardware key:

#### Supported Hardware Keys
- **YubiKey 5 Series** (USB-A, USB-C, NFC)
- **Google Titan Security Key**
- **Feitian ePass FIDO**
- Any FIDO2/WebAuthn compatible key

#### Setup Process
1. Navigate to **Settings > Security > Two-Factor Authentication**
2. Click **"Add Hardware Key"**
3. Insert your hardware key into a USB port
4. Follow browser prompts to register the key
5. Touch the key's button when prompted
6. Name your key (e.g., "Office YubiKey", "Personal Key")
7. Optionally register a backup key

> **Best Practice:** Register at least two hardware keys - one for daily use and one as a backup stored securely.

### Managing 2FA

#### View Active 2FA Methods
\`\`\`bash
# Navigate to Settings > Security
You'll see all configured 2FA methods:
- ✅ Authenticator App (Primary)
- ✅ Hardware Key (YubiKey - Backup)
- ⚠️  Backup Codes (8 remaining)
\`\`\`

#### Remove a 2FA Method
1. Click the **"..."** menu next to the method
2. Select **"Remove"**
3. Enter your password to confirm
4. The method will be disabled

> **Warning:** Don't remove all 2FA methods at once. Always keep at least one active method plus backup codes.

#### Regenerate Backup Codes
1. Go to **Settings > Security**
2. Find **Backup Codes** section
3. Click **"Regenerate Codes"**
4. **Old codes become invalid immediately**
5. Save your new codes securely

## IP Whitelisting

Restrict account access to trusted IP addresses or networks. Any access attempt from non-whitelisted IPs will be blocked.

### When to Use IP Whitelisting

✅ **Recommended For:**
- Internal company tools
- Admin accounts
- API access from servers
- Compliance requirements (HIPAA, SOC 2)

❌ **Not Recommended For:**
- Mobile users
- Remote workers (without VPN)
- Public-facing applications
- Users with dynamic IPs

### Configuration

#### Add IP Addresses

1. Navigate to **Settings > Security > IP Whitelisting**
2. Click **"Add IP Address"**
3. Enter the IP address or CIDR range:
   - **Single IP:** \`203.0.113.42\`
   - **IP Range:** \`203.0.113.0/24\` (allows 203.0.113.0 - 203.0.113.255)
4. Add a description (e.g., "Office Network", "AWS Lambda")
5. Click **"Add"**

#### Example Whitelist Configuration

| IP Address/Range | Description | Type |
|------------------|-------------|------|
| \`203.0.113.42\` | Office Static IP | Single |
| \`198.51.100.0/24\` | Corporate Network | Range |
| \`52.54.0.0/16\` | AWS Virginia Region | Range |
| \`35.192.0.0/14\` | Google Cloud | Range |

### Advanced Configuration

**Whitelist API Access Only:**
\`\`\`json
{
  "whitelist_mode": "api_only",
  "allowed_ips": [
    "203.0.113.42",
    "198.51.100.0/24"
  ],
  "web_login_unrestricted": true
}
\`\`\`

**Emergency Access:**
Enable temporary access bypass for account recovery:
1. Click **"Emergency Access Settings"**
2. Set bypass duration (1-24 hours)
3. Require 2FA for emergency access
4. Save configuration

> **Pro Tip:** Use a VPN with a static IP for remote workers, then whitelist the VPN server's IP.

### Testing Your Whitelist

Before fully enabling:

1. Click **"Test Mode"** (logs access attempts without blocking)
2. Monitor the **Access Attempts Log** for 24-48 hours
3. Verify all legitimate access is from whitelisted IPs
4. Click **"Enable Enforcement"** to start blocking non-whitelisted IPs

## Session Management

Monitor and control all active login sessions across devices and locations.

### View Active Sessions

Navigate to **Settings > Security > Active Sessions** to see:

| Device | Location | IP Address | Last Active | Actions |
|--------|----------|------------|-------------|---------|
| Chrome on MacOS | San Francisco, CA | 203.0.113.42 | 2 minutes ago | Current |
| Firefox on Windows | New York, NY | 198.51.100.5 | 1 hour ago | Revoke |
| Mobile App - iOS | Los Angeles, CA | 192.0.2.16 | 2 days ago | Revoke |

### Session Information

Each session shows:
- **Device & Browser:** Operating system and application
- **Location:** City and country (based on IP)
- **IP Address:** Network identifier
- **Last Active:** Most recent activity timestamp
- **First Seen:** When session was created

### Revoke Sessions

#### Revoke a Single Session
1. Locate the suspicious session in the list
2. Click **"Revoke"** button
3. Confirm the action
4. User will be logged out immediately from that device

#### Revoke All Sessions
1. Click **"Revoke All Other Sessions"**
2. Enter your password to confirm
3. All sessions except your current one will be terminated

**Use cases:**
- Compromised credentials
- Lost or stolen device
- Employee offboarding
- Suspicious activity detected

### Session Timeout Configuration

Configure automatic session expiration:

#### Web Sessions
1. Go to **Settings > Security > Session Timeout**
2. Choose timeout duration:
   - **15 minutes** (High security)
   - **1 hour** (Balanced - recommended)
   - **8 hours** (Low security)
   - **30 days** (Remember me)
3. Enable **"Require re-authentication for sensitive actions"**

#### API Sessions
\`\`\`json
{
  "access_token_lifetime": 3600,     // 1 hour
  "refresh_token_lifetime": 2592000, // 30 days
  "refresh_token_rotation": true,    // Rotate on use
  "max_refresh_lifetime": 7776000    // 90 days absolute
}
\`\`\`

### Concurrent Session Limits

Limit the number of simultaneous sessions:

1. Navigate to **Settings > Security > Concurrent Sessions**
2. Set maximum concurrent sessions (1-10)
3. Choose behavior when limit is reached:
   - **Block new sessions** (most secure)
   - **Revoke oldest session** (more convenient)
4. Apply limits per device type or globally

## Audit Logs

Comprehensive logging of all security-related events for compliance and investigation.

### Logged Events

#### Authentication Events
- ✅ Successful login
- ❌ Failed login attempts
- 🔑 Password changes
- 🔓 Password resets
- 📱 2FA enabled/disabled
- 🔐 Account lockouts

#### Access Control Events
- 👤 User role changes
- 🎯 Permission modifications
- 🔑 API key created/revoked
- 🌐 IP whitelist changes
- 📋 Data access and exports

#### Administrative Events
- ⚙️ Settings changes
- 👥 User creation/deletion
- 🏢 Team membership changes
- 📊 Report generation
- 🗑️ Data deletion

### Accessing Audit Logs

1. Navigate to **Settings > Security > Audit Logs**
2. Use filters to find specific events:
   - **Date Range:** Last 24 hours to 90 days
   - **Event Type:** Authentication, Access, Admin
   - **User:** Specific user or all users
   - **Status:** Success or Failure
   - **IP Address:** Filter by source IP

### Example Audit Log Entry

\`\`\`json
{
  "id": "evt_1a2b3c4d5e6f",
  "timestamp": "2024-11-20T14:32:15Z",
  "event_type": "authentication.login.success",
  "user_id": 12345,
  "user_email": "admin@company.com",
  "ip_address": "203.0.113.42",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "location": {
    "city": "San Francisco",
    "region": "California",
    "country": "United States"
  },
  "metadata": {
    "2fa_method": "authenticator_app",
    "session_id": "sess_9g8h7i6j5k4l"
  }
}
\`\`\`

### Export Audit Logs

For compliance and analysis:

1. Click **"Export"** in the Audit Logs page
2. Choose date range
3. Select format:
   - **CSV** - For spreadsheets
   - **JSON** - For programmatic analysis
   - **PDF** - For reporting
4. Click **"Generate Export"**
5. Download when ready (email notification sent)

### Audit Log Retention

| Plan | Retention Period | Export Limit |
|------|-----------------|--------------|
| Free | 7 days | Last 1,000 events |
| Professional | 90 days | Last 10,000 events |
| Enterprise | 1 year+ | Unlimited |

### Set Up Audit Alerts

Get notified of critical security events:

1. Go to **Settings > Security > Audit Alerts**
2. Click **"Create Alert Rule"**
3. Configure alert conditions:
   - **Event Types:** Failed logins, permission changes, etc.
   - **Threshold:** E.g., "5 failed logins in 10 minutes"
   - **Recipients:** Email, SMS, Slack, webhook
4. Test the alert
5. Enable the rule

**Example alert rules:**
- Multiple failed login attempts from same IP
- API key created or revoked
- User role changed to admin
- Access from new geographic location
- Session revoked by another user

## API Key Management

### Generate API Keys

1. Navigate to **Settings > API Keys**
2. Click **"Create API Key"**
3. Configure key settings:
   - **Name:** Descriptive identifier
   - **Permissions:** Select scopes (read, write, admin)
   - **Expiration:** Never, 30 days, 90 days, 1 year
   - **IP Restrictions:** Optional IP whitelist
4. Click **"Generate"**
5. **Copy and save the key immediately** (shown only once)

### Rotate API Keys

Regular rotation improves security:

\`\`\`bash
# Recommended rotation schedule
- Development keys: Every 90 days
- Production keys: Every 180 days
- Compromised keys: Immediately
\`\`\`

**Rotation process:**
1. Generate a new API key
2. Update your applications to use the new key
3. Test thoroughly
4. Revoke the old key
5. Update documentation

### Monitor API Key Usage

Track usage patterns:
- Request volume per key
- Endpoints accessed
- Error rates
- Geographic distribution
- Last used timestamp

## Best Practices Summary

### For All Users
- ✅ Enable 2FA with authenticator app
- ✅ Use strong, unique passwords
- ✅ Review active sessions monthly
- ✅ Keep backup codes secure
- ✅ Report suspicious activity immediately

### For Administrators
- ✅ Implement IP whitelisting for admin accounts
- ✅ Monitor audit logs weekly
- ✅ Set up security alerts
- ✅ Enforce session timeouts
- ✅ Regularly review user permissions
- ✅ Rotate API keys quarterly

### For Developers
- ✅ Use API keys with minimal required permissions
- ✅ Rotate API keys regularly
- ✅ Never commit credentials to version control
- ✅ Use environment variables for secrets
- ✅ Implement proper error handling for auth failures

## Compliance & Certifications

Our security features help you meet compliance requirements:

- **SOC 2 Type II** - Annual audit
- **GDPR** - Data protection compliance
- **HIPAA** - Healthcare data security
- **ISO 27001** - Information security management
- **PCI DSS** - Payment card data security

[View compliance documentation →](https://example.com/compliance)

## Security Incident Response

If you suspect a security breach:

1. **Immediately:**
   - Change your password
   - Revoke all sessions
   - Revoke suspected API keys
   - Enable 2FA if not already active

2. **Contact Security Team:**
   - 🚨 Email: [security@example.com](mailto:security@example.com)
   - 📞 Phone: 1-800-SECURITY (24/7)
   - 🔗 [Security Portal](https://security.example.com/report)

3. **Provide:**
   - Time and date of suspected incident
   - Affected accounts/resources
   - Any suspicious activity observed
   - Relevant audit log entries

## Additional Resources

- [Security Best Practices Guide](https://docs.example.com/security-best-practices)
- [Compliance Documentation](https://example.com/compliance)
- [Security Whitepaper](https://example.com/security-whitepaper.pdf)
- [Penetration Testing Results](https://example.com/pentest-results)
- [Bug Bounty Program](https://hackerone.com/example)

## Need Help?

- 🚨 Security Issues: [security@example.com](mailto:security@example.com)
- 💬 General Support: [support@example.com](mailto:support@example.com)
- 📚 [Help Center](https://help.example.com)
- 🎥 [Security Video Tutorials](https://learn.example.com/security)

---

*Last updated: November 20, 2024 • Version 1.0 • Security Level: Enterprise*`;

const ARTICLE_CONTENT_5 = `# Webhook Integration Guide

## Overview

Webhooks allow your application to receive real-time notifications when events occur in our system. Instead of repeatedly polling our API, webhooks push data to your server instantly when something happens, making your integration more efficient and responsive.

> **Performance Boost:** Webhooks can reduce API calls by up to 99% compared to polling, while providing faster, real-time updates.

### Benefits of Webhooks

- **Real-Time Updates:** Receive notifications instantly
- **Reduced API Calls:** No need for constant polling
- **Lower Latency:** Sub-second notification delivery
- **Cost Effective:** Fewer API requests = lower costs
- **Scalable:** Handle thousands of events efficiently

## Understanding Webhooks

### How Webhooks Work

1. **Event Occurs:** Something happens in our system (e.g., article published)
2. **Webhook Triggered:** Our system detects the event
3. **HTTP POST Sent:** We send event data to your endpoint
4. **You Process:** Your application handles the event
5. **Acknowledge:** You respond with 200 OK

**Webhook Flow Diagram:**
\`\`\`
[Event] → [Our System] → [HTTP POST] → [Your Endpoint] → [Your Action]
                             ↓
                      [Retries if failed]
\`\`\`

### Webhooks vs Polling

| Aspect | Webhooks | Polling |
|--------|----------|---------|
| Latency | Instant (< 1 second) | Delayed (polling interval) |
| API Calls | 1 per event | Continuous (every X seconds) |
| Server Load | Low | High |
| Complexity | Moderate | Simple |
| Real-time | Yes | No |

## Common Use Cases

### Content Management
- **Article Published:** Notify subscribers immediately
- **Article Updated:** Sync changes to external systems
- **Article Deleted:** Clean up references in your app
- **Version Created:** Track content history

### Workflow Automation
- **Request Submitted:** Trigger approval workflow
- **Request Approved:** Auto-create article from template
- **Feedback Received:** Alert content team
- **Tag Applied:** Update categorization systems

### Integration & Sync
- **User Created:** Provision access in external systems
- **Permission Changed:** Update role-based access
- **Team Updated:** Sync organizational structure
- **Settings Modified:** Propagate configuration changes

### Notifications & Alerts
- **Critical Event:** Send alerts to Slack/Teams
- **SLA Breach:** Trigger escalation workflow
- **Error Occurred:** Log to monitoring systems
- **Threshold Reached:** Send email notifications

## Setting Up Webhooks

### Prerequisites

Before creating a webhook endpoint:
- **HTTPS Required:** Your endpoint must use HTTPS (not HTTP)
- **Public URL:** Endpoint must be publicly accessible
- **Fast Response:** Respond within 5 seconds
- **Valid Certificate:** Use a valid SSL/TLS certificate

### Step 1: Create a Webhook Endpoint

Your application needs an endpoint to receive webhook POST requests.

#### Node.js/Express Example

\`\`\`javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

// Webhook endpoint
app.post('/webhooks/knowledge-base', 
  express.json(), 
  async (req, res) => {
    try {
      // 1. Verify webhook signature
      const signature = req.headers['x-webhook-signature'];
      const timestamp = req.headers['x-webhook-timestamp'];
      
      if (!verifyWebhookSignature(req.body, signature, timestamp)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      // 2. Respond quickly (within 5 seconds)
      res.status(200).json({ received: true });
      
      // 3. Process event asynchronously
      const event = req.body;
      processEventAsync(event).catch(console.error);
      
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

function verifyWebhookSignature(payload, signature, timestamp) {
  // Prevent replay attacks (reject old timestamps)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) { // 5 minute tolerance
    return false;
  }
  
  // Verify signature
  const secret = process.env.WEBHOOK_SECRET;
  const signedPayload = \`\${timestamp}.\${JSON.stringify(payload)}\`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

async function processEventAsync(event) {
  console.log(\`Processing event: \${event.type}\`);
  
  switch (event.type) {
    case 'article.published':
      await handleArticlePublished(event.data);
      break;
    case 'article.updated':
      await handleArticleUpdated(event.data);
      break;
    case 'request.created':
      await handleRequestCreated(event.data);
      break;
    default:
      console.log(\`Unknown event type: \${event.type}\`);
  }
}

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
\`\`\`

#### Python/Flask Example

\`\`\`python
from flask import Flask, request, jsonify
import hmac
import hashlib
import time
import os
from threading import Thread

app = Flask(__name__)

@app.route('/webhooks/knowledge-base', methods=['POST'])
def webhook_handler():
    try:
        # 1. Verify signature
        signature = request.headers.get('X-Webhook-Signature')
        timestamp = request.headers.get('X-Webhook-Timestamp')
        
        if not verify_webhook_signature(
            request.get_data(), 
            signature, 
            timestamp
        ):
            return jsonify({'error': 'Invalid signature'}), 401
        
        # 2. Respond quickly
        response = jsonify({'received': True})
        
        # 3. Process asynchronously
        event = request.get_json()
        Thread(target=process_event_async, args=(event,)).start()
        
        return response, 200
        
    except Exception as e:
        app.logger.error(f'Webhook error: {e}')
        return jsonify({'error': 'Internal server error'}), 500

def verify_webhook_signature(payload, signature, timestamp):
    # Prevent replay attacks
    now = int(time.time())
    if abs(now - int(timestamp)) > 300:  # 5 minute tolerance
        return False
    
    # Verify signature
    secret = os.environ['WEBHOOK_SECRET'].encode()
    signed_payload = f"{timestamp}.{payload.decode()}".encode()
    expected_signature = hmac.new(
        secret,
        signed_payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

def process_event_async(event):
    event_type = event['type']
    
    if event_type == 'article.published':
        handle_article_published(event['data'])
    elif event_type == 'article.updated':
        handle_article_updated(event['data'])
    elif event_type == 'request.created':
        handle_request_created(event['data'])
    else:
        app.logger.info(f'Unknown event type: {event_type}')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
\`\`\`

#### Ruby/Sinatra Example

\`\`\`ruby
require 'sinatra'
require 'json'
require 'openssl'

post '/webhooks/knowledge-base' do
  # 1. Verify signature
  signature = request.env['HTTP_X_WEBHOOK_SIGNATURE']
  timestamp = request.env['HTTP_X_WEBHOOK_TIMESTAMP']
  
  request.body.rewind
  payload = request.body.read
  
  halt 401 unless verify_signature(payload, signature, timestamp)
  
  # 2. Respond quickly
  content_type :json
  status 200
  
  # 3. Process asynchronously
  event = JSON.parse(payload)
  Thread.new { process_event(event) }
  
  { received: true }.to_json
end

def verify_signature(payload, signature, timestamp)
  # Prevent replay attacks
  return false if (Time.now.to_i - timestamp.to_i).abs > 300
  
  # Verify signature
  secret = ENV['WEBHOOK_SECRET']
  signed_payload = "#{timestamp}.#{payload}"
  expected = OpenSSL::HMAC.hexdigest('SHA256', secret, signed_payload)
  
  Rack::Utils.secure_compare(signature, expected)
end

def process_event(event)
  case event['type']
  when 'article.published'
    handle_article_published(event['data'])
  when 'article.updated'
    handle_article_updated(event['data'])
  else
    puts "Unknown event: #{event['type']}"
  end
end
\`\`\`

### Step 2: Register Your Webhook

1. Navigate to [Settings > Webhooks](https://app.example.com/settings/webhooks)
2. Click **"Create Webhook"**
3. Fill in the webhook configuration:
   - **Name:** Descriptive name (e.g., "Production Sync")
   - **Endpoint URL:** Your HTTPS endpoint
   - **Events:** Select which events to subscribe to
   - **Active:** Enable/disable webhook
   - **Secret:** Auto-generated (copy securely)
4. Click **"Create"**
5. **Save the signing secret** - you'll need it to verify webhooks

### Step 3: Test Your Webhook

Before going live, test your webhook:

1. Click **"Send Test Event"** in the webhook settings
2. Select an event type to test
3. Check your endpoint received the test payload
4. Verify signature validation works
5. Confirm your processing logic works correctly

**Test Payload Example:**
\`\`\`json
{
  "id": "evt_test_1234567890",
  "type": "article.published",
  "created": 1640995200,
  "livemode": false,
  "data": {
    "object": {
      "id": 123,
      "title": "Test Article",
      "status": "published",
      "published_at": "2024-11-20T10:30:00Z"
    }
  }
}
\`\`\`

## Available Events

Subscribe to events relevant to your use case:

### Article Events

| Event | Description | Payload |
|-------|-------------|---------|
| \`article.created\` | New article created | Article object |
| \`article.updated\` | Article content/metadata updated | Article object with changes |
| \`article.published\` | Article status changed to published | Article object |
| \`article.unpublished\` | Article status changed from published | Article object |
| \`article.deleted\` | Article moved to trash/archived | Article ID |
| \`article.restored\` | Deleted article restored | Article object |

### Article Request Events

| Event | Description | Payload |
|-------|-------------|---------|
| \`request.created\` | New article request submitted | Request object |
| \`request.updated\` | Request details updated | Request object |
| \`request.assigned\` | Request assigned to user | Request object + assignee |
| \`request.approved\` | Request approved | Request object |
| \`request.rejected\` | Request rejected | Request object + reason |
| \`request.completed\` | Request fulfilled with article | Request + article objects |

### Feedback Events

| Event | Description | Payload |
|-------|-------------|---------|
| \`feedback.submitted\` | New feedback on article | Feedback object |
| \`feedback.resolved\` | Feedback marked as resolved | Feedback object |

### User Events

| Event | Description | Payload |
|-------|-------------|---------|
| \`user.created\` | New user account created | User object |
| \`user.updated\` | User profile updated | User object |
| \`user.deactivated\` | User account deactivated | User ID |

### Tag Events

| Event | Description | Payload |
|-------|-------------|---------|
| \`tag.created\` | New tag created | Tag object |
| \`tag.updated\` | Tag renamed or modified | Tag object |
| \`tag.deleted\` | Tag removed | Tag ID |

## Webhook Payload Structure

All webhooks follow this structure:

\`\`\`json
{
  "id": "evt_1a2b3c4d5e6f",
  "type": "article.published",
  "created": 1640995200,
  "livemode": true,
  "data": {
    "object": {
      // Event-specific data
    },
    "previous_attributes": {
      // For update events only
    }
  },
  "metadata": {
    "user_id": 123,
    "user_email": "admin@company.com",
    "ip_address": "203.0.113.42"
  }
}
\`\`\`

### Example: Article Published Event

\`\`\`json
{
  "id": "evt_1a2b3c4d5e6f",
  "type": "article.published",
  "created": 1640995200,
  "livemode": true,
  "data": {
    "object": {
      "id": 123,
      "title": "Getting Started with Authentication",
      "summary": "Complete guide to setting up authentication",
      "content": "# Getting Started...",
      "status": "published",
      "is_internal": false,
      "created_by": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@company.com"
      },
      "tags": [
        { "id": 5, "name": "Authentication", "type": "module" },
        { "id": 9, "name": "v2.0", "type": "version" }
      ],
      "published_at": "2024-11-20T10:30:00Z",
      "version_number": 3
    }
  },
  "metadata": {
    "user_id": 1,
    "user_email": "admin@company.com",
    "ip_address": "203.0.113.42",
    "user_agent": "Mozilla/5.0..."
  }
}
\`\`\`

### Example: Article Updated Event

\`\`\`json
{
  "id": "evt_2b3c4d5e6f7g",
  "type": "article.updated",
  "created": 1640995300,
  "livemode": true,
  "data": {
    "object": {
      "id": 123,
      "title": "Getting Started with Authentication (Updated)",
      "summary": "Comprehensive guide...",
      "updated_at": "2024-11-20T11:00:00Z"
    },
    "previous_attributes": {
      "title": "Getting Started with Authentication",
      "summary": "Complete guide..."
    }
  }
}
\`\`\`

## Security Best Practices

### 1. Always Verify Signatures

**Why:** Prevents unauthorized requests from malicious actors

\`\`\`javascript
// DO: Verify every webhook
if (!verifyWebhookSignature(payload, signature, timestamp)) {
  return res.status(401).send('Unauthorized');
}

// DON'T: Trust webhooks without verification
processEvent(req.body); // ❌ Dangerous!
\`\`\`

### 2. Validate Timestamp

**Why:** Prevents replay attacks

\`\`\`javascript
const TOLERANCE = 300; // 5 minutes

function isTimestampValid(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  return Math.abs(now - timestamp) <= TOLERANCE;
}
\`\`\`

### 3. Use HTTPS Only

**Why:** Protects data in transit

❌ **Bad:** \`http://example.com/webhook\`
✅ **Good:** \`https://example.com/webhook\`

### 4. Implement Idempotency

**Why:** Handle duplicate events safely

\`\`\`javascript
const processedEvents = new Set();

async function processEvent(event) {
  // Check if already processed
  if (processedEvents.has(event.id)) {
    console.log('Event already processed:', event.id);
    return;
  }
  
  // Process event
  await handleEvent(event);
  
  // Mark as processed
  processedEvents.add(event.id);
  
  // Clean up old entries (prevent memory leak)
  if (processedEvents.size > 10000) {
    const firstEntry = processedEvents.values().next().value;
    processedEvents.delete(firstEntry);
  }
}
\`\`\`

### 5. Store Secret Securely

**Why:** Prevent unauthorized webhook creation

\`\`\`javascript
// DO: Use environment variables
const secret = process.env.WEBHOOK_SECRET;

// DON'T: Hardcode secrets
const secret = 'whsec_abc123'; // ❌ Never do this!
\`\`\`

## Performance Best Practices

### 1. Respond Quickly

Acknowledge webhooks within 5 seconds to avoid timeouts and retries.

\`\`\`javascript
// ✅ GOOD: Respond immediately, process later
app.post('/webhook', async (req, res) => {
  // Respond quickly
  res.status(200).send('OK');
  
  // Process asynchronously
  processEventAsync(req.body).catch(console.error);
});

// ❌ BAD: Process before responding
app.post('/webhook', async (req, res) => {
  await longRunningProcess(req.body); // Causes timeouts!
  res.status(200).send('OK');
});
\`\`\`

### 2. Use a Queue for Processing

For high-volume webhooks, use a message queue:

\`\`\`javascript
const { Queue } = require('bull');
const webhookQueue = new Queue('webhooks', {
  redis: { host: 'localhost', port: 6379 }
});

// Producer: Add webhook to queue
app.post('/webhook', async (req, res) => {
  await webhookQueue.add(req.body);
  res.status(200).send('OK');
});

// Consumer: Process webhooks from queue
webhookQueue.process(async (job) => {
  const event = job.data;
  await processEvent(event);
});
\`\`\`

### 3. Handle Retries with Backoff

We retry failed webhooks with exponential backoff:

| Attempt | Delay | Total Time |
|---------|-------|------------|
| 1 | Immediate | 0s |
| 2 | 1 minute | 1m |
| 3 | 5 minutes | 6m |
| 4 | 15 minutes | 21m |
| 5 | 1 hour | 1h 21m |

**Your endpoint should:**
- Return 2xx for success
- Return 5xx for temporary failures (we'll retry)
- Return 4xx for permanent failures (we won't retry)

### 4. Implement Idempotency Keys

Use the event ID to prevent duplicate processing:

\`\`\`javascript
// Database table: processed_webhooks
// Columns: event_id (PRIMARY KEY), processed_at

async function processEvent(event) {
  const eventId = event.id;
  
  // Check if already processed
  const exists = await db.query(
    'SELECT 1 FROM processed_webhooks WHERE event_id = $1',
    [eventId]
  );
  
  if (exists.rows.length > 0) {
    console.log('Event already processed:', eventId);
    return;
  }
  
  // Process event in transaction
  await db.transaction(async (trx) => {
    // Do your processing
    await handleEventLogic(event, trx);
    
    // Mark as processed
    await trx.query(
      'INSERT INTO processed_webhooks (event_id, processed_at) VALUES ($1, NOW())',
      [eventId]
    );
  });
}
\`\`\`

## Monitoring & Debugging

### Webhook Dashboard

Monitor webhook health in your dashboard:

1. Navigate to [Settings > Webhooks](https://app.example.com/settings/webhooks)
2. View metrics for each webhook:
   - **Success Rate:** Percentage of successful deliveries
   - **Average Response Time:** Your endpoint's performance
   - **Recent Deliveries:** Last 100 webhook attempts
   - **Failed Deliveries:** Events that need attention

### Webhook Logs

Each webhook delivery is logged with:
- Event type and ID
- Delivery timestamp
- Response status code
- Response time
- Error message (if failed)
- Retry attempt number

**Example log entry:**
\`\`\`json
{
  "id": "del_1a2b3c4d",
  "webhook_id": "wh_abc123",
  "event_id": "evt_xyz789",
  "event_type": "article.published",
  "url": "https://yourapp.com/webhook",
  "http_status": 200,
  "response_time_ms": 147,
  "timestamp": "2024-11-20T10:30:15Z",
  "success": true
}
\`\`\`

### Manual Retry

If a webhook delivery fails, you can manually retry:

1. Go to **Webhooks > Logs**
2. Find the failed delivery
3. Click **"Retry"**
4. Monitor the new delivery attempt

### Debugging Webhook Issues

**Problem:** Webhooks not being received

**Check:**
1. Endpoint URL is correct and publicly accessible
2. Using HTTPS (not HTTP)
3. Firewall allows incoming requests
4. Webhook is active in settings
5. Events are subscribed to

**Problem:** Signature verification failing

**Check:**
1. Using correct webhook secret
2. Constructing signature correctly
3. Comparing signatures with timing-safe function
4. Timestamp is included in signed payload

**Problem:** Timeouts occurring

**Solutions:**
1. Respond within 5 seconds
2. Process events asynchronously
3. Use a queue for heavy processing
4. Optimize database queries

## Advanced Features

### Webhook Filtering

Filter events by specific criteria:

\`\`\`json
{
  "url": "https://yourapp.com/webhook",
  "events": ["article.published"],
  "filter": {
    "is_internal": false,
    "tags": ["external", "customer-facing"]
  }
}
\`\`\`

### Webhook Headers

Customize headers sent with webhooks:

\`\`\`json
{
  "url": "https://yourapp.com/webhook",
  "headers": {
    "X-Custom-Header": "value",
    "X-API-Key": "your-api-key"
  }
}
\`\`\`

### Webhook Transforms

Transform payload before delivery:

\`\`\`json
{
  "url": "https://yourapp.com/webhook",
  "transform": {
    "include": ["id", "title", "status"],
    "exclude": ["content"]
  }
}
\`\`\`

## Real-World Examples

### Example 1: Slack Notifications

Send Slack notifications when articles are published:

\`\`\`javascript
async function handleArticlePublished(article) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  const message = {
    text: \`📄 New article published: *\${article.title}*\`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: \`*\${article.title}*\\n\${article.summary}\`
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Article" },
            url: \`https://kb.example.com/articles/\${article.id}\`
          }
        ]
      }
    ]
  };
  
  await fetch(slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
}
\`\`\`

### Example 2: Database Sync

Sync article changes to external database:

\`\`\`javascript
async function handleArticleUpdated(article) {
  await externalDb.query(
    \`UPDATE articles 
     SET title = $1, content = $2, updated_at = $3
     WHERE external_id = $4\`,
    [article.title, article.content, article.updated_at, article.id]
  );
  
  console.log(\`Synced article \${article.id} to external database\`);
}
\`\`\`

### Example 3: Email Notifications

Email subscribers when new articles are published:

\`\`\`javascript
async function handleArticlePublished(article) {
  // Get subscribers interested in article tags
  const subscribers = await getSubscribersForTags(article.tags);
  
  // Send emails
  for (const subscriber of subscribers) {
    await sendEmail({
      to: subscriber.email,
      subject: \`New Article: \${article.title}\`,
      template: 'new-article',
      data: {
        articleTitle: article.title,
        articleSummary: article.summary,
        articleUrl: \`https://kb.example.com/articles/\${article.id}\`,
        unsubscribeUrl: \`https://kb.example.com/unsubscribe/\${subscriber.token}\`
      }
    });
  }
}
\`\`\`

## FAQ

**Q: How long do you retry failed webhooks?**
A: We retry for up to 24 hours with exponential backoff. After that, the webhook is marked as failed.

**Q: Can I replay old webhook events?**
A: Yes, navigate to Webhooks > Logs and click "Retry" on any past delivery.

**Q: What's the webhook delivery SLA?**
A: 99.9% delivery success rate, typically delivered within 1-3 seconds of the event.

**Q: Can I have multiple webhooks for the same events?**
A: Yes, you can create multiple webhook endpoints, each subscribed to different or overlapping events.

**Q: Are webhooks sent in order?**
A: We attempt to deliver webhooks in order, but for scalability reasons, we don't guarantee strict ordering. Implement your own ordering based on event timestamps if needed.

**Q: What happens if my endpoint is down?**
A: We'll retry with exponential backoff for 24 hours. Meanwhile, you can view failed deliveries in the dashboard and manually retry them later.

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid signature | Verify signing secret and signature construction |
| 408 Timeout | Slow response | Respond within 5 seconds, process async |
| 500 Internal Error | Bug in your code | Check logs, fix bug, manually retry |
| No webhooks received | Configuration issue | Verify URL, HTTPS, firewall settings |
| Duplicate events | Network retry | Implement idempotency using event ID |

## Additional Resources

- [Webhook API Reference](https://api-docs.example.com/webhooks)
- [Event Types Reference](https://api-docs.example.com/events)
- [Webhook Signature Verification Examples](https://github.com/example/webhook-examples)
- [Status Page](https://status.example.com)

## Need Help?

- 📧 Email: [webhooks@example.com](mailto:webhooks@example.com)
- 💬 Live Chat: Available in dashboard
- 📚 [Developer Forum](https://community.example.com/webhooks)
- 🐛 [Report Issues](https://github.com/example/webhooks/issues)

---

*Last updated: March 16, 2024 • Version 1.0 • Webhook API v2*`;

export const MOCK_ARTICLES: ArticleDto[] = [
  {
    articleId: 1,
    title: 'Getting Started with Authentication',
    summary: 'Complete guide to setting up authentication in our platform',
    content: ARTICLE_CONTENT_1,
    createdBy: 1,
    createdByName: 'Admin User',
    createdByEmail: 'admin@company.com',
    updatedBy: 1,
    updatedByName: 'Admin User',
    approvedBy: 1,
    approvedByName: 'Admin User',
    statusId: 4,
    statusName: 'Published',
    isPublished: true,
    isInternal: false,
    clientId: undefined,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    publishedAt: '2024-01-16T00:00:00Z',
    approvedAt: '2024-01-16T00:00:00Z',
    versionNumber: 3,
    parentArticleId: undefined,
    viewCount: 145,
    tags: [MOCK_TAGS[1], MOCK_TAGS[3], MOCK_TAGS[5], MOCK_TAGS[9]],
  },
  {
    articleId: 2,
    title: 'API Rate Limiting Guide',
    summary: 'Understanding and handling API rate limits effectively',
    content: ARTICLE_CONTENT_2,
    createdBy: 1,
    createdByName: 'Admin User',
    createdByEmail: 'admin@company.com',
    updatedBy: 1,
    updatedByName: 'Admin User',
    approvedBy: 1,
    approvedByName: 'Admin User',
    statusId: 4,
    statusName: 'Published',
    isPublished: true,
    isInternal: false,
    clientId: 1,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
    publishedAt: '2024-02-11T00:00:00Z',
    approvedAt: '2024-02-11T00:00:00Z',
    versionNumber: 2,
    parentArticleId: undefined,
    viewCount: 89,
    tags: [MOCK_TAGS[1], MOCK_TAGS[3], MOCK_TAGS[7], MOCK_TAGS[10]],
  },
  {
    articleId: 3,
    title: 'Dashboard Customization',
    summary: 'Personalize your dashboard to match your workflow',
    content: ARTICLE_CONTENT_3,
    createdBy: 1,
    createdByName: 'Admin User',
    createdByEmail: 'admin@company.com',
    updatedBy: undefined,
    updatedByName: undefined,
    approvedBy: 1,
    approvedByName: 'Admin User',
    statusId: 4,
    statusName: 'Published',
    isPublished: true,
    isInternal: true,
    clientId: undefined,
    createdAt: '2024-03-05T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    publishedAt: '2024-03-06T00:00:00Z',
    approvedAt: '2024-03-06T00:00:00Z',
    versionNumber: 1,
    parentArticleId: undefined,
    viewCount: 234,
    tags: [MOCK_TAGS[0], MOCK_TAGS[2], MOCK_TAGS[5], MOCK_TAGS[11]],
  },
  {
    articleId: 4,
    title: 'Advanced Security Features',
    summary: 'Two-factor authentication, IP whitelisting, and audit logs',
    content: ARTICLE_CONTENT_4,
    createdBy: 2,
    createdByName: 'Support User',
    createdByEmail: 'support@company.com',
    updatedBy: undefined,
    updatedByName: undefined,
    approvedBy: undefined,
    approvedByName: undefined,
    statusId: 3,
    statusName: 'Pending Admin Approval',
    isPublished: false,
    isInternal: true,
    clientId: undefined,
    createdAt: '2024-11-20T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    publishedAt: undefined,
    approvedAt: undefined,
    versionNumber: 1,
    parentArticleId: undefined,
    viewCount: 0,
    tags: [MOCK_TAGS[0], MOCK_TAGS[4], MOCK_TAGS[5], MOCK_TAGS[12]],
  },
  {
    articleId: 5,
    title: 'Webhook Integration Guide',
    summary: 'Real-time notifications and webhook integration patterns',
    content: ARTICLE_CONTENT_5,
    createdBy: 1,
    createdByName: 'Admin User',
    createdByEmail: 'admin@company.com',
    updatedBy: 1,
    updatedByName: 'Admin User',
    approvedBy: 1,
    approvedByName: 'Admin User',
    statusId: 4,
    statusName: 'Published',
    isPublished: true,
    isInternal: false,
    clientId: undefined,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-11-10T00:00:00Z',
    publishedAt: '2024-03-16T00:00:00Z',
    approvedAt: '2024-03-16T00:00:00Z',
    versionNumber: 1,
    parentArticleId: undefined,
    viewCount: 178,
    tags: [MOCK_TAGS[1], MOCK_TAGS[3], MOCK_TAGS[10], MOCK_TAGS[13]],
  },
  {
    articleId: 6,
    title: 'Database Backup Procedures',
    summary: 'Internal documentation for database backup and recovery',
    content: '# Database Backup Procedures\n\nInternal guide for backup procedures...',
    createdBy: 1,
    createdByName: 'Admin User',
    createdByEmail: 'admin@company.com',
    updatedBy: undefined,
    updatedByName: undefined,
    approvedBy: undefined,
    approvedByName: undefined,
    statusId: 1,
    statusName: 'Draft',
    isPublished: false,
    isInternal: true,
    clientId: undefined,
    createdAt: '2024-11-24T00:00:00Z',
    updatedAt: '2024-11-24T00:00:00Z',
    publishedAt: undefined,
    approvedAt: undefined,
    versionNumber: 1,
    parentArticleId: undefined,
    viewCount: 0,
    tags: [MOCK_TAGS[0], MOCK_TAGS[4], MOCK_TAGS[5]],
  },
];

// =====================================================
// ARTICLE REQUESTS
// =====================================================

export const MOCK_ARTICLE_REQUESTS: ArticleRequestDto[] = [
  {
    requestId: 1,
    title: 'How to integrate webhooks?',
    description: 'Need documentation on setting up and managing webhooks for our integration. Should include code examples and best practices.',
    requestedByUserId: 3,
    requestedByName: 'John Doe',
    requestedByEmail: 'user@client1.com',
    assignedToUserId: undefined,
    assignedToName: undefined,
    statusId: 1,
    statusName: 'Pending',
    priority: 2,
    articleId: undefined,
    rejectionReason: undefined,
    createdAt: '2024-11-24T10:30:00Z',
    updatedAt: '2024-11-24T10:30:00Z',
    completedAt: undefined,
  },
  {
    requestId: 2,
    title: 'Database backup procedures',
    description: 'Looking for internal documentation on database backup and recovery procedures for production systems.',
    requestedByUserId: 5,
    requestedByName: 'Internal Staff',
    requestedByEmail: 'internal@company.com',
    assignedToUserId: 2,
    assignedToName: 'Support User',
    statusId: 2,
    statusName: 'Under Review',
    priority: 3,
    articleId: undefined,
    rejectionReason: undefined,
    createdAt: '2024-11-23T09:15:00Z',
    updatedAt: '2024-11-23T14:20:00Z',
    completedAt: undefined,
  },
  {
    requestId: 3,
    title: 'Mobile SDK Documentation',
    description: 'Need comprehensive documentation for the mobile SDK including iOS and Android examples.',
    requestedByUserId: 4,
    requestedByName: 'Jane Smith',
    requestedByEmail: 'user@client2.com',
    assignedToUserId: 2,
    assignedToName: 'Support User',
    statusId: 3,
    statusName: 'Approved',
    priority: 3,
    articleId: undefined,
    rejectionReason: undefined,
    createdAt: '2024-11-21T16:45:00Z',
    updatedAt: '2024-11-22T15:30:00Z',
    completedAt: '2024-11-22T15:30:00Z',
  },
  {
    requestId: 4,
    title: 'GraphQL API Guide',
    description: 'Documentation on using GraphQL instead of REST APIs.',
    requestedByUserId: 3,
    requestedByName: 'John Doe',
    requestedByEmail: 'user@client1.com',
    assignedToUserId: 2,
    assignedToName: 'Support User',
    statusId: 4,
    statusName: 'Rejected',
    priority: 1,
    articleId: undefined,
    rejectionReason: 'GraphQL API is not supported in the current version. Will be available in v3.0.',
    createdAt: '2024-11-19T08:20:00Z',
    updatedAt: '2024-11-20T11:00:00Z',
    completedAt: '2024-11-20T11:00:00Z',
  },
];

// =====================================================
// NOTIFICATIONS
// =====================================================

export const MOCK_NOTIFICATIONS: NotificationDto[] = [
  {
    notificationId: 1,
    userId: 1,
    title: 'New Article Request',
    message: 'John Doe requested an article: "How to integrate webhooks?"',
    type: 'ArticleRequest',
    isRead: false,
    link: '/requests',
    createdAt: '2024-11-24T10:30:00Z',
  },
  {
    notificationId: 2,
    userId: 1,
    title: 'Article Pending Approval',
    message: 'Support User submitted "Advanced Security Features" for approval',
    type: 'ReviewNeeded',
    isRead: false,
    link: '/articles/4',
    createdAt: '2024-11-20T14:20:00Z',
  },
  {
    notificationId: 3,
    userId: 2,
    title: 'Article Request Assignment',
    message: 'You have been assigned to review: "Database backup procedures"',
    type: 'ReviewNeeded',
    isRead: false,
    link: '/requests',
    createdAt: '2024-11-23T09:15:00Z',
  },
  {
    notificationId: 4,
    userId: 3,
    title: 'Request Approved',
    message: 'Your request "Mobile SDK Documentation" has been approved',
    type: 'RequestApproved',
    isRead: true,
    link: '/requests',
    createdAt: '2024-11-22T15:30:00Z',
  },
  {
    notificationId: 5,
    userId: 3,
    title: 'Request Rejected',
    message: 'Your request "GraphQL API Guide" was rejected',
    type: 'RequestRejected',
    isRead: true,
    link: '/requests',
    createdAt: '2024-11-20T11:00:00Z',
  },
];

// =====================================================
// FEEDBACK
// =====================================================

export const MOCK_FEEDBACK: FeedbackDto[] = [
  {
    feedbackId: 1,
    articleId: 1,
    articleTitle: 'Getting Started with Authentication',
    userId: 3,
    userName: 'John Doe',
    rating: 5,
    feedbackText: 'Excellent guide! Very detailed and easy to follow.',
    isResolved: true,
    resolvedBy: 1,
    resolvedByName: 'Admin User',
    resolvedAt: '2024-11-21T10:00:00Z',
    resolutionNotes: 'Positive feedback - no action needed',
    createdAt: '2024-11-20T15:30:00Z',
  },
  {
    feedbackId: 2,
    articleId: 1,
    articleTitle: 'Getting Started with Authentication',
    userId: 4,
    userName: 'Jane Smith',
    rating: 4,
    feedbackText: 'Good article but could use more Python examples.',
    isResolved: false,
    resolvedBy: undefined,
    resolvedByName: undefined,
    resolvedAt: undefined,
    resolutionNotes: undefined,
    createdAt: '2024-11-22T09:15:00Z',
  },
  {
    feedbackId: 3,
    articleId: 2,
    articleTitle: 'API Rate Limiting Guide',
    userId: 3,
    userName: 'John Doe',
    rating: 5,
    feedbackText: 'Very helpful! Saved us a lot of debugging time.',
    isResolved: true,
    resolvedBy: 1,
    resolvedByName: 'Admin User',
    resolvedAt: '2024-11-24T11:30:00Z',
    resolutionNotes: 'Positive feedback',
    createdAt: '2024-11-23T14:20:00Z',
  },
  {
    feedbackId: 4,
    articleId: 3,
    articleTitle: 'Dashboard Customization',
    userId: 5,
    userName: 'Internal Staff',
    rating: 3,
    feedbackText: 'Could use screenshots of the customization interface.',
    isResolved: false,
    resolvedBy: undefined,
    resolvedByName: undefined,
    resolvedAt: undefined,
    resolutionNotes: undefined,
    createdAt: '2024-11-25T08:45:00Z',
  },
];

// =====================================================
// APPROVALS
// =====================================================

export const MOCK_APPROVALS: ApprovalDto[] = [
  {
    approvalId: 1,
    articleId: 4,
    articleTitle: 'Advanced Security Features',
    submittedBy: 2,
    submittedByName: 'Support User',
    submittedByEmail: 'support@company.com',
    currentStage: 'AdminApproval',
    statusId: 1,
    statusName: 'Pending',
    reviewedBy: undefined,
    reviewedByName: undefined,
    approvedBy: undefined,
    approvedByName: undefined,
    submittedAt: '2024-11-20T14:20:00Z',
    reviewedAt: undefined,
    approvedAt: undefined,
    rejectionReason: undefined,
    comments: 'Please review this security documentation for accuracy',
  },
];

// =====================================================
// ATTACHMENTS
// =====================================================

export const MOCK_ATTACHMENTS: AttachmentDto[] = [
  {
    attachmentId: 1,
    articleId: 1,
    fileName: 'authentication-setup-guide.pdf',
    originalFileName: 'authentication-setup-guide.pdf',
    fileSize: 2048000,
    fileType: 'application/pdf',
    filePath: '/uploads/attachments/auth-guide.pdf',
    fileExtension: '.pdf',
    uploadedBy: 1,
    uploadedByName: 'Admin User',
    uploadedAt: '2024-01-15T00:00:00Z',
    isImage: false,
    downloadCount: 45,
    isDeleted: false,
  },
  {
    attachmentId: 2,
    articleId: 1,
    fileName: 'oauth-flow-diagram.png',
    originalFileName: 'oauth-flow-diagram.png',
    fileSize: 512000,
    fileType: 'image/png',
    filePath: '/uploads/attachments/oauth-diagram.png',
    fileExtension: '.png',
    uploadedBy: 1,
    uploadedByName: 'Admin User',
    uploadedAt: '2024-01-15T00:00:00Z',
    isImage: true,
    thumbnailPath: '/uploads/thumbnails/oauth-diagram-thumb.png',
    downloadCount: 32,
    isDeleted: false,
  },
  {
    attachmentId: 3,
    articleId: 2,
    fileName: 'rate-limit-calculator.xlsx',
    originalFileName: 'rate-limit-calculator.xlsx',
    fileSize: 45000,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    filePath: '/uploads/attachments/rate-calculator.xlsx',
    fileExtension: '.xlsx',
    uploadedBy: 1,
    uploadedByName: 'Admin User',
    uploadedAt: '2024-02-10T00:00:00Z',
    isImage: false,
    downloadCount: 18,
    isDeleted: false,
  },
  {
    attachmentId: 4,
    articleId: 3,
    fileName: 'dashboard-templates.zip',
    originalFileName: 'dashboard-templates.zip',
    fileSize: 1250000,
    fileType: 'application/zip',
    filePath: '/uploads/attachments/dashboard-templates.zip',
    fileExtension: '.zip',
    uploadedBy: 1,
    uploadedByName: 'Admin User',
    uploadedAt: '2024-03-05T00:00:00Z',
    isImage: false,
    downloadCount: 67,
    isDeleted: false,
  },
  {
    attachmentId: 5,
    articleId: 5,
    fileName: 'webhook-examples.zip',
    originalFileName: 'webhook-examples.zip',
    fileSize: 850000,
    fileType: 'application/zip',
    filePath: '/uploads/attachments/webhook-examples.zip',
    fileExtension: '.zip',
    uploadedBy: 1,
    uploadedByName: 'Admin User',
    uploadedAt: '2024-03-15T00:00:00Z',
    isImage: false,
    downloadCount: 41,
    isDeleted: false,
  },
  {
    attachmentId: 6,
    articleId: 5,
    fileName: 'postman-collection.json',
    originalFileName: 'postman-collection.json',
    fileSize: 12000,
    fileType: 'application/json',
    filePath: '/uploads/attachments/postman-collection.json',
    fileExtension: '.json',
    uploadedBy: 1,
    uploadedByName: 'Admin User',
    uploadedAt: '2024-03-15T00:00:00Z',
    isImage: false,
    downloadCount: 29,
    isDeleted: false,
  },
];

// =====================================================
// TEMPLATES
// =====================================================

export const MOCK_TEMPLATES: TemplateDto[] = [
  {
    templateId: 1,
    templateName: 'API Documentation',
    description: 'Standard template for API endpoint documentation',
    content: '# [API Endpoint Name]\n\n## Overview\n[Brief description]\n\n## Request\n```\n[Request format]\n```\n\n## Response\n```\n[Response format]\n```\n\n## Examples\n[Code examples]',
    category: 'Technical',
    isActive: true,
    usageCount: 15,
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    templateId: 2,
    templateName: 'How-To Guide',
    description: 'Step-by-step guide template',
    content: '# How to [Task Name]\n\n## Prerequisites\n- [Prerequisite 1]\n- [Prerequisite 2]\n\n## Steps\n\n### Step 1: [Step Title]\n[Step description]\n\n### Step 2: [Step Title]\n[Step description]\n\n## Troubleshooting\n[Common issues]',
    category: 'Tutorial',
    isActive: true,
    usageCount: 28,
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    templateId: 3,
    templateName: 'FAQ Article',
    description: 'Frequently asked questions template',
    content: '# [Topic] - Frequently Asked Questions\n\n## Question 1?\nAnswer to question 1.\n\n## Question 2?\nAnswer to question 2.\n\n## Question 3?\nAnswer to question 3.',
    category: 'Support',
    isActive: true,
    usageCount: 12,
    createdBy: 1,
    createdByName: 'Admin User',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// =====================================================
// MOCK DATA STORE (for simulating state changes)
// =====================================================

export class MockDataStore {
  private articles: ArticleDto[] = [...MOCK_ARTICLES];
  private users: UserDto[] = [...MOCK_USERS];
  private tags: TagDto[] = [...MOCK_TAGS];
  private requests: ArticleRequestDto[] = [...MOCK_ARTICLE_REQUESTS];
  private notifications: NotificationDto[] = [...MOCK_NOTIFICATIONS];
  private feedback: FeedbackDto[] = [...MOCK_FEEDBACK];
  private approvals: ApprovalDto[] = [...MOCK_APPROVALS];
  private attachments: AttachmentDto[] = [...MOCK_ATTACHMENTS];
  private templates: TemplateDto[] = [...MOCK_TEMPLATES];

  // Current logged-in user (default to admin for testing)
  private currentUser: AuthResponse = {
    userId: 1,
    email: 'admin@company.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    roleId: 1,
    roleName: 'Admin',
    teamId: 1,
    teamName: 'Engineering',
    clientId: undefined,
    clientName: undefined,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };

  // Getters
  getArticles = (params?: any) => {
    let filtered = [...this.articles];
    
    // Apply filtering based on params
    if (params?.isInternal !== undefined) {
      filtered = filtered.filter(a => a.isInternal === params.isInternal);
    }
    if (params?.statusId) {
      filtered = filtered.filter(a => a.statusId === params.statusId);
    }
    if (params?.isPublished !== undefined) {
      filtered = filtered.filter(a => a.isPublished === params.isPublished);
    }
    if (params?.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(term) || 
        a.summary?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };
  
  getArticleById = (articleId: number) => {
    return this.articles.find(a => a.articleId === articleId);
  };
  
  createArticle = (data: any) => {
    const newArticle: ArticleDto = {
      articleId: Math.max(...this.articles.map(a => a.articleId), 0) + 1,
      title: data.title,
      summary: data.summary,
      content: data.content,
      createdBy: this.currentUser.userId,
      createdByName: this.currentUser.fullName,
      createdByEmail: this.currentUser.email,
      statusId: data.statusId || 1,
      statusName: 'Draft',
      isPublished: false,
      isInternal: data.isInternal ?? true,
      clientId: data.clientId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versionNumber: 1,
      viewCount: 0,
      tags: [],
    };
    this.articles.push(newArticle);
    return newArticle;
  };
  
  publishArticle = (articleId: number) => {
    const article = this.articles.find(a => a.articleId === articleId);
    if (article) {
      article.isPublished = true;
      article.publishedAt = new Date().toISOString();
      article.statusId = 3; // Published status
      article.statusName = 'Published';
    }
  };
  
  getUsers = () => [...this.users];
  getUserById = (userId: number) => {
    return this.users.find(u => u.userId === userId);
  };
  
  getTags = (tagTypeId?: number) => {
    if (tagTypeId) {
      return this.tags.filter(t => t.tagTypeId === tagTypeId);
    }
    return [...this.tags];
  };
  
  getTagById = (tagId: number) => {
    return this.tags.find(t => t.tagId === tagId);
  };
  
  getTagTypes = () => [...MOCK_TAG_TYPES];
  
  createTag = (data: any) => {
    const newTag: TagDto = {
      tagId: Math.max(...this.tags.map(t => t.tagId), 0) + 1,
      tagTypeId: data.tagTypeId,
      tagTypeName: MOCK_TAG_TYPES.find(tt => tt.tagTypeId === data.tagTypeId)?.tagTypeName || 'Unknown',
      tagName: data.tagName,
      tagValue: data.tagValue,
      description: data.description,
      colorCode: data.colorCode,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tags.push(newTag);
    return newTag;
  };
  
  getRequests = () => [...this.requests];
  
  getNotifications = (params?: any) => {
    let filtered = [...this.notifications];
    
    // Filter by user
    filtered = filtered.filter(n => n.userId === this.currentUser.userId);
    
    // Filter by read status
    if (params?.isRead !== undefined) {
      filtered = filtered.filter(n => n.isRead === params.isRead);
    }
    
    return filtered;
  };
  
  getUnreadNotificationCount = () => {
    return this.notifications.filter(n => 
      n.userId === this.currentUser.userId && !n.isRead
    ).length;
  };
  
  markNotificationAsRead = (notificationId: number) => {
    const notification = this.notifications.find(n => n.notificationId === notificationId);
    if (notification) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
    }
  };
  
  markAllNotificationsAsRead = () => {
    this.notifications.forEach(n => {
      if (n.userId === this.currentUser.userId) {
        n.isRead = true;
        n.readAt = new Date().toISOString();
      }
    });
  };
  
  getFeedback = () => [...this.feedback];
  getApprovals = () => [...this.approvals];
  getAttachments = () => [...this.attachments];
  getTemplates = () => [...this.templates];
  getCurrentUser = () => ({ ...this.currentUser });

  // Setters for state mutations
  setCurrentUser = (user: AuthResponse) => {
    this.currentUser = user;
  };

  addArticle = (article: ArticleDto) => {
    this.articles.push(article);
  };

  updateArticle = (articleId: number, updates: Partial<ArticleDto>) => {
    const index = this.articles.findIndex(a => a.articleId === articleId);
    if (index !== -1) {
      this.articles[index] = { ...this.articles[index], ...updates };
    }
  };

  deleteArticle = (articleId: number) => {
    this.articles = this.articles.filter(a => a.articleId !== articleId);
  };

  addUser = (user: UserDto) => {
    this.users.push(user);
  };

  updateUser = (userId: number, updates: Partial<UserDto>) => {
    const index = this.users.findIndex(u => u.userId === userId);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
    }
  };

  deleteUser = (userId: number) => {
    this.users = this.users.filter(u => u.userId !== userId);
  };

  addTag = (tag: TagDto) => {
    this.tags.push(tag);
  };

  updateTag = (tagId: number, updates: Partial<TagDto>) => {
    const index = this.tags.findIndex(t => t.tagId === tagId);
    if (index !== -1) {
      this.tags[index] = { ...this.tags[index], ...updates };
    }
  };

  deleteTag = (tagId: number) => {
    this.tags = this.tags.filter(t => t.tagId !== tagId);
  };

  addRequest = (request: ArticleRequestDto) => {
    this.requests.push(request);
  };

  updateRequest = (requestId: number, updates: Partial<ArticleRequestDto>) => {
    const index = this.requests.findIndex(r => r.requestId === requestId);
    if (index !== -1) {
      this.requests[index] = { ...this.requests[index], ...updates };
    }
  };

  deleteRequest = (requestId: number) => {
    this.requests = this.requests.filter(r => r.requestId !== requestId);
  };

  addNotification = (notification: NotificationDto) => {
    this.notifications.push(notification);
  };

  updateNotification = (notificationId: number, updates: Partial<NotificationDto>) => {
    const index = this.notifications.findIndex(n => n.notificationId === notificationId);
    if (index !== -1) {
      this.notifications[index] = { ...this.notifications[index], ...updates };
    }
  };

  addFeedback = (feedback: FeedbackDto) => {
    this.feedback.push(feedback);
  };

  updateFeedback = (feedbackId: number, updates: Partial<FeedbackDto>) => {
    const index = this.feedback.findIndex(f => f.feedbackId === feedbackId);
    if (index !== -1) {
      this.feedback[index] = { ...this.feedback[index], ...updates };
    }
  };

  addApproval = (approval: ApprovalDto) => {
    this.approvals.push(approval);
  };

  updateApproval = (approvalId: number, updates: Partial<ApprovalDto>) => {
    const index = this.approvals.findIndex(a => a.approvalId === approvalId);
    if (index !== -1) {
      this.approvals[index] = { ...this.approvals[index], ...updates };
    }
  };

  deleteApproval = (approvalId: number) => {
    this.approvals = this.approvals.filter(a => a.approvalId !== approvalId);
  };

  addAttachment = (attachment: AttachmentDto) => {
    this.attachments.push(attachment);
  };

  deleteAttachment = (attachmentId: number) => {
    this.attachments = this.attachments.filter(a => a.attachmentId !== attachmentId);
  };

  addTemplate = (template: TemplateDto) => {
    this.templates.push(template);
  };

  updateTemplate = (templateId: number, updates: Partial<TemplateDto>) => {
    const index = this.templates.findIndex(t => t.templateId === templateId);
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
    }
  };

  deleteTemplate = (templateId: number) => {
    this.templates = this.templates.filter(t => t.templateId !== templateId);
  };

  // =====================================================
  // FEEDBACK METHODS
  // =====================================================

  getAllFeedback = (params?: any): PagedResultDto<FeedbackDto> => {
    let filtered = [...this.feedback];
    
    if (params?.articleId) {
      filtered = filtered.filter(f => f.articleId === params.articleId);
    }
    if (params?.userId) {
      filtered = filtered.filter(f => f.userId === params.userId);
    }
    if (params?.rating) {
      filtered = filtered.filter(f => f.rating === params.rating);
    }
    if (params?.category) {
      filtered = filtered.filter(f => f.category === params.category);
    }
    if (params?.isResolved !== undefined) {
      filtered = filtered.filter(f => f.isResolved === params.isResolved);
    }
    
    const pageNumber = params?.pageNumber || 1;
    const pageSize = params?.pageSize || 20;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      items: filtered.slice(startIndex, endIndex),
      totalCount: filtered.length,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  };

  getFeedbackById = (feedbackId: number): FeedbackDto => {
    const feedback = this.feedback.find(f => f.feedbackId === feedbackId);
    if (!feedback) {
      throw new Error(`Feedback ${feedbackId} not found`);
    }
    return feedback;
  };

  getArticleFeedback = (articleId: number): FeedbackDto[] => {
    return this.feedback.filter(f => f.articleId === articleId);
  };

  getUserArticleFeedback = (articleId: number): FeedbackDto => {
    const feedback = this.feedback.find(
      f => f.articleId === articleId && f.userId === this.currentUser.userId
    );
    if (!feedback) {
      // Return empty feedback if user hasn't provided feedback yet
      throw new Error('No feedback found');
    }
    return feedback;
  };

  getUserFeedback = (userId: number): FeedbackDto[] => {
    return this.feedback.filter(f => f.userId === userId);
  };

  submitFeedback = (articleId: number, data: any): FeedbackDto => {
    const article = this.articles.find(a => a.articleId === articleId);
    const newFeedback: FeedbackDto = {
      feedbackId: Math.max(...this.feedback.map(f => f.feedbackId), 0) + 1,
      articleId,
      articleTitle: article?.title,
      userId: this.currentUser.userId,
      userName: this.currentUser.fullName,
      rating: data.rating,
      isHelpful: data.isHelpful,
      feedbackText: data.feedbackText,
      category: data.category,
      createdAt: new Date().toISOString(),
      isResolved: false,
    };
    this.feedback.push(newFeedback);
    return newFeedback;
  };

  resolveFeedback = (feedbackId: number, data: any): FeedbackDto => {
    const feedback = this.feedback.find(f => f.feedbackId === feedbackId);
    if (!feedback) {
      throw new Error(`Feedback ${feedbackId} not found`);
    }
    feedback.isResolved = true;
    feedback.resolvedBy = this.currentUser.userId;
    feedback.resolvedByName = this.currentUser.fullName;
    feedback.resolvedAt = new Date().toISOString();
    feedback.resolutionNotes = data.resolutionNotes;
    return feedback;
  };

  unresolveFeedback = (feedbackId: number): FeedbackDto => {
    const feedback = this.feedback.find(f => f.feedbackId === feedbackId);
    if (!feedback) {
      throw new Error(`Feedback ${feedbackId} not found`);
    }
    feedback.isResolved = false;
    feedback.resolvedBy = undefined;
    feedback.resolvedByName = undefined;
    feedback.resolvedAt = undefined;
    feedback.resolutionNotes = undefined;
    return feedback;
  };

  deleteFeedback = (feedbackId: number): void => {
    this.feedback = this.feedback.filter(f => f.feedbackId !== feedbackId);
  };

  getArticleMetrics = (articleId: number): any => {
    const articleFeedback = this.feedback.filter(f => f.articleId === articleId);
    const totalFeedback = articleFeedback.length;
    const averageRating = totalFeedback > 0
      ? articleFeedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;
    const helpfulCount = articleFeedback.filter(f => f.isHelpful === true).length;
    const notHelpfulCount = articleFeedback.filter(f => f.isHelpful === false).length;
    
    const categoryBreakdown: { [key: string]: number } = {};
    articleFeedback.forEach(f => {
      if (f.category) {
        categoryBreakdown[f.category] = (categoryBreakdown[f.category] || 0) + 1;
      }
    });
    
    return {
      articleId,
      totalFeedback,
      averageRating,
      helpfulCount,
      notHelpfulCount,
      categoryBreakdown,
    };
  };

  // =====================================================
  // ATTACHMENT METHODS
  // =====================================================

  getArticleAttachments = (articleId: number, includeDeleted: boolean = false): AttachmentDto[] => {
    let filtered = this.attachments.filter(a => a.articleId === articleId);
    if (!includeDeleted) {
      filtered = filtered.filter(a => !a.isDeleted);
    }
    return filtered;
  };

  // Reset all data to initial state
  reset = () => {
    this.articles = [...MOCK_ARTICLES];
    this.users = [...MOCK_USERS];
    this.tags = [...MOCK_TAGS];
    this.requests = [...MOCK_ARTICLE_REQUESTS];
    this.notifications = [...MOCK_NOTIFICATIONS];
    this.feedback = [...MOCK_FEEDBACK];
    this.approvals = [...MOCK_APPROVALS];
    this.attachments = [...MOCK_ATTACHMENTS];
    this.templates = [...MOCK_TEMPLATES];
  };
}

// Export singleton instance
export const mockDataStore = new MockDataStore();