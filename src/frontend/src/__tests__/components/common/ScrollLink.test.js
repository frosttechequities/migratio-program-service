import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollLink from '../../../components/common/ScrollLink';

// Mock window.scrollTo
global.scrollTo = jest.fn();

describe('ScrollLink Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders with children', () => {
    render(
      <ScrollLink to="test-section">
        Test Link
      </ScrollLink>
    );

    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  test('has correct href attribute', () => {
    render(
      <ScrollLink to="test-section">
        Test Link
      </ScrollLink>
    );

    const link = screen.getByText('Test Link');
    expect(link.getAttribute('href')).toBe('#test-section');
  });

  test('scrolls to the target element when clicked', () => {
    // Create a mock target element
    const targetElement = document.createElement('div');
    targetElement.id = 'test-section';
    document.body.appendChild(targetElement);

    // Mock getBoundingClientRect for the target element
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        top: 100,
      };
    });

    render(
      <ScrollLink to="test-section">
        Test Link
      </ScrollLink>
    );

    // Click the link
    fireEvent.click(screen.getByText('Test Link'));

    // Check that scrollTo was called with the correct parameters
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    });

    // Clean up
    targetElement.remove();
  });

  test('applies offset when provided', () => {
    // Create a mock target element
    const targetElement = document.createElement('div');
    targetElement.id = 'test-section';
    document.body.appendChild(targetElement);

    // Mock getBoundingClientRect for the target element
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        top: 100,
      };
    });

    render(
      <ScrollLink to="test-section" offset={50}>
        Test Link
      </ScrollLink>
    );

    // Click the link
    fireEvent.click(screen.getByText('Test Link'));

    // Check that scrollTo was called with the correct parameters
    // The offset should be applied to the target position
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    });

    // Clean up
    targetElement.remove();
  });

  test('calls additional onClick handler when provided', () => {
    // Create a mock target element
    const targetElement = document.createElement('div');
    targetElement.id = 'test-section';
    document.body.appendChild(targetElement);

    // Create a mock onClick handler
    const mockOnClick = jest.fn();

    render(
      <ScrollLink to="test-section" onClick={mockOnClick}>
        Test Link
      </ScrollLink>
    );

    // Click the link
    fireEvent.click(screen.getByText('Test Link'));

    // Check that the additional onClick handler was called
    expect(mockOnClick).toHaveBeenCalled();

    // Clean up
    targetElement.remove();
  });

  test('handles missing target elements gracefully', () => {
    render(
      <ScrollLink to="non-existent-section">
        Test Link
      </ScrollLink>
    );

    // Click the link
    fireEvent.click(screen.getByText('Test Link'));

    // Check that scrollTo was not called
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
