import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SectionNav from '../../../components/navigation/SectionNav';

// Mock window.scrollTo
global.scrollTo = jest.fn();

describe('SectionNav Component', () => {
  beforeEach(() => {
    // Create mock elements for each section
    const sections = ['hero', 'features', 'how-it-works', 'map', 'faq'];
    sections.forEach(section => {
      const element = document.createElement('div');
      element.id = section;
      document.body.appendChild(element);
    });

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up added elements
    const sections = ['hero', 'features', 'how-it-works', 'map', 'faq'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        element.remove();
      }
    });
  });

  test('renders section navigation with all links', () => {
    render(
      <BrowserRouter>
        <SectionNav />
      </BrowserRouter>
    );

    // Check that all navigation items are rendered
    expect(screen.getByLabelText('Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Features')).toBeInTheDocument();
    expect(screen.getByLabelText('How It Works')).toBeInTheDocument();
    expect(screen.getByLabelText('Global Reach')).toBeInTheDocument();
    expect(screen.getByLabelText('FAQ')).toBeInTheDocument();
  });

  test('scrolls to the correct section when a link is clicked', () => {
    render(
      <BrowserRouter>
        <SectionNav />
      </BrowserRouter>
    );

    // Mock getBoundingClientRect for the target element
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        top: 100,
      };
    });

    // Click on the Features link
    fireEvent.click(screen.getByLabelText('Features'));

    // Check that scrollTo was called with the correct parameters
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    });
  });

  test('handles missing target elements gracefully', () => {
    render(
      <BrowserRouter>
        <SectionNav />
      </BrowserRouter>
    );

    // Remove the features element
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.remove();
    }

    // Click on the Features link
    fireEvent.click(screen.getByLabelText('Features'));

    // Check that scrollTo was not called
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
