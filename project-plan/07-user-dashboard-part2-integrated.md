# Migratio User Dashboard Specification (Integrated - v2.0) - Part 2

## Key Dashboard Sections (Enhanced)

This part details the enhanced Assessment & Recommendations and Immigration Roadmap sections, incorporating AI insights and immersive UX elements.

### Assessment and Recommendations Section (Enhanced)

Provides users with personalized, data-driven immigration pathway options, including success probabilities and comparison tools.

#### 1. Assessment Status
*(Remains largely the same as original Part 2 - displays quiz progress and actions)*

```html
<section class="assessment-status">
  <!-- Structure similar to original Part 2 -->
</section>
```

#### 2. Recommendation Results (Enhanced)
*(Displays pathways with Match Score, Success Probability, and key insights)*

```html
<section class="recommendation-results">
  <div class="section-header">
    <h2>Your Personalized Immigration Pathways</h2>
    <div class="filter-controls">
      <!-- Filters for Country, Pathway Type remain -->
      <select class="country-filter">...</select>
      <select class="pathway-filter">...</select>
      <!-- Enhanced Sorting Options -->
      <select class="sort-options">
        <option value="ranking">Overall Rank</option> <!-- Default, combines factors -->
        <option value="match">Match Score</option>
        <option value="success_probability">Est. Success Probability</option> [*New*]
        <option value="processing">Processing Time</option>
        <option value="cost">Cost</option>
        <option value="complexity">Complexity</option>
      </select>
    </div>
  </div>

  <div class="recommendation-list">
    {{#each recommendations}}
    <div class="recommendation-item" data-country="{{countryCode}}" data-pathway="{{pathwayType}}">
      <div class="recommendation-header">
        <div class="program-info">
          <img src="{{countryFlagUrl}}" alt="{{countryName}} flag" class="country-flag">
          <div class="program-details">
            <h3 class="program-name">{{programName}}</h3>
            <span class="program-category">{{programCategory}}</span>
          </div>
        </div>
        <!-- Enhanced Scores Display -->
        <div class="scores-container">
          <div class="match-score">
            <div class="score-circle" style="--score: {{matchPercentage}}" title="How well your profile matches the program requirements.">
              <span class="score-value">{{matchPercentage}}%</span>
            </div>
            <span class="score-label">Match</span>
          </div>
          <div class="success-probability"> [*New*]
            <div class="score-circle probability" style="--score: {{successProbabilityPercentage}}" title="Estimated likelihood of application success based on your profile and historical data.">
              <span class="score-value">{{successProbabilityPercentage}}%</span>
            </div>
            <span class="score-label">Est. Success</span>
          </div>
        </div>
      </div>

      <div class="recommendation-body">
        <div class="key-metrics">
          <!-- Metrics like Processing Time, Cost, Complexity remain -->
           <div class="metric">
            <span class="metric-label">Processing Time</span>
            <span class="metric-value">{{processingTimeEstimate}}</span> <!-- Potentially predictive -->
          </div>
          <div class="metric">
            <span class="metric-label">Estimated Cost</span>
            <span class="metric-value">{{estimatedCostRange}}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Complexity</span>
            <span class="metric-value">{{complexityRating}}/5</span>
          </div>
        </div>

        <!-- Enhanced Match Reasons using Explanation Generator Output -->
        <div class="match-analysis">
          <div class="match-strengths">
            <h4>Key Strengths</h4>
            <ul class="reason-list">
              {{#each explanation.strengths}}
              <li class="reason-item positive">
                <span class="reason-icon"><svg><!-- Check icon --></svg></span>
                <span class="reason-text">{{description}}</span>
              </li>
              {{/each}}
            </ul>
          </div>
          <div class="match-challenges"> [*Enhanced*]
            <h4>Potential Challenges / Gaps</h4>
            <ul class="reason-list">
              {{#each explanation.challenges}}
              <li class="reason-item negative">
                <span class="reason-icon"><svg><!-- Warning icon --></svg></span>
                <span class="reason-text">{{description}}</span>
                {{#if suggestion}}<span class="suggestion-text">({{suggestion}})</span>{{/if}}
              </li>
              {{/each}}
              {{#unless explanation.challenges}}
              <li class="reason-item">No major challenges identified.</li>
              {{/unless}}
            </ul>
          </div>
        </div>
      </div>

      <div class="recommendation-actions">
        <button class="primary-action view-details-btn" data-program-id="{{programId}}">View Full Details</button>
        <button class="secondary-action create-roadmap-btn" data-program-id="{{programId}}">Create Roadmap</button>
        <button class="tertiary-action add-to-compare-btn" data-program-id="{{programId}}">
           <svg><!-- Compare icon --></svg> Compare
        </button>
      </div>
    </div>
    {{/each}}
    {{#unless recommendations}}
      <div class="no-recommendations">No recommendations match your current profile and filters. Try adjusting filters or completing more of your assessment.</div>
    {{/unless}}
  </div>
</section>
```

#### 3. Recommendation Comparison (Enhanced)
*(Includes Success Probability and potentially other differentiating factors)*

```html
<section class="recommendation-comparison">
  <h2>Compare Immigration Pathways</h2>

  <div class="comparison-controls">
     <!-- Controls similar to original Part 2 -->
  </div>

  <div class="comparison-table-container"> <!-- Added container for potential horizontal scroll -->
    <table class="comparison-table">
      <thead>
        <tr>
          <th class="feature-column">Feature</th>
          {{#each selectedPrograms}}
          <th class="program-column">
            <!-- Program header similar to original Part 2 -->
          </th>
          {{/each}}
        </tr>
      </thead>
      <tbody>
        <tr class="match-score-row">
          <td>Match Score</td>
          {{#each selectedPrograms}}
          <td>
            <div class="score-circle small" style="--score: {{matchPercentage}}">
              <span class="score-value">{{matchPercentage}}%</span>
            </div>
          </td>
          {{/each}}
        </tr>
        <!-- [*New*] Success Probability Row -->
        <tr class="success-probability-row">
          <td>Est. Success Probability</td>
          {{#each selectedPrograms}}
          <td>
            <div class="score-circle small probability" style="--score: {{successProbabilityPercentage}}">
              <span class="score-value">{{successProbabilityPercentage}}%</span>
            </div>
          </td>
          {{/each}}
        </tr>
        <tr>
          <td>Processing Time</td>
          {{#each selectedPrograms}}<td>{{processingTimeEstimate}}</td>{{/each}}
        </tr>
        <tr>
          <td>Estimated Cost</td>
          {{#each selectedPrograms}}<td>{{estimatedCostRange}}</td>{{/each}}
        </tr>
        <tr>
          <td>Complexity</td>
          {{#each selectedPrograms}}<td>{{complexityRating}}/5</td>{{/each}}
        </tr>
        <tr>
          <td>Pathway to Permanent Residence</td>
          {{#each selectedPrograms}}
          <td>
            {{#if pathwayToPermanentResidence}}<span class="positive-indicator">Yes</span>{{else}}<span class="negative-indicator">No</span>{{/if}}
          </td>
          {{/each}}
        </tr>
        <tr>
          <td>Pathway to Citizenship</td>
           {{#each selectedPrograms}}
          <td>
            {{#if pathwayToCitizenship}}<span class="positive-indicator">Yes</span>{{else}}<span class="negative-indicator">No</span>{{/if}}
          </td>
          {{/each}}
        </tr>
        <!-- Add more comparison rows as needed based on key differentiators -->
        <tr>
          <td>Key Skill Match</td> <!-- Example New Row -->
          {{#each selectedPrograms}}<td>{{keySkillMatchSummary}}</td>{{/each}}
        </tr>
         <tr>
          <td>Post-Arrival Support Level</td> <!-- Example New Row -->
          {{#each selectedPrograms}}<td>{{postArrivalSupportLevel}}/3</td>{{/each}}
        </tr>
        <!-- Requirements rows similar to original Part 2 -->
        <tr><td>Language Requirements</td>{{#each selectedPrograms}}<td>{{languageRequirements}}</td>{{/each}}</tr>
        <tr><td>Education Requirements</td>{{#each selectedPrograms}}<td>{{educationRequirements}}</td>{{/each}}</tr>
        <tr><td>Work Experience Requirements</td>{{#each selectedPrograms}}<td>{{workExperienceRequirements}}</td>{{/each}}</tr>
        <tr><td>Financial Requirements</td>{{#each selectedPrograms}}<td>{{financialRequirements}}</td>{{/each}}</tr>
        <tr class="actions-row">
          <td></td>
          {{#each selectedPrograms}}
          <td>
            <button class="primary-action">View Details</button>
            <button class="secondary-action">Create Roadmap</button>
          </td>
          {{/each}}
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

### Immigration Roadmap Section (Enhanced)

Provides a highly visual, interactive, and personalized step-by-step guide.

#### 1. Roadmap Overview
*(Remains largely the same as original Part 2 - displays program info, metadata, actions, progress summary)*

```html
<section class="roadmap-overview">
  <!-- Structure similar to original Part 2 -->
</section>
```

#### 2. Timeline Visualization (Enhanced - Immersive UX)
*(Focus on interactivity: zooming, panning, details on demand, dependencies)*

```html
<section class="timeline-visualization interactive"> <!-- Added 'interactive' class -->
  <div class="section-header">
    <h3>Your Personalized Immigration Timeline</h3>
    <div class="timeline-controls">
      <div class="view-options">
        <button class="view-option active" data-view="phases">Phases</button>
        <button class="view-option" data-view="calendar">Calendar</button> <!-- Example new view -->
        <button class="view-option" data-view="gantt">Gantt</button> <!-- Example new view -->
        <button class="view-option" data-view="list">List</button>
      </div>
      <div class="zoom-controls">
         <button class="zoom-btn" data-action="zoom-in"><svg><!-- Zoom In icon --></svg></button>
         <button class="zoom-btn" data-action="zoom-out"><svg><!-- Zoom Out icon --></svg></button>
         <button class="zoom-btn" data-action="reset-zoom"><svg><!-- Reset Zoom icon --></svg></button>
      </div>
      <div class="filter-options">
        <!-- Filters similar to original Part 2 -->
      </div>
    </div>
  </div>

  <!-- Interactive Timeline Component (e.g., using D3.js or a library) -->
  <div id="interactive-timeline-container" class="timeline-container">
    <!-- This container would be populated by a JavaScript visualization library -->
    <!-- It should allow zooming, panning, clicking nodes for details -->
    <!-- Example structure (simplified): -->
    <svg width="100%" height="400px" class="timeline-svg">
       <!-- Phases -->
       <g class="phase" id="phase-planning">
          <rect class="phase-background" />
          <text class="phase-title">Planning</text>
          <!-- Items within phase -->
          <g class="timeline-item task completed" id="task-1">
             <circle class="item-node" />
             <text class="item-label">Complete Profile</text>
             <!-- Tooltip/Popup on hover/click -->
          </g>
          <g class="timeline-item document pending" id="doc-req-2">
             <circle class="item-node" />
             <text class="item-label">Gather Transcripts</text>
          </g>
          <!-- Dependency lines -->
          <line class="dependency-line" x1="..." y1="..." x2="..." y2="..." />
       </g>
       <!-- Other phases -->
    </svg>
  </div>
</section>
```

#### 3. Task Management (Enhanced)
*(Integrates tasks from pre-decision and post-arrival stages)*

```html
<section class="task-management">
  <div class="section-header">
    <h3>Your Tasks</h3>
    <div class="header-actions">
      <button class="add-task-btn">Add Custom Task</button>
      <select class="task-filter">
        <option value="all">All Tasks</option>
        <option value="planning">Planning</option> [*New Filter*]
        <option value="application">Application</option>
        <option value="settlement">Settlement</option> [*New Filter*]
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </select>
    </div>
  </div>

  <div class="task-list">
    {{#each tasks}}
    <div class="task-item {{taskStatus}} {{taskPhaseCategory}}"> <!-- Added phase category class -->
      <!-- Task item structure similar to original Part 2 -->
      <!-- Ensure task data includes phase (Planning, Application, Settlement) -->
      <div class="task-content">
         <div class="task-header">
            <h4 class="task-title">{{taskTitle}}</h4>
            <div class="task-meta">
              <span class="task-phase-category">{{phaseCategoryText}}</span> <!-- e.g., Planning, Application, Settlement -->
              <span class="task-due-date {{#if isOverdue}}overdue{{/if}}">Due: {{dueDate}}</span>
            </div>
         </div>
         <!-- ... rest of task details ... -->
      </div>
      <!-- ... task actions ... -->
    </div>
    {{/each}}
  </div>

  <div class="pagination">
    <!-- Pagination similar to original Part 2 -->
  </div>
</section>
