/**
 * Performance Utilities
 * 
 * Helper functions for performance optimization:
 * - Cache management
 * - Debouncing
 * - Throttling
 * - Performance monitoring
 */

/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Simple in-memory cache with TTL
 */
class SimpleCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();
  
  set(key: string, value: T, ttlMs: number): void {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, { value, expiresAt });
  }
  
  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.value;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

/**
 * Cache instance for API responses
 */
export const apiCache = new SimpleCache<any>();

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  /**
   * Measure execution time of a function
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    try {
      const result = await fn();
      const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const duration = end - start;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const duration = end - start;
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[Performance] ${name} failed after ${duration.toFixed(2)}ms:`, error);
      }
      throw error;
    }
  },
  
  /**
   * Mark performance timing
   */
  mark(name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name);
    }
  },
  
  /**
   * Measure between two marks
   */
  measureBetween(startMark: string, endMark: string, name: string): void {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measure = window.performance.getEntriesByName(name)[0];
        if (measure && process.env.NODE_ENV !== 'production') {
          console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
        }
      } catch (error) {
        // Ignore measurement errors
      }
    }
  },
};

// Export as default for convenience
export const performance = performanceUtils;

/**
 * Prefetch resources
 */
export function prefetch(url: string, as: 'script' | 'style' | 'image' | 'font' = 'script'): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Preconnect to external domains
 */
export function preconnect(url: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  document.head.appendChild(link);
}

