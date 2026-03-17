/**
 * Mock Module Barrel
 *
 * Re-exports all mock utilities from /services/mock/ so that the rest of
 * the codebase can import exclusively from /lib/mock/ — keeping the public
 * API surface consolidated under /lib/.
 *
 * The actual mock data (4 000+ lines) lives in /services/mock/ as an
 * implementation detail.
 */

// Mock mode configuration & helpers
export {
  MOCK_MODE_ENABLED,
  MOCK_API_DELAY,
  mockDelay,
  logMockMode,
} from '../../services/mock/mockMode.config';

// Mock auth initialisation
export { initializeMockAuth } from '../../services/mock/mockAuth.init';

// Seed data constants
export {
  MOCK_USERS,
  MOCK_ROLES,
  MOCK_TEAMS,
  MOCK_CLIENTS,
  MOCK_TAGS,
  MOCK_TAG_TYPES,
  MOCK_ARTICLES,
  MOCK_ARTICLE_REQUESTS,
  MOCK_NOTIFICATIONS,
  MOCK_FEEDBACK,
  MOCK_APPROVALS,
  MOCK_ATTACHMENTS,
  MOCK_TEMPLATES,
  MockDataStore,
  mockDataStore,
} from '../../services/mock/mockData.service';
