# Migratio User Dashboard Specification - Part 2

## Key Dashboard Sections

### Assessment and Recommendations Section

The assessment and recommendations section provides users with their personalized immigration pathway options:

#### 1. Assessment Status

```html
<section class="assessment-status">
  <h2>Your Assessment</h2>
  <div class="assessment-progress">
    <div class="progress-indicator">
      <div class="progress-bar" style="width: {{assessmentCompletionPercentage}}%"></div>
    </div>
    <div class="progress-stats">
      <span class="completion-percentage">{{assessmentCompletionPercentage}}% Complete</span>
      <span class="questions-completed">{{completedQuestions}}/{{totalQuestions}} Questions</span>
    </div>
  </div>
  <div class="assessment-actions">
    {{#if assessmentComplete}}
    <button class="primary-action">Update Assessment</button>
    <button class="secondary-action">Retake Assessment</button>
    {{else}}
    <button class="primary-action">Continue Assessment</button>
    <button class="secondary-action">Save & Exit</button>
    {{/if}}
  </div>
  <div class="last-updated">
    Last updated: {{lastAssessmentUpdateDate}}
  </div>
</section>
```

#### 2. Recommendation Results

```html
<section class="recommendation-results">
  <div class="section-header">
    <h2>Your Immigration Pathways</h2>
    <div class="filter-controls">
      <select class="country-filter">
        <option value="all">All Countries</option>
        {{#each countries}}
        <option value="{{countryCode}}">{{countryName}}</option>
        {{/each}}
      </select>
      <select class="pathway-filter">
        <option value="all">All Pathways</option>
        <option value="work">Work</option>
        <option value="study">Study</option>
        <option value="family">Family</option>
        <option value="investment">Investment</option>
        <option value="humanitarian">Humanitarian</option>
      </select>
      <select class="sort-options">
        <option value="match">Match Score</option>
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
        <div class="match-score">
          <div class="score-circle" style="--score: {{matchPercentage}}">
            <span class="score-value">{{matchPercentage}}%</span>
          </div>
        </div>
      </div>
      
      <div class="recommendation-body">
        <div class="key-metrics">
          <div class="metric">
            <span class="metric-label">Processing Time</span>
            <span class="metric-value">{{processingTime}}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Estimated Cost</span>
            <span class="metric-value">{{estimatedCost}}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Complexity</span>
            <span class="metric-value">{{complexityRating}}/5</span>
          </div>
        </div>
        
        <div class="match-reasons">
          <h4>Why This Matches You</h4>
          <ul class="reason-list">
            {{#each matchReasons}}
            <li class="reason-item">
              <span class="reason-icon {{reasonType}}">
                <svg><!-- Reason type icon --></svg>
              </span>
              <span class="reason-text">{{reasonText}}</span>
            </li>
            {{/each}}
          </ul>
        </div>
        
        <div class="gap-summary">
          <h4>Areas to Improve</h4>
          <ul class="gap-list">
            {{#each gaps}}
            <li class="gap-item {{gapSeverity}}">
              <span class="gap-icon">
                <svg><!-- Gap type icon --></svg>
              </span>
              <span class="gap-text">{{gapDescription}}</span>
            </li>
            {{/each}}
          </ul>
        </div>
      </div>
      
      <div class="recommendation-actions">
        <button class="primary-action">View Full Details</button>
        <button class="secondary-action">Create Roadmap</button>
        <button class="tertiary-action">Compare</button>
      </div>
    </div>
    {{/each}}
  </div>
</section>
```

#### 3. Recommendation Comparison

```html
<section class="recommendation-comparison">
  <h2>Compare Immigration Pathways</h2>
  
  <div class="comparison-controls">
    <div class="program-selectors">
      <select class="program-selector" id="program-selector-1">
        <option value="">Select a program</option>
        {{#each allPrograms}}
        <option value="{{programId}}">{{programName}} ({{countryName}})</option>
        {{/each}}
      </select>
      
      <select class="program-selector" id="program-selector-2">
        <option value="">Select a program</option>
        {{#each allPrograms}}
        <option value="{{programId}}">{{programName}} ({{countryName}})</option>
        {{/each}}
      </select>
      
      <select class="program-selector" id="program-selector-3">
        <option value="">Select a program</option>
        {{#each allPrograms}}
        <option value="{{programId}}">{{programName}} ({{countryName}})</option>
        {{/each}}
      </select>
    </div>
    
    <div class="comparison-actions">
      <button class="compare-button">Compare Selected</button>
      <button class="reset-button">Reset</button>
    </div>
  </div>
  
  <div class="comparison-table">
    <table>
      <thead>
        <tr>
          <th class="feature-column">Feature</th>
          {{#each selectedPrograms}}
          <th class="program-column">
            <div class="program-header">
              <img src="{{countryFlagUrl}}" alt="{{countryName}} flag" class="country-flag">
              <div class="program-title">
                <h4>{{programName}}</h4>
                <span class="program-category">{{programCategory}}</span>
              </div>
            </div>
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
        <tr>
          <td>Processing Time</td>
          {{#each selectedPrograms}}
          <td>{{processingTime}}</td>
          {{/each}}
        </tr>
        <tr>
          <td>Estimated Cost</td>
          {{#each selectedPrograms}}
          <td>{{estimatedCost}}</td>
          {{/each}}
        </tr>
        <tr>
          <td>Complexity</td>
          {{#each selectedPrograms}}
          <td>{{complexityRating}}/5</td>
          {{/each}}
        </tr>
        <tr>
          <td>Pathway to Permanent Residence</td>
          {{#each selectedPrograms}}
          <td>
            {{#if pathwayToPermanentResidence}}
            <span class="positive-indicator">Yes</span>
            {{else}}
            <span class="negative-indicator">No</span>
            {{/if}}
          </td>
          {{/each}}
        </tr>
        <tr>
          <td>Pathway to Citizenship</td>
          {{#each selectedPrograms}}
          <td>
            {{#if pathwayToCitizenship}}
            <span class="positive-indicator">Yes</span>
            {{else}}
            <span class="negative-indicator">No</span>
            {{/if}}
          </td>
          {{/each}}
        </tr>
        <tr>
          <td>Language Requirements</td>
          {{#each selectedPrograms}}
          <td>{{languageRequirements}}</td>
          {{/each}}
        </tr>
        <tr>
          <td>Education Requirements</td>
          {{#each selectedPrograms}}
          <td>{{educationRequirements}}</td>
          {{/each}}
        </tr>
        <tr>
          <td>Work Experience Requirements</td>
          {{#each selectedPrograms}}
          <td>{{workExperienceRequirements}}</td>
          {{/each}}
        </tr>
        <tr>
          <td>Financial Requirements</td>
          {{#each selectedPrograms}}
          <td>{{financialRequirements}}</td>
          {{/each}}
        </tr>
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

### Immigration Roadmap Section

The immigration roadmap section provides users with a personalized step-by-step guide for their chosen immigration pathway:

#### 1. Roadmap Overview

```html
<section class="roadmap-overview">
  <div class="roadmap-header">
    <div class="program-info">
      <img src="{{countryFlagUrl}}" alt="{{countryName}} flag" class="country-flag">
      <div class="program-details">
        <h2 class="program-name">{{programName}}</h2>
        <span class="program-category">{{programCategory}}</span>
      </div>
    </div>
    
    <div class="roadmap-meta">
      <div class="meta-item">
        <span class="meta-label">Created</span>
        <span class="meta-value">{{creationDate}}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Last Updated</span>
        <span class="meta-value">{{lastUpdateDate}}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Status</span>
        <span class="meta-value status-{{roadmapStatus}}">{{roadmapStatusText}}</span>
      </div>
    </div>
    
    <div class="roadmap-actions">
      <button class="primary-action">Download PDF</button>
      <button class="secondary-action">Share Roadmap</button>
      <button class="tertiary-action">Edit Roadmap</button>
    </div>
  </div>
  
  <div class="progress-summary">
    <div class="progress-stats">
      <div class="stat-item">
        <span class="stat-value">{{completionPercentage}}%</span>
        <span class="stat-label">Complete</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{completedTasks}}/{{totalTasks}}</span>
        <span class="stat-label">Tasks</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{completedDocuments}}/{{totalDocuments}}</span>
        <span class="stat-label">Documents</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{completedMilestones}}/{{totalMilestones}}</span>
        <span class="stat-label">Milestones</span>
      </div>
    </div>
    
    <div class="timeline-estimate">
      <div class="estimate-label">Estimated Completion:</div>
      <div class="estimate-value">{{estimatedCompletionDate}}</div>
      <div class="estimate-detail">({{remainingTime}} remaining)</div>
    </div>
  </div>
</section>
```

#### 2. Timeline Visualization

```html
<section class="timeline-visualization">
  <h3>Immigration Timeline</h3>
  
  <div class="timeline-controls">
    <div class="view-options">
      <button class="view-option active" data-view="phases">Phases</button>
      <button class="view-option" data-view="months">Months</button>
      <button class="view-option" data-view="list">List</button>
    </div>
    
    <div class="filter-options">
      <label class="filter-option">
        <input type="checkbox" checked data-filter="tasks">
        <span class="filter-label">Tasks</span>
      </label>
      <label class="filter-option">
        <input type="checkbox" checked data-filter="documents">
        <span class="filter-label">Documents</span>
      </label>
      <label class="filter-option">
        <input type="checkbox" checked data-filter="milestones">
        <span class="filter-label">Milestones</span>
      </label>
    </div>
  </div>
  
  <div class="timeline-container phases-view">
    {{#each phases}}
    <div class="timeline-phase {{phaseStatus}}">
      <div class="phase-header">
        <h4 class="phase-title">{{phaseTitle}}</h4>
        <div class="phase-duration">{{phaseDuration}}</div>
        <div class="phase-progress">
          <div class="progress-bar" style="width: {{phaseCompletionPercentage}}%"></div>
          <span class="progress-text">{{phaseCompletionPercentage}}%</span>
        </div>
      </div>
      
      <div class="phase-content">
        <div class="phase-timeline">
          {{#each phaseItems}}
          <div class="timeline-item {{itemType}} {{itemStatus}}">
            <div class="item-connector"></div>
            <div class="item-icon">
              <svg><!-- Item type icon --></svg>
            </div>
            <div class="item-content">
              <div class="item-title">{{itemTitle}}</div>
              <div class="item-date">{{itemDate}}</div>
              <div class="item-description">{{itemDescription}}</div>
            </div>
            <div class="item-actions">
              <button class="item-action-btn">{{actionText}}</button>
            </div>
          </div>
          {{/each}}
        </div>
      </div>
    </div>
    {{/each}}
  </div>
</section>
```

#### 3. Task Management

```html
<section class="task-management">
  <div class="section-header">
    <h3>Tasks</h3>
    <div class="header-actions">
      <button class="add-task-btn">Add Task</button>
      <select class="task-filter">
        <option value="all">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </select>
    </div>
  </div>
  
  <div class="task-list">
    {{#each tasks}}
    <div class="task-item {{taskStatus}}">
      <div class="task-checkbox">
        <input type="checkbox" id="task-{{taskId}}" {{#if completed}}checked{{/if}}>
        <label for="task-{{taskId}}"></label>
      </div>
      
      <div class="task-content">
        <div class="task-header">
          <h4 class="task-title">{{taskTitle}}</h4>
          <div class="task-meta">
            <span class="task-phase">{{phaseName}}</span>
            <span class="task-due-date {{#if isOverdue}}overdue{{/if}}">
              Due: {{dueDate}}
            </span>
          </div>
        </div>
        
        <div class="task-description">
          {{taskDescription}}
        </div>
        
        <div class="task-details">
          {{#if hasSubtasks}}
          <div class="subtasks">
            <div class="subtask-header">Subtasks ({{completedSubtasks}}/{{totalSubtasks}})</div>
            <ul class="subtask-list">
              {{#each subtasks}}
              <li class="subtask-item {{#if completed}}completed{{/if}}">
                <input type="checkbox" id="subtask-{{subtaskId}}" {{#if completed}}checked{{/if}}>
                <label for="subtask-{{subtaskId}}">{{subtaskTitle}}</label>
              </li>
              {{/each}}
            </ul>
          </div>
          {{/if}}
          
          {{#if hasAttachments}}
          <div class="attachments">
            <div class="attachment-header">Attachments ({{attachmentCount}})</div>
            <ul class="attachment-list">
              {{#each attachments}}
              <li class="attachment-item">
                <span class="attachment-icon">
                  <svg><!-- File type icon --></svg>
                </span>
                <span class="attachment-name">{{attachmentName}}</span>
                <a href="{{attachmentUrl}}" class="attachment-action">View</a>
              </li>
              {{/each}}
            </ul>
          </div>
          {{/if}}
          
          {{#if hasNotes}}
          <div class="task-notes">
            <div class="notes-header">Notes</div>
            <div class="notes-content">{{taskNotes}}</div>
          </div>
          {{/if}}
        </div>
      </div>
      
      <div class="task-actions">
        <button class="task-action-btn primary">{{primaryActionText}}</button>
        <button class="task-action-btn secondary">Edit</button>
        <div class="task-action-menu">
          <button class="menu-trigger">
            <svg><!-- More icon --></svg>
          </button>
          <ul class="action-menu">
            <li class="menu-item">Add Note</li>
            <li class="menu-item">Add Attachment</li>
            <li class="menu-item">Set Reminder</li>
            <li class="menu-item">Move to Phase</li>
            <li class="menu-item delete">Delete Task</li>
          </ul>
        </div>
      </div>
    </div>
    {{/each}}
  </div>
  
  <div class="pagination">
    <button class="pagination-prev" {{#unless hasPreviousPage}}disabled{{/unless}}>
      <svg><!-- Previous icon --></svg>
    </button>
    <span class="pagination-info">{{currentPage}} of {{totalPages}}</span>
    <button class="pagination-next" {{#unless hasNextPage}}disabled{{/unless}}>
      <svg><!-- Next icon --></svg>
    </button>
  </div>
</section>
```
