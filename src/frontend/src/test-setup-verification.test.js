import React from 'react';
import { render, screen } from '@testing-library/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Test localStorage mock
describe('localStorage Mock', () => {
  test('localStorage mock works', () => {
    // Set an item
    localStorage.setItem('test', 'value');

    // Verify it was set
    expect(localStorage.getItem('test')).toBe('value');

    // Verify getItem was called
    expect(localStorage.getItem).toHaveBeenCalledWith('test');

    // Remove the item
    localStorage.removeItem('test');

    // Verify it was removed
    expect(localStorage.getItem('test')).toBeNull();
  });
});

// Test React Router mock
describe('React Router Mock', () => {
  test('Link component renders without errors', () => {
    render(<Link to="/test">Test Link</Link>);

    // Verify link was rendered
    expect(screen.getByText('Test Link')).toBeInTheDocument();
    expect(screen.getByText('Test Link').getAttribute('href')).toBe('/test');
  });
});

// Test axios mock
describe('Axios Mock', () => {
  test('axios mock works', async () => {
    // Mock axios response
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: { test: 'value' } });

    // Call axios
    const response = await axios.get('/test');

    // Verify axios was called
    expect(axios.get).toHaveBeenCalledWith('/test');

    // Verify response
    expect(response.data.test).toBe('value');
  });
});
