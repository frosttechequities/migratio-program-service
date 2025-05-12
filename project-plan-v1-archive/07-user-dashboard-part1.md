# Migratio User Dashboard Specification - Part 1

## Overview

The user dashboard is a central component of the Migratio platform, serving as the primary interface for users to manage their immigration journey. This document outlines the comprehensive specifications for the user dashboard, including its purpose, structure, key features, user experience considerations, and technical implementation approach.

## Purpose and Objectives

The user dashboard aims to:

1. **Centralize Immigration Management**: Provide a single location for all immigration-related activities and information
2. **Visualize Progress**: Offer clear visual indicators of the user's immigration journey progress
3. **Facilitate Decision-Making**: Present recommendations and options in an easily comparable format
4. **Streamline Task Management**: Help users track and complete required tasks in a timely manner
5. **Personalize Experience**: Adapt to individual user needs and preferences
6. **Encourage Engagement**: Motivate users to continue their immigration journey through thoughtful design

## User Dashboard Architecture

### Core Components

The dashboard consists of several interconnected components that work together to provide a comprehensive user experience:

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER NAVIGATION                          │
├─────────────┬─────────────────────────────────────┬─────────────────┤
│             │                                     │                 │
│             │                                     │                 │
│             │                                     │                 │
│  SIDEBAR    │         MAIN CONTENT AREA           │  CONTEXTUAL     │
│  NAVIGATION │                                     │  SIDEBAR        │
│             │                                     │                 │
│             │                                     │                 │
│             │                                     │                 │
├─────────────┴─────────────────────────────────────┴─────────────────┤
│                              FOOTER                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1. Header Navigation

The top navigation bar provides:

- User account access and settings
- Notification center
- Global search functionality
- Subscription status indicator
- Language selector
- Help and support access

### 2. Sidebar Navigation

The primary navigation sidebar includes:

- Dashboard home link
- Assessment and recommendations section
- Immigration roadmap section
- Document management section
- Task management section
- Resources and guides section
- Community access (for applicable subscription tiers)
- Support and help center

### 3. Main Content Area

The dynamic central area that displays:

- Dashboard overview (default view)
- Section-specific content based on navigation selection
- Interactive tools and visualizations
- Form interfaces for data input
- Detailed information views

### 4. Contextual Sidebar

A dynamic secondary sidebar that provides:

- Context-sensitive help and information
- Related actions for current view
- Quick access to relevant resources
- Progress indicators for current section
- Promotional content for premium features (for free tier users)

### 5. Footer

The bottom section containing:

- Legal information and privacy policy
- Terms of service
- Copyright information
- Social media links
- Additional support options

## Dashboard Home (Overview)

The dashboard home serves as the central hub and provides a comprehensive overview of the user's immigration journey:

### 1. Welcome Section

```html
<section class="welcome-section">
  <div class="user-greeting">
    <h1>Welcome back, <span class="user-name">{{firstName}}</span></h1>
    <p class="last-login">Last login: {{lastLoginDate}}</p>
  </div>
  <div class="quick-stats">
    <div class="stat-item">
      <span class="stat-value">{{daysActive}}</span>
      <span class="stat-label">Days Active</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">{{completedTasks}}/{{totalTasks}}</span>
      <span class="stat-label">Tasks Completed</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">{{profileCompletion}}%</span>
      <span class="stat-label">Profile Complete</span>
    </div>
  </div>
  <div class="action-buttons">
    <button class="primary-action">Continue Assessment</button>
    <button class="secondary-action">View Recommendations</button>
  </div>
</section>
```

### 2. Journey Progress

A visual timeline showing the user's progress through the immigration journey:

```html
<section class="journey-progress">
  <h2>Your Immigration Journey</h2>
  <div class="timeline-visualization">
    <div class="timeline-node completed">
      <div class="node-icon">
        <svg><!-- Assessment icon --></svg>
      </div>
      <div class="node-label">Assessment</div>
      <div class="completion-date">Completed on {{assessmentCompletionDate}}</div>
    </div>
    <div class="timeline-connector"></div>
    <div class="timeline-node current">
      <div class="node-icon">
        <svg><!-- Recommendations icon --></svg>
      </div>
      <div class="node-label">Recommendations</div>
      <div class="progress-indicator">In progress ({{recommendationProgress}}%)</div>
    </div>
    <div class="timeline-connector"></div>
    <div class="timeline-node">
      <div class="node-icon">
        <svg><!-- Planning icon --></svg>
      </div>
      <div class="node-label">Planning</div>
    </div>
    <div class="timeline-connector"></div>
    <div class="timeline-node">
      <div class="node-icon">
        <svg><!-- Application icon --></svg>
      </div>
      <div class="node-label">Application</div>
    </div>
    <div class="timeline-connector"></div>
    <div class="timeline-node">
      <div class="node-icon">
        <svg><!-- Success icon --></svg>
      </div>
      <div class="node-label">Success</div>
    </div>
  </div>
</section>
```

### 3. Recommendation Summary

A snapshot of the user's top immigration pathway recommendations:

```html
<section class="recommendation-summary">
  <div class="section-header">
    <h2>Your Top Recommendations</h2>
    <a href="/recommendations" class="view-all">View All</a>
  </div>
  <div class="recommendation-cards">
    {{#each topRecommendations}}
    <div class="recommendation-card">
      <div class="program-header">
        <img src="{{countryFlagUrl}}" alt="{{countryName}} flag" class="country-flag">
        <h3>{{programName}}</h3>
      </div>
      <div class="match-score">
        <div class="score-circle" style="--score: {{matchPercentage}}">
          <span class="score-value">{{matchPercentage}}%</span>
        </div>
        <span class="score-label">Match</span>
      </div>
      <ul class="key-points">
        <li>{{keyPoint1}}</li>
        <li>{{keyPoint2}}</li>
        <li>{{keyPoint3}}</li>
      </ul>
      <a href="/recommendations/{{programId}}" class="card-action">View Details</a>
    </div>
    {{/each}}
  </div>
</section>
```

### 4. Upcoming Tasks

A prioritized list of tasks the user needs to complete:

```html
<section class="upcoming-tasks">
  <div class="section-header">
    <h2>Upcoming Tasks</h2>
    <a href="/tasks" class="view-all">View All</a>
  </div>
  <div class="task-list">
    {{#each upcomingTasks}}
    <div class="task-item {{priorityClass}}">
      <div class="task-checkbox">
        <input type="checkbox" id="task-{{taskId}}" {{#if completed}}checked{{/if}}>
        <label for="task-{{taskId}}"></label>
      </div>
      <div class="task-details">
        <h4 class="task-title">{{taskTitle}}</h4>
        <p class="task-description">{{taskDescription}}</p>
      </div>
      <div class="task-meta">
        <span class="due-date {{#if isOverdue}}overdue{{/if}}">
          {{#if isOverdue}}Overdue{{else}}Due{{/if}}: {{dueDate}}
        </span>
        <span class="task-program">{{relatedProgram}}</span>
      </div>
      <div class="task-actions">
        <button class="task-action-btn">Start</button>
      </div>
    </div>
    {{/each}}
  </div>
</section>
```

### 5. Document Center

A summary of the user's document status:

```html
<section class="document-center">
  <div class="section-header">
    <h2>Document Center</h2>
    <a href="/documents" class="view-all">View All</a>
  </div>
  <div class="document-summary">
    <div class="document-stat">
      <span class="stat-value">{{documentsUploaded}}</span>
      <span class="stat-label">Uploaded</span>
    </div>
    <div class="document-stat">
      <span class="stat-value">{{documentsPending}}</span>
      <span class="stat-label">Pending</span>
    </div>
    <div class="document-stat">
      <span class="stat-value">{{documentsExpiring}}</span>
      <span class="stat-label">Expiring Soon</span>
    </div>
  </div>
  <div class="recent-documents">
    <h3>Recently Updated</h3>
    <ul class="document-list">
      {{#each recentDocuments}}
      <li class="document-item">
        <div class="document-icon">
          <svg><!-- Document type icon --></svg>
        </div>
        <div class="document-info">
          <span class="document-name">{{documentName}}</span>
          <span class="document-status {{statusClass}}">{{statusText}}</span>
        </div>
        <div class="document-date">{{updatedDate}}</div>
        <a href="/documents/{{documentId}}" class="document-action">View</a>
      </li>
      {{/each}}
    </ul>
  </div>
</section>
```

### 6. Resource Recommendations

Personalized educational resources based on the user's profile and stage:

```html
<section class="resource-recommendations">
  <div class="section-header">
    <h2>Recommended Resources</h2>
    <a href="/resources" class="view-all">View All</a>
  </div>
  <div class="resource-cards">
    {{#each recommendedResources}}
    <div class="resource-card">
      <div class="resource-thumbnail">
        <img src="{{thumbnailUrl}}" alt="{{title}} thumbnail">
        <span class="resource-type {{resourceTypeClass}}">{{resourceType}}</span>
      </div>
      <div class="resource-content">
        <h4 class="resource-title">{{title}}</h4>
        <p class="resource-description">{{description}}</p>
      </div>
      <div class="resource-meta">
        <span class="reading-time">{{readingTime}} min read</span>
        <span class="resource-rating">
          <svg><!-- Star icon --></svg>
          {{rating}}
        </span>
      </div>
      <a href="/resources/{{resourceId}}" class="resource-action">Read More</a>
    </div>
    {{/each}}
  </div>
</section>
```

### 7. Subscription Status

Information about the user's current subscription and available upgrades:

```html
<section class="subscription-status {{subscriptionTier}}">
  <div class="current-plan">
    <h3>Your Plan: <span class="plan-name">{{subscriptionTierName}}</span></h3>
    <div class="plan-details">
      <p class="plan-description">{{subscriptionDescription}}</p>
      <p class="renewal-info">
        {{#if isFreeTier}}
        Upgrade to unlock premium features
        {{else}}
        Renews on {{renewalDate}} ({{daysUntilRenewal}} days)
        {{/if}}
      </p>
    </div>
  </div>
  {{#unless isEnterpriseTier}}
  <div class="upgrade-prompt">
    <h4>Ready for more?</h4>
    <p>Upgrade to {{nextTierName}} to unlock:</p>
    <ul class="upgrade-benefits">
      {{#each upgradeBenefits}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
    <button class="upgrade-button">Upgrade Now</button>
  </div>
  {{/unless}}
</section>
```
