/**
 * Browser Fingerprint Generation
 * 
 * Creates a unique identifier for the browser/device to help prevent duplicate submissions.
 * This is a simple fingerprint based on browser characteristics.
 * 
 * Note: This is not 100% foolproof but provides an additional layer of protection
 * when combined with IP address tracking.
 */

/**
 * Generate a simple browser fingerprint
 * Based on user agent, language, timezone, and screen resolution
 */
export function generateBrowserFingerprint(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const components: string[] = [];

  // User agent
  if (navigator.userAgent) {
    components.push(navigator.userAgent);
  }

  // Language
  if (navigator.language) {
    components.push(navigator.language);
  }

  // Timezone
  if (Intl.DateTimeFormat().resolvedOptions().timeZone) {
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  // Screen resolution
  if (window.screen) {
    components.push(`${window.screen.width}x${window.screen.height}`);
    components.push(`${window.screen.colorDepth}`);
  }

  // Platform
  if (navigator.platform) {
    components.push(navigator.platform);
  }

  // Combine and create a simple hash
  const combined = components.join('|');
  
  // Simple hash function (not cryptographic, just for fingerprinting)
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
}

/**
 * Get or create browser fingerprint from localStorage
 * This persists across page reloads
 */
export function getOrCreateFingerprint(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const STORAGE_KEY = 'survey_browser_fingerprint';
  
  // Try to get existing fingerprint
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return existing;
  }

  // Generate new fingerprint
  const fingerprint = generateBrowserFingerprint();
  localStorage.setItem(STORAGE_KEY, fingerprint);
  
  return fingerprint;
}

