import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimatedElement from '../../../components/common/AnimatedElement';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe(element) {
    this.element = element;
  }
  
  unobserve() {}
  
  disconnect() {}
  
  // Helper to simulate intersection
  simulateIntersection(isIntersecting) {
    this.callback([
      {
        isIntersecting,
        target: this.element,
      },
    ]);
  }
};

describe('AnimatedElement Component', () => {
  let observer;
  
  beforeEach(() => {
    // Store the observer instance
    const oldIntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = class extends oldIntersectionObserver {
      constructor(callback) {
        super(callback);
        observer = this;
      }
    };
  });
  
  test('renders children correctly', () => {
    render(
      <AnimatedElement>
        <div>Test Content</div>
      </AnimatedElement>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('applies initial animation styles', () => {
    render(
      <AnimatedElement animation="fade-up" data-testid="animated-element">
        <div>Test Content</div>
      </AnimatedElement>
    );
    
    const element = screen.getByTestId('animated-element');
    
    // Check initial styles
    expect(element).toHaveStyle('opacity: 0');
    expect(element).toHaveStyle('transform: translateY(30px)');
  });
  
  test('applies animation styles when element becomes visible', () => {
    render(
      <AnimatedElement animation="fade-up" data-testid="animated-element">
        <div>Test Content</div>
      </AnimatedElement>
    );
    
    const element = screen.getByTestId('animated-element');
    
    // Simulate intersection
    observer.simulateIntersection(true);
    
    // Check animated styles
    expect(element).toHaveStyle('opacity: 1');
    expect(element).toHaveStyle('transform: translateY(0)');
  });
  
  test('applies different animation types correctly', () => {
    render(
      <AnimatedElement animation="zoom-in" data-testid="animated-element">
        <div>Test Content</div>
      </AnimatedElement>
    );
    
    const element = screen.getByTestId('animated-element');
    
    // Check initial styles for zoom-in
    expect(element).toHaveStyle('opacity: 0');
    expect(element).toHaveStyle('transform: scale(0.9)');
    
    // Simulate intersection
    observer.simulateIntersection(true);
    
    // Check animated styles
    expect(element).toHaveStyle('opacity: 1');
    expect(element).toHaveStyle('transform: scale(1)');
  });
  
  test('applies custom duration and delay', () => {
    render(
      <AnimatedElement 
        animation="fade-in" 
        duration={1000} 
        delay={200}
        data-testid="animated-element"
      >
        <div>Test Content</div>
      </AnimatedElement>
    );
    
    const element = screen.getByTestId('animated-element');
    
    // Check transition includes custom duration and delay
    expect(element).toHaveStyle('transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1) 200ms');
  });
});
