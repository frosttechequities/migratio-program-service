/**
 * Performance utilities for the Visafy platform
 */

/**
 * Debounce function to limit how often a function can be called
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce delay in milliseconds
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} - The debounced function
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in milliseconds
 * @returns {Function} - The throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Lazy load images when they enter the viewport
 * 
 * @param {string} selector - CSS selector for images to lazy load
 */
export const lazyLoadImages = (selector = 'img[data-src]') => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll(selector).forEach(img => {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
      }
    });
  }
};

/**
 * Measure component render time
 * 
 * @param {string} componentName - Name of the component being measured
 * @param {Function} callback - Function to execute after logging
 * @returns {Function} - Function to end timing
 */
export const measureRenderTime = (componentName, callback = () => {}) => {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const time = end - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} rendered in ${time.toFixed(2)}ms`);
    }
    
    callback(time);
    return time;
  };
};

/**
 * Detect slow renders and log them
 * 
 * @param {string} componentName - Name of the component being measured
 * @param {number} threshold - Threshold in milliseconds
 * @returns {Function} - Function to end timing
 */
export const detectSlowRender = (componentName, threshold = 16) => {
  return measureRenderTime(componentName, (time) => {
    if (time > threshold && process.env.NODE_ENV === 'development') {
      console.warn(`[Performance Warning] ${componentName} took ${time.toFixed(2)}ms to render, which is above the threshold of ${threshold}ms`);
    }
  });
};
