import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * KeyboardNavigation component to enhance keyboard navigation within a group of elements
 * 
 * @param {Object} props - Component props
 * @param {string} props.selector - CSS selector for the elements to navigate
 * @param {string} props.containerRef - Reference to the container element
 * @param {boolean} props.loop - Whether to loop from last to first element and vice versa
 * @param {boolean} props.vertical - Whether to use vertical (up/down) or horizontal (left/right) navigation
 * @param {boolean} props.enabled - Whether keyboard navigation is enabled
 * @param {function} props.onSelect - Callback when an element is selected (Enter key)
 * @returns {React.ReactElement} KeyboardNavigation component (invisible)
 */
const KeyboardNavigation = ({
  selector,
  containerRef,
  loop = true,
  vertical = false,
  enabled = true,
  onSelect,
}) => {
  useEffect(() => {
    if (!enabled || !containerRef?.current) return;

    const container = containerRef.current;
    
    const handleKeyDown = (e) => {
      // Only handle navigation keys
      const isVerticalNav = vertical && (e.key === 'ArrowUp' || e.key === 'ArrowDown');
      const isHorizontalNav = !vertical && (e.key === 'ArrowLeft' || e.key === 'ArrowRight');
      const isSelectKey = e.key === 'Enter' || e.key === ' ';
      
      if (!isVerticalNav && !isHorizontalNav && !isSelectKey) return;
      
      // Get all navigable elements
      const elements = Array.from(container.querySelectorAll(selector))
        .filter(el => el.offsetParent !== null); // Filter out hidden elements
      
      if (elements.length === 0) return;
      
      // Find the currently focused element
      const focusedElement = document.activeElement;
      const currentIndex = elements.indexOf(focusedElement);
      
      // Handle navigation keys
      if (isVerticalNav || isHorizontalNav) {
        e.preventDefault(); // Prevent scrolling
        
        let nextIndex;
        
        if (currentIndex === -1) {
          // No element is focused, focus the first one
          nextIndex = 0;
        } else {
          // Calculate next index based on key pressed
          const isNext = (vertical && e.key === 'ArrowDown') || (!vertical && e.key === 'ArrowRight');
          
          if (isNext) {
            nextIndex = currentIndex + 1;
            if (nextIndex >= elements.length) {
              nextIndex = loop ? 0 : elements.length - 1;
            }
          } else {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
              nextIndex = loop ? elements.length - 1 : 0;
            }
          }
        }
        
        // Focus the next element
        elements[nextIndex].focus();
      }
      
      // Handle select key
      if (isSelectKey && currentIndex !== -1 && onSelect) {
        e.preventDefault();
        onSelect(elements[currentIndex], currentIndex);
      }
    };
    
    // Add event listener
    container.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [selector, containerRef, loop, vertical, enabled, onSelect]);
  
  // This component doesn't render anything
  return null;
};

KeyboardNavigation.propTypes = {
  selector: PropTypes.string.isRequired,
  containerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  loop: PropTypes.bool,
  vertical: PropTypes.bool,
  enabled: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default KeyboardNavigation;
