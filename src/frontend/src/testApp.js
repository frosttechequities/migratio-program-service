import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import SimpleApp from './SimpleApp';
import { store } from './simpleStore';
import theme from './theme';
import ErrorBoundary from './components/common/ErrorBoundary';

// For debugging purposes
console.log('React version:', React.version);
console.log('Redux store initialized:', store);

// Function to test the app
const testApp = () => {
  try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <Provider store={store}>
            <BrowserRouter>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <SimpleApp />
              </ThemeProvider>
            </BrowserRouter>
          </Provider>
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('Test app rendered successfully');
    return true;
  } catch (error) {
    console.error('Error rendering test app:', error);
    return false;
  }
};

export default testApp;
