import React from 'react';
import { render, screen } from '@testing-library/react';
import SkipLink from '../../../components/common/SkipLink';

describe('SkipLink Component', () => {
  test('renders with correct text', () => {
    render(<SkipLink />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  test('has correct href attribute', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  test('has correct styling', () => {
    render(<SkipLink />);
    const link = screen.getByText('Skip to main content');
    
    // Check that the link is positioned off-screen initially
    expect(link).toHaveStyle('position: absolute');
    expect(link).toHaveStyle('top: -40px');
    
    // Check that the link has the correct background color
    expect(link).toHaveStyle('background-color: primary.main');
    
    // Check that the link has the correct text color
    expect(link).toHaveStyle('color: white');
  });
});
