import React, { useEffect } from 'react';

/**
 * Performance monitoring component
 * Monitors and reports performance metrics
 * 
 * @returns {null} This component doesn't render anything
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    // Initialize performance monitoring
    if (typeof window !== 'undefined' && window.performance) {
      // Log navigation timing
      const navigationTiming = window.performance.timing;
      const pageLoadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
      
      console.log(`Page load time: ${pageLoadTime}ms`);
      
      // Report to analytics (commented out for now)
      // if (window.gtag) {
      //   window.gtag('event', 'timing_complete', {
      //     name: 'page_load',
      //     value: pageLoadTime,
      //     event_category: 'Performance',
      //   });
      // }
    }
    
    // Monitor long tasks
    if (typeof window !== 'undefined' && window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log(`Long task detected: ${entry.duration}ms`);
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        
        return () => {
          observer.disconnect();
        };
      } catch (e) {
        console.error('PerformanceObserver for longtask not supported', e);
      }
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;
