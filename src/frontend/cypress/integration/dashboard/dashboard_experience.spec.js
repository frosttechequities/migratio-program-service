/// <reference types="cypress" />

describe('Dashboard Experience Optimization', () => {
  beforeEach(() => {
    // Mock API responses
    cy.intercept('GET', '/api/dashboard', { fixture: 'dashboard.json' }).as('getDashboard');
    cy.intercept('GET', '/api/profile', { fixture: 'profile.json' }).as('getProfile');
    cy.intercept('GET', '/api/recommendations', { fixture: 'recommendations.json' }).as('getRecommendations');
    cy.intercept('GET', '/api/roadmap', { fixture: 'roadmap.json' }).as('getRoadmap');
    cy.intercept('GET', '/api/documents', { fixture: 'documents.json' }).as('getDocuments');
    cy.intercept('GET', '/api/tasks', { fixture: 'tasks.json' }).as('getTasks');
    
    // Login and navigate to dashboard
    cy.login();
    cy.visit('/dashboard');
    
    // Wait for all API calls to complete
    cy.wait(['@getDashboard', '@getProfile', '@getRecommendations', '@getRoadmap', '@getDocuments', '@getTasks']);
  });
  
  it('renders all dashboard components correctly', () => {
    // Check if all main components are rendered
    cy.get('[data-testid="welcome-widget"]').should('be.visible');
    cy.get('[data-testid="journey-progress-widget"]').should('be.visible');
    cy.get('[data-testid="recommendation-summary-widget"]').should('be.visible');
    cy.get('[data-testid="upcoming-tasks-widget"]').should('be.visible');
    cy.get('[data-testid="document-center-widget"]').should('be.visible');
    cy.get('[data-testid="success-probability-widget"]').should('be.visible');
    
    // Check welcome message
    cy.get('[data-testid="welcome-widget"]').contains('Welcome');
    
    // Check journey progress
    cy.get('[data-testid="journey-progress-widget"]').contains('Your Immigration Journey');
    
    // Check recommendations
    cy.get('[data-testid="recommendation-summary-widget"]').contains('Top Pathway Opportunities');
    
    // Check tasks
    cy.get('[data-testid="upcoming-tasks-widget"]').contains('Upcoming Tasks');
    
    // Check documents
    cy.get('[data-testid="document-center-widget"]').contains('Document Center');
    
    // Check success probability
    cy.get('[data-testid="success-probability-widget"]').contains('Success Probability');
  });
  
  it('handles widget interactions correctly', () => {
    // Test recommendation widget interactions
    cy.get('[data-testid="recommendation-summary-widget"]').within(() => {
      cy.get('[data-testid="view-all-button"]').click();
    });
    cy.url().should('include', '/recommendations');
    cy.go('back');
    
    // Test task widget interactions
    cy.get('[data-testid="upcoming-tasks-widget"]').within(() => {
      cy.get('[data-testid="task-item"]').first().click();
    });
    cy.get('[data-testid="task-detail-modal"]').should('be.visible');
    cy.get('[data-testid="close-modal-button"]').click();
    
    // Test document widget interactions
    cy.get('[data-testid="document-center-widget"]').within(() => {
      cy.get('[data-testid="upload-document-button"]').click();
    });
    cy.get('[data-testid="document-upload-modal"]').should('be.visible');
    cy.get('[data-testid="close-modal-button"]').click();
  });
  
  it('handles dashboard customization correctly', () => {
    // Open dashboard customization
    cy.get('[data-testid="customize-dashboard-button"]').click();
    cy.get('[data-testid="dashboard-customization-modal"]').should('be.visible');
    
    // Toggle widget visibility
    cy.get('[data-testid="toggle-widget-recommendation-summary"]').click();
    cy.get('[data-testid="save-preferences-button"]').click();
    
    // Verify widget is hidden
    cy.get('[data-testid="recommendation-summary-widget"]').should('not.exist');
    
    // Reopen customization and restore widget
    cy.get('[data-testid="customize-dashboard-button"]').click();
    cy.get('[data-testid="toggle-widget-recommendation-summary"]').click();
    cy.get('[data-testid="save-preferences-button"]').click();
    
    // Verify widget is visible again
    cy.get('[data-testid="recommendation-summary-widget"]').should('be.visible');
  });
  
  it('handles roadmap interactions correctly', () => {
    // Navigate to roadmap tab
    cy.get('[data-testid="journey-progress-widget"]').within(() => {
      cy.get('[data-testid="view-roadmap-button"]').click();
    });
    
    // Check if timeline visualization is displayed
    cy.get('[data-testid="timeline-visualization"]').should('be.visible');
    
    // Test zoom controls
    cy.get('[aria-label="Zoom In"]').click();
    cy.get('[aria-label="Zoom Out"]').click();
    cy.get('[aria-label="Reset Zoom"]').click();
    
    // Test milestone interactions
    cy.get('[data-testid="milestone-item"]').first().click();
    cy.get('[data-testid="milestone-detail-modal"]').should('be.visible');
    cy.get('[data-testid="close-modal-button"]').click();
  });
  
  it('handles success probability widget interactions correctly', () => {
    // Check success probability widget
    cy.get('[data-testid="success-probability-widget"]').within(() => {
      // Check tabs
      cy.contains('Factors').click();
      cy.contains('Positive Factors').should('be.visible');
      cy.contains('Areas for Improvement').should('be.visible');
      
      // Switch to visualization tab
      cy.contains('Visualization').click();
      cy.get('[data-testid="factor-visualization"]').should('be.visible');
      
      // Test chart type toggle
      cy.get('[aria-label="Bar Chart"]').click();
      cy.get('[aria-label="Pie Chart"]').click();
    });
  });
  
  it('handles responsive layout correctly', () => {
    // Test on mobile viewport
    cy.viewport('iphone-x');
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
    
    // Check if widgets are stacked
    cy.get('[data-testid="dashboard-grid"]').should('have.css', 'flex-direction', 'column');
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
    
    // Test on desktop viewport
    cy.viewport('macbook-15');
    cy.get('[data-testid="dashboard-container"]').should('be.visible');
  });
  
  it('handles error states correctly', () => {
    // Simulate API error
    cy.intercept('GET', '/api/recommendations', { statusCode: 500 }).as('getRecommendationsError');
    cy.reload();
    
    // Check if error state is displayed
    cy.get('[data-testid="recommendation-summary-widget"]').within(() => {
      cy.contains('Error loading recommendations').should('be.visible');
      cy.get('[data-testid="retry-button"]').click();
    });
    
    // Restore API and check if data loads
    cy.intercept('GET', '/api/recommendations', { fixture: 'recommendations.json' }).as('getRecommendations');
    cy.wait('@getRecommendations');
    cy.get('[data-testid="recommendation-summary-widget"]').within(() => {
      cy.contains('Top Pathway Opportunities').should('be.visible');
    });
  });
  
  it('handles loading states correctly', () => {
    // Simulate slow API response
    cy.intercept('GET', '/api/recommendations', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
      });
    }).as('slowRecommendations');
    
    cy.reload();
    
    // Check if loading state is displayed
    cy.get('[data-testid="recommendation-summary-widget"]').within(() => {
      cy.get('[data-testid="loading-indicator"]').should('be.visible');
    });
    
    // Wait for data to load
    cy.wait('@slowRecommendations');
    cy.get('[data-testid="recommendation-summary-widget"]').within(() => {
      cy.get('[data-testid="loading-indicator"]').should('not.exist');
      cy.contains('Top Pathway Opportunities').should('be.visible');
    });
  });
});
