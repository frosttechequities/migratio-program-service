import React from 'react';
import PropTypes from 'prop-types';

/**
 * ScrollLink component for smooth scrolling to page sections
 * 
 * @param {Object} props - Component props
 * @param {string} props.to - ID of the target element to scroll to
 * @param {React.ReactNode} props.children - Child elements
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.offset - Offset from the top of the target element (in pixels)
 * @param {function} props.onClick - Additional onClick handler
 * @returns {React.ReactElement} ScrollLink component
 */
const ScrollLink = ({ 
  to, 
  children, 
  style = {}, 
  className = '', 
  offset = 0,
  onClick = null,
  ...rest 
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    
    // Find the target element
    const targetElement = document.getElementById(to);
    
    if (targetElement) {
      // Get the target's position
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      
      // Calculate the final position with offset
      const offsetPosition = targetPosition - offset;
      
      // Scroll to the target
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Call additional onClick handler if provided
      if (onClick) {
        onClick(e);
      }
    }
  };
  
  return (
    <a
      href={`#${to}`}
      onClick={handleClick}
      style={style}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};

ScrollLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  offset: PropTypes.number,
  onClick: PropTypes.func,
};

export default ScrollLink;
