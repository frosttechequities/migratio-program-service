import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a container
 * Useful for modals, dialogs, and other components that should trap focus
 * 
 * @param {boolean} active - Whether the focus trap is active
 * @param {function} onEscape - Callback when Escape key is pressed
 * @returns {Object} - Ref to attach to the container element
 */
const useFocusTrap = (active = true, onEscape = null) => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!active || !containerRef.current) return;
    
    const container = containerRef.current;
    
    // Save the element that had focus before trapping
    const previouslyFocused = document.activeElement;
    
    // Find all focusable elements within the container
    const getFocusableElements = () => {
      return Array.from(
        container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
      );
    };
    
    // Focus the first focusable element
    const focusFirstElement = () => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        // If no focusable elements, focus the container itself
        container.setAttribute('tabindex', '-1');
        container.focus();
      }
    };
    
    // Handle tab key to keep focus within the container
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }
      
      if (e.key !== 'Tab') return;
      
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // If shift + tab and on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // If tab and on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    // Focus the first element when the trap becomes active
    focusFirstElement();
    
    // Add event listener for tab key
    document.addEventListener('keydown', handleKeyDown);
    
    // Restore focus when the trap is deactivated
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      if (previouslyFocused && 'focus' in previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [active, onEscape]);
  
  return containerRef;
};

export default useFocusTrap;
