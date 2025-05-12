import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import HomePage from '../HomePage'; // Adjust the import path if necessary
import theme from '../../theme'; // Assuming theme is needed by HomePage or its children

// Mock any necessary providers or context if HomePage depends on them
// For example, if it uses Redux:
// import { Provider } from 'react-redux';
// import store from '../../app/store'; // Adjust path

// Mock child components if they are complex or make network requests
// jest.mock('../../components/layout/Header', () => () => <div>Header Mock</div>);
// jest.mock('../../components/layout/Footer', () => () => <div>Footer Mock</div>);

describe('HomePage', () => {
  it('should render the world map visualization with the correct PNG background', () => {
    render(
      <ChakraProvider theme={theme}>
        {/* Wrap with other providers if needed, e.g., Redux Provider */}
        {/* <Provider store={store}> */}
          <HomePage />
        {/* </Provider> */}
      </ChakraProvider>
    );

    // Find the element responsible for the world map background.
    // We might need to add data-testid="world-map-visualization" to the Box in HomePage.js
    const worldMapElement = screen.getByTestId('world-map-visualization');

    // Check the computed style for the background image
    // Using a flexible check in case other background properties are set
    expect(worldMapElement).toHaveStyleContaining(`background: url(/assets/world-map-dots.png)`);
  });
});