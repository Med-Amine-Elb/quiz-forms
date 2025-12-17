/**
 * Duplicate Submission Prevention
 * 
 * Prevents users from submitting the survey more than once.
 * Uses IP address + browser fingerprint for identification.
 * 
 * Options:
 * 1. In-Memory (Simple, no dependencies) - Current implementation
 * 2. Database (Production-ready, persistent)
 */

interface SubmissionRecord {
  submittedAt: number;
  ip: string;
  fingerprint?: string;
  expiresAt: number;
}

// In-memory store (for single-instance deployments)
// For production with multiple instances, use database
const submissionStore = new Map<string, SubmissionRecord>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of submissionStore.entries()) {
    if (record.expiresAt < now) {
      submissionStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Configuration for submission tracking
 */
export const submissionConfig = {
  // How long to remember a submission (default: 30 days)
  rememberDuration: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  
  // For testing: shorter duration (1 hour)
  // rememberDuration: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Generate a unique identifier for a user
 * Combines IP address with optional browser fingerprint
 */
export function generateUserIdentifier(ip: string, fingerprint?: string): string {
  if (fingerprint) {
    return `${ip}:${fingerprint}`;
  }
  return ip;
}

/**
 * Check if a user has already submitted
 * 
 * @param identifier - User identifier (IP or IP:fingerprint)
 * @returns Object with hasSubmitted status and submission time
 */
export function checkSubmission(
  identifier: string
): { hasSubmitted: boolean; submittedAt?: number } {
  const record = submissionStore.get(identifier);
  
  if (!record) {
    return { hasSubmitted: false };
  }
  
  // Check if record has expired
  if (record.expiresAt < Date.now()) {
    submissionStore.delete(identifier);
    return { hasSubmitted: false };
  }
  
  return {
    hasSubmitted: true,
    submittedAt: record.submittedAt,
  };
}

/**
 * Record a submission
 * 
 * @param identifier - User identifier
 * @param ip - IP address
 * @param fingerprint - Optional browser fingerprint
 */
export function recordSubmission(
  identifier: string,
  ip: string,
  fingerprint?: string
): void {
  const now = Date.now();
  const expiresAt = now + submissionConfig.rememberDuration;
  
  submissionStore.set(identifier, {
    submittedAt: now,
    ip,
    fingerprint,
    expiresAt,
  });
}

/**
 * Clear a submission record (for testing or admin purposes)
 * 
 * @param identifier - User identifier to clear
 */
export function clearSubmission(identifier: string): void {
  submissionStore.delete(identifier);
}

/**
 * Get submission statistics (for monitoring)
 */
export function getSubmissionStats(): {
  totalSubmissions: number;
  activeRecords: number;
} {
  const now = Date.now();
  let activeRecords = 0;
  
  for (const record of submissionStore.values()) {
    if (record.expiresAt >= now) {
      activeRecords++;
    }
  }
  
  return {
    totalSubmissions: submissionStore.size,
    activeRecords,
  };
}

/**
 * Submission tracker helper
 */
export const submissionTracker = {
  check: checkSubmission,
  record: recordSubmission,
  clear: clearSubmission,
  generateIdentifier: generateUserIdentifier,
  stats: getSubmissionStats,
  config: submissionConfig,
};

