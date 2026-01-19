/**
 * Duplicate Submission Prevention
 * 
 * Prevents users from submitting the survey more than once.
 * Uses email address as the primary identifier (allows cross-device access).
 * 
 * Options:
 * 1. In-Memory (Simple, no dependencies) - Current implementation
 * 2. Database (Production-ready, persistent)
 */

interface SubmissionRecord {
  submittedAt: number;
  email: string;
  ip?: string;
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
  // How long to remember a submission (default: permanently, but we'll use a very long duration)
  // Since we want to prevent resubmission forever, we use a very long expiration (10 years)
  rememberDuration: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years in milliseconds
  
  // For testing: shorter duration (1 hour)
  // rememberDuration: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Normalize email address (lowercase, trim)
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Check if an email has already submitted the survey
 * 
 * @param email - User email address
 * @returns Object with hasSubmitted status and submission time
 */
export function checkSubmissionByEmail(
  email: string
): { hasSubmitted: boolean; submittedAt?: number } {
  const normalized = normalizeEmail(email);
  const record = submissionStore.get(normalized);
  
  if (!record) {
    return { hasSubmitted: false };
  }
  
  // Check if record has expired
  if (record.expiresAt < Date.now()) {
    submissionStore.delete(normalized);
    return { hasSubmitted: false };
  }
  
  return {
    hasSubmitted: true,
    submittedAt: record.submittedAt,
  };
}

/**
 * Record a submission by email
 * 
 * @param email - User email address
 * @param ip - Optional IP address (for logging)
 */
export function recordSubmissionByEmail(
  email: string,
  ip?: string
): void {
  const normalized = normalizeEmail(email);
  const now = Date.now();
  const expiresAt = now + submissionConfig.rememberDuration;
  
  submissionStore.set(normalized, {
    submittedAt: now,
    email: normalized,
    ip,
    expiresAt,
  });
}

/**
 * Generate a unique identifier for a user (backward compatibility)
 * Combines IP address with optional browser fingerprint
 * @deprecated Use checkSubmissionByEmail instead
 */
export function generateUserIdentifier(ip: string, fingerprint?: string): string {
  if (fingerprint) {
    return `${ip}:${fingerprint}`;
  }
  return ip;
}

/**
 * Check if a user has already submitted (backward compatibility)
 * @deprecated Use checkSubmissionByEmail instead
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
 * Record a submission (backward compatibility)
 * @deprecated Use recordSubmissionByEmail instead
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
    email: '', // Not available in old method
    ip,
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
 * Clear a submission record by email
 * 
 * @param email - Email address to clear
 */
export function clearSubmissionByEmail(email: string): void {
  const normalized = normalizeEmail(email);
  submissionStore.delete(normalized);
}

/**
 * Submission tracker helper
 */
export const submissionTracker = {
  check: checkSubmission,
  record: recordSubmission,
  checkByEmail: checkSubmissionByEmail,
  recordByEmail: recordSubmissionByEmail,
  clear: clearSubmission,
  clearByEmail: clearSubmissionByEmail,
  generateIdentifier: generateUserIdentifier,
  stats: getSubmissionStats,
  config: submissionConfig,
};

