# Migratio User Dashboard Specification (Integrated - v2.0) - Part 1

## Overview

The user dashboard is the central hub for users managing their immigration journey on the Migratio platform. This specification integrates strategic enhancements for **Immersive User Experience** and **Holistic Immigration Journey Support**. It outlines the purpose, architecture, and key features of the dashboard overview, designed to provide a personalized, informative, and actionable starting point.

## Purpose and Objectives (Enhanced)

The user dashboard aims to:

1.  **Centralize & Visualize**: Provide a single, intuitive location for all immigration activities, visualizing progress across the *entire* journey (pre-decision to post-arrival).
2.  **Facilitate Informed Decisions**: Present personalized recommendations, including success probabilities and comparative data, in an easily digestible format.
3.  **Guide Action**: Streamline task management and proactively suggest next steps based on user goals and roadmap status.
4.  **Personalize & Adapt**: Tailor the experience based on user profile, preferences, subscription tier, and journey stage.
5.  **Engage & Motivate**: Encourage continued progress through clear feedback, milestone celebrations, and relevant resource recommendations.
6.  **Promote Global Exploration**: Highlight multi-country opportunities and comparison tools [*New*].
7.  **Support Holistic Planning**: Integrate pre-decision and post-arrival considerations [*New*].

## User Dashboard Architecture

### Core Components

*(Architecture diagram remains the same, but component responsibilities are expanded)*

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

### 1. Header Navigation (Enhanced)
*(Same core functions: Account, Notifications, Search, Subscription, Language, Help)*
-   **Global Search**: Enhanced to include programs across multiple countries, resources, and potentially community content.
-   **Notifications**: More granular, covering document expiry, task deadlines, policy changes, new recommendations, community updates, post-arrival reminders.

### 2. Sidebar Navigation (Enhanced)
*(Core sections remain, potential additions/reordering based on strategy)*
-   Dashboard Home
-   **Explore & Compare** [*New/Renamed*]: Access to multi-country comparison tools, destination research.
-   Assessment & Recommendations
-   My Roadmap(s) [*Potentially plural if comparing paths*]
-   Document Center
-   Task Manager
-   **Planning Tools** [*New*]: Financial planning, readiness assessment (Pre-Decision).
-   **Settlement Guides** [*New*]: Post-arrival resources (housing, banking, etc.).
-   Resource Library
-   Community Hub
-   Support Center

### 3. Main Content Area
*(Remains the dynamic display area, will host enhanced visualizations and tools)*

### 4. Contextual Sidebar (Enhanced)
-   Provides more dynamic help, potentially including **conversational AI prompts** related to the current view.
-   Shows related actions, resources, and progress indicators relevant to the enhanced features (e.g., comparison tools, planning modules).

### 5. Footer
*(Remains largely the same: Legal, Copyright, Social Links)*

## Dashboard Home (Overview - Enhanced)

The dashboard home provides a dynamic, personalized overview, incorporating insights from the enhanced strategy.

### 1. Welcome Section
*(Largely the same, potentially adding a key goal or next step)*

```html
<section class="welcome-section">
  <div class="user-greeting">
    <h1>Welcome back, <span class="user-name">{{firstName}}</span></h1>
    <p class="last-login">Last login: {{lastLoginDate}}</p>
    <!-- Optional: Add a dynamic 'Next Step' prompt -->
    <p class="next-step-prompt">Next step: {{dynamicNextStepSuggestion}}</p>
  </div>
  <div class="quick-stats">
    <!-- Stats remain similar: Days Active, Tasks Completed, Profile Complete -->
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
    <!-- Actions might adapt based on user stage -->
    <button class="primary-action">{{primaryCallToAction}}</button> <!-- e.g., Continue Assessment, View Roadmap, Explore Options -->
    <button class="secondary-action">{{secondaryCallToAction}}</button> <!-- e.g., Update Profile, Compare Programs -->
  </div>
</section>
```

### 2. Journey Progress (Enhanced Visualization)
*(Timeline now explicitly includes pre-decision and post-arrival stages)*

```html
<section class="journey-progress">
  <h2>Your Immigration Journey Overview</h2>
  <div class="timeline-visualization interactive"> <!-- Added 'interactive' class -->
    <div class="timeline-node {{getNodeStatus 'exploration'}}">
      <div class="node-icon"><svg><!-- Explore icon --></svg></div>
      <div class="node-label">Exploration & Planning</div>
      <!-- Add progress/status details -->
    </div>
    <div class="timeline-connector"></div>
    <div class="timeline-node {{getNodeStatus 'assessment'}}">
      <div class="node-icon"><svg><!-- Assessment icon --></svg></div>
      <div class="node-label">Assessment</div>
      <!-- Add progress/status details -->
    </div>
    <div class="timeline-connector"></div>
    <div class="timeline-node {{getNodeStatus 'recommendations'}}">
      <div class="node-icon"><svg><!-- Recommendations icon --></svg></div>
      <div class="node-label">Recommendations</div>
      <!-- Add progress/status details -->
    </div>
    <div class="timeline-connector"></div>
    <div class="timeline-node {{getNodeStatus 'application'}}">
      <div class="node-icon"><svg><!-- Application icon --></svg></div>
      <div class="node-label">Application Prep & Submission</div>
      <!-- Add progress/status details -->
    </div>
    <div class="timeline-connector"></div>
    <div class="timeline-node {{getNodeStatus 'post_approval'}}">
      <div class="node-icon"><svg><!-- Post-approval icon --></svg></div>
      <div class="node-label">Post-Approval & Arrival</div>
      <!-- Add progress/status details -->
    </div>
     <div class="timeline-connector"></div>
    <div class="timeline-node {{getNodeStatus 'integration'}}">
      <div class="node-icon"><svg><!-- Integration icon --></svg></div>
      <div class="node-label">Integration & Settlement</div>
      <!-- Add progress/status details -->
    </div>
  </div>
</section>
```

### 3. Recommendation Summary (Enhanced)
*(Includes Success Probability and links to comparison tools)*

```html
<section class="recommendation-summary">
  <div class="section-header">
    <h2>Your Top Pathway Opportunities</h2>
    <div class="header-actions">
       <a href="/explore" class="compare-link">Compare Pathways</a>
       <a href="/recommendations" class="view-all">View All Recommendations</a>
    </div>
  </div>
  <div class="recommendation-cards">
    {{#each topRecommendations}}
    <div class="recommendation-card">
      <div class="program-header">
        <img src="{{countryFlagUrl}}" alt="{{countryName}} flag" class="country-flag">
        <h3>{{programName}}</h3>
        <span class="program-category">{{programCategory}}</span>
      </div>
      <div class="scores">
        <div class="match-score">
          <div class="score-circle" style="--score: {{matchPercentage}}">
            <span class="score-value">{{matchPercentage}}%</span>
          </div>
          <span class="score-label">Match</span>
        </div>
        <!-- [*New*] Success Probability Score -->
        <div class="success-probability">
           <div class="score-circle probability" style="--score: {{successProbabilityPercentage}}">
             <span class="score-value">{{successProbabilityPercentage}}%</span>
           </div>
           <span class="score-label">Est. Success</span>
        </div>
      </div>
      <ul class="key-points">
        <li><svg><!-- Check/Info icon --></svg> {{keyMatchFactor1}}</li>
        <li><svg><!-- Check/Info icon --></svg> {{keyMatchFactor2}}</li>
        {{#if keyChallenge}}
        <li><svg><!-- Warning icon --></svg> {{keyChallenge}}</li>
        {{/if}}
      </ul>
      <div class="card-actions">
        <a href="/recommendations/{{programId}}" class="action-btn primary">View Details</a>
        <button class="action-btn secondary add-to-compare" data-program-id="{{programId}}">Compare</button>
      </div>
    </div>
    {{/each}}
    {{#unless hasRecommendations}}
      <div class="no-recommendations-prompt">
        <p>Complete your assessment to see personalized recommendations.</p>
        <button class="primary-action">Continue Assessment</button>
      </div>
    {{/unless}}
  </div>
</section>
```

### 4. Upcoming Tasks
*(Remains largely the same, but tasks can now relate to pre-decision or post-arrival phases)*

```html
<section class="upcoming-tasks">
  <!-- Structure similar to original, ensure task data includes phase context -->
  <!-- ... task list ... -->
</section>
```

### 5. Document Center Summary (Enhanced)
*(Adds Verification Status)*

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
      <span class="stat-label">Needed</span>
    </div>
    <!-- [*New*] Verification Status -->
    <div class="document-stat">
      <span class="stat-value">{{documentsVerified}}</span>
      <span class="stat-label">Verified</span>
    </div>
    <div class="document-stat">
      <span class="stat-value">{{documentsExpiring}}</span>
      <span class="stat-label">Expiring Soon</span>
    </div>
  </div>
  <div class="recent-documents">
    <!-- List remains similar -->
  </div>
</section>
```

### 6. Resource Recommendations
*(Remains largely the same, but content recommendations should adapt to the full journey stage, including planning and settlement)*

```html
<section class="resource-recommendations">
  <!-- Structure similar to original, ensure resource data includes journey stage relevance -->
  <!-- ... resource cards ... -->
</section>
```

### 7. Subscription Status (Enhanced Tiers)
*(Reflects the new tier names: Pathfinder, Navigator, Concierge)*

```html
<section class="subscription-status {{subscriptionTier}}">
  <div class="current-plan">
    <!-- Use new tier names like Pathfinder, Navigator, Concierge -->
    <h3>Your Plan: <span class="plan-name">{{tierDisplayName}}</span></h3>
    <!-- ... rest of the structure similar ... -->
  </div>
  <div class="upgrade-prompt">
      <!-- Promote benefits relevant to differentiation pillars -->
      <!-- ... rest of the structure similar ... -->
  </div>
</section>
```

### 8. Global Opportunities Prompt [*New Section*]
*(Optional section to encourage multi-country exploration)*

```html
<section class="global-opportunities">
  <div class="section-header">
    <h2>Explore Global Opportunities</h2>
  </div>
  <div class="prompt-content">
    <div class="prompt-icon">
       <svg><!-- Globe/Compass icon --></svg>
    </div>
    <div class="prompt-text">
      <p>Did you know your profile might qualify you for programs in multiple countries?</p>
      <p>Use our comparison tools to explore pathways beyond your initial preferences.</p>
    </div>
    <div class="prompt-actions">
       <a href="/explore" class="primary-action">Compare Destinations</a>
       <a href="/profile/preferences" class="secondary-action">Update Preferences</a>
    </div>
  </div>
</section>
