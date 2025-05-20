// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command for login
Cypress.Commands.add('login', () => {
  // Mock the authentication token
  window.localStorage.setItem('auth_token', 'test-token');
  
  // Mock the user data
  window.localStorage.setItem('user', JSON.stringify({
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com'
  }));
  
  // Intercept auth check API call
  cy.intercept('GET', '/api/auth/check', {
    statusCode: 200,
    body: {
      isAuthenticated: true,
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com'
      }
    }
  });
});
