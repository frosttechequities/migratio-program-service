import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

/**
 * AnimatedElement component for adding animations to any element
 * Uses IntersectionObserver for triggering animations when elements enter the viewport
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} props.animation - Animation type
 * @param {number} props.duration - Animation duration in ms
 * @param {number} props.delay - Animation delay in ms
 * @param {string} props.easing - Animation easing function
 * @param {number} props.threshold - Intersection observer threshold
 * @param {string} props.rootMargin - Intersection observer root margin
 * @param {boolean} props.once - Whether to animate only once
 * @param {Object} props.sx - Additional styles for the container
 * @returns {React.ReactElement} AnimatedElement component
 */
const AnimatedElement = ({
  children,
  animation = 'fade-up',
  duration = 800,
  delay = 0,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)',
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
  sx = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  
  // Animation variants
  const animations = {
    'fade-in': {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    'fade-up': {
      initial: { opacity: 0, transform: 'translateY(30px)' },
      animate: { opacity: 1, transform: 'translateY(0)' },
    },
    'fade-down': {
      initial: { opacity: 0, transform: 'translateY(-30px)' },
      animate: { opacity: 1, transform: 'translateY(0)' },
    },
    'fade-left': {
      initial: { opacity: 0, transform: 'translateX(-30px)' },
      animate: { opacity: 1, transform: 'translateX(0)' },
    },
    'fade-right': {
      initial: { opacity: 0, transform: 'translateX(30px)' },
      animate: { opacity: 1, transform: 'translateX(0)' },
    },
    'zoom-in': {
      initial: { opacity: 0, transform: 'scale(0.9)' },
      animate: { opacity: 1, transform: 'scale(1)' },
    },
    'zoom-out': {
      initial: { opacity: 0, transform: 'scale(1.1)' },
      animate: { opacity: 1, transform: 'scale(1)' },
    },
    'slide-up': {
      initial: { transform: 'translateY(100%)' },
      animate: { transform: 'translateY(0)' },
    },
    'slide-down': {
      initial: { transform: 'translateY(-100%)' },
      animate: { transform: 'translateY(0)' },
    },
    'slide-left': {
      initial: { transform: 'translateX(-100%)' },
      animate: { transform: 'translateX(0)' },
    },
    'slide-right': {
      initial: { transform: 'translateX(100%)' },
      animate: { transform: 'translateX(0)' },
    },
    'flip-x': {
      initial: { opacity: 0, transform: 'rotateX(90deg)' },
      animate: { opacity: 1, transform: 'rotateX(0)' },
    },
    'flip-y': {
      initial: { opacity: 0, transform: 'rotateY(90deg)' },
      animate: { opacity: 1, transform: 'rotateY(0)' },
    },
  };
  
  // Get animation styles
  const getAnimationStyles = () => {
    const { initial, animate } = animations[animation] || animations['fade-in'];
    
    return {
      ...initial,
      ...(isVisible ? animate : {}),
      transition: `all ${duration}ms ${easing} ${delay}ms`,
    };
  };
  
  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    const currentElement = elementRef.current;
    
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [once, threshold, rootMargin]);
  
  return (
    <Box
      ref={elementRef}
      sx={{
        ...sx,
        ...getAnimationStyles(),
      }}
    >
      {children}
    </Box>
  );
};

AnimatedElement.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf([
    'fade-in',
    'fade-up',
    'fade-down',
    'fade-left',
    'fade-right',
    'zoom-in',
    'zoom-out',
    'slide-up',
    'slide-down',
    'slide-left',
    'slide-right',
    'flip-x',
    'flip-y',
  ]),
  duration: PropTypes.number,
  delay: PropTypes.number,
  easing: PropTypes.string,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  once: PropTypes.bool,
  sx: PropTypes.object,
};

export default AnimatedElement;
