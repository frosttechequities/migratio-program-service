# Migratio User Dashboard Specification (Integrated - v2.0) - Part 3

## Document Management Section (Enhanced)

Helps users organize, track, and manage required documents, incorporating intelligent features like verification status and optimization guidance.

### 1. Document Overview
*(Includes 'Verified' stat prominently)*

```html
<section class="document-overview">
  <div class="section-header">
    <h2>Document Management</h2>
    <div class="header-actions">
      <button class="upload-document-btn">Upload Document</button>
      <button class="create-checklist-btn">Create Checklist</button> <!-- Or link to program checklist -->
    </div>
  </div>

  <div class="document-stats">
    <div class="stat-card">
      <div class="stat-value">{{totalDocuments}}</div>
      <div class="stat-label">Total Documents</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{documentsUploaded}}</div>
      <div class="stat-label">Uploaded</div>
    </div>
     <div class="stat-card"> [*Enhanced Position*]
      <div class="stat-value">{{documentsVerified}}</div>
      <div class="stat-label">Verified</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{documentsPendingVerification}}</div> [*New Stat*]
      <div class="stat-label">Pending Verification</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{documentsExpiring}}</div>
      <div class="stat-label">Expiring Soon</div>
    </div>
  </div>

  <div class="storage-usage">
    <!-- Structure similar to original Part 3 -->
  </div>
</section>
```

### 2. Document Library (Enhanced)
*(Adds Verification Status filter and display)*

```html
<section class="document-library">
  <div class="library-controls">
    <!-- Search similar to original Part 3 -->
    <div class="search-filter">...</div>

    <div class="filter-options">
      <select class="status-filter">
        <option value="all">All Upload Statuses</option>
        <option value="needed">Needed</option>
        <option value="uploaded">Uploaded</option> <!-- Simplified status -->
        <option value="expired">Expired</option>
      </select>

      <!-- [*New*] Verification Status Filter -->
      <select class="verification-filter">
        <option value="all">All Verification Statuses</option>
        <option value="pending">Pending Verification</option>
        <option value="in_progress">Verification In Progress</option>
        <option value="verified">Verified</option>
        <option value="rejected">Verification Rejected</option>
        <option value="not_required">Not Required</option>
      </select>

      <!-- Type and Program filters similar to original Part 3 -->
      <select class="type-filter">...</select>
      <select class="program-filter">...</select>
    </div>

    <!-- View options similar to original Part 3 -->
    <div class="view-options">...</div>
  </div>

  <div class="document-grid"> <!-- Or document-list based on view option -->
    {{#each documents}}
    <div class="document-card {{documentStatus}} {{verificationStatusClass}}"> <!-- Added verification class -->
      <div class="document-preview">
         <!-- Preview structure similar to original Part 3 -->
      </div>

      <div class="document-info">
        <h4 class="document-name">{{documentName}}</h4>
        <div class="document-meta">
          <span class="document-program">{{programName}}</span>
          <span class="document-date">Uploaded: {{uploadDate}}</span> <!-- Changed label -->
        </div>
        <!-- Enhanced Status Display -->
        <div class="status-indicators">
           <span class="document-status-badge {{statusClass}}">{{statusText}}</span>
           <span class="document-verification-badge {{verificationStatusClass}}">
              <svg><!-- Verification icon --></svg> {{verificationStatusText}}
           </span> [*New*]
        </div>
         <!-- [*Optional New*] Link/Indicator for optimization suggestions -->
         {{#if optimizationSuggestion}}
         <div class="optimization-prompt">
            <svg><!-- Lightbulb icon --></svg>
            <a href="/documents/{{documentId}}/optimize">Optimization suggestions available</a>
         </div>
         {{/if}}
      </div>

      {{#if expiryDate}}
      <div class="expiry-info {{#if isExpiringSoon}}expiring-soon{{/if}} {{#if isExpired}}expired{{/if}}">
        <!-- Expiry info similar to original Part 3 -->
      </div>
      {{/if}}

      <div class="document-actions">
         <!-- Actions similar to original Part 3 -->
         <!-- Add 'Request Verification' if applicable -->
      </div>
    </div>
    {{/each}}
  </div>
</section>
```

### 3. Document Checklist (Enhanced)
*(Integrates verification status and potentially links to document library items)*

```html
<section class="document-checklist">
  <div class="checklist-header">
     <!-- Header similar to original Part 3 -->
  </div>

  <div class="checklist-categories">
    {{#each documentCategories}}
    <div class="category-section">
      <div class="category-header">
         <!-- Category header similar to original Part 3 -->
      </div>

      <div class="category-documents">
        {{#each documents}}
        <div class="checklist-item {{documentStatus}} {{verificationStatusClass}}"> <!-- Added verification class -->
          <div class="item-status-indicator">
             <!-- Icon could reflect combined upload/verification status -->
            <svg><!-- Status icon --></svg>
          </div>

          <div class="item-details">
             <!-- Name, Description, Requirements, Notes similar to original Part 3 -->
             <div class="item-name">{{documentName}}</div>
             <div class="item-description">{{documentDescription}}</div>
             <!-- ... requirements/notes toggles ... -->
          </div>

          <div class="item-meta">
             <!-- Due Date similar to original Part 3 -->
             {{#if dueDate}} ... {{/if}}

             <!-- Display Upload & Verification Status -->
             <div class="status-details">
                {{#if documentId}}
                   <span class="upload-status">Uploaded: {{uploadedDate}}</span>
                   <span class="verification-status">Verification: {{verificationStatusText}}</span> [*New*]
                {{else}}
                   <span class="upload-status">Status: Needed</span>
                {{/if}}
             </div>
          </div>

          <div class="item-actions">
            {{#if documentId}} <!-- If document exists in library -->
              <button class="view-document-btn" data-document-id="{{documentId}}">View/Manage</button>
              <!-- Option to replace might be within the View/Manage screen -->
            {{else}}
              <button class="upload-document-btn" data-requirement-id="{{requirementId}}">Upload Now</button>
            {{/if}}
          </div>
        </div>
        {{/each}}
      </div>
    </div>
    {{/each}}
  </div>
</section>
```

## Resources and Guides Section (Enhanced)

Provides personalized educational content relevant to the user's specific journey stage and challenges.

### 1. Resource Library (Enhanced)
*(Adds journey stage filtering and more dynamic recommendations)*

```html
<section class="resource-library">
  <div class="section-header">
    <h2>Resources & Guides</h2>
     <!-- Search similar to original Part 3 -->
    <div class="header-actions">...</div>
  </div>

  <div class="resource-filters">
    <!-- Type, Country, Topic filters similar to original Part 3 -->
    <div class="filter-group">...</div>
    <div class="filter-group">...</div>
    <div class="filter-group">...</div>

    <!-- [*New*] Journey Stage Filter -->
    <div class="filter-group">
      <label class="filter-label">Journey Stage</label>
      <select class="stage-filter">
        <option value="all">All Stages</option>
        <option value="planning">Planning & Exploration</option>
        <option value="assessment">Assessment</option>
        <option value="application">Application Preparation</option>
        <option value="submission">Submission & Waiting</option>
        <option value="settlement">Settlement & Integration</option>
      </select>
    </div>
  </div>

  <div class="resource-collections">
    <div class="collection">
      <div class="collection-header">
        <!-- Title adapts based on context, e.g., "Recommended for Your Planning Stage" -->
        <h3 class="collection-title">{{dynamicRecommendedTitle}}</h3>
        <a href="#" class="view-all">View All</a>
      </div>

      <div class="resource-carousel">
        <!-- Carousel structure similar to original Part 3 -->
        <!-- Content (`recommendedResources`) is dynamically populated based on user profile, stage, and potentially identified gaps/challenges -->
        <div class="carousel-items">
          {{#each dynamicallyRecommendedResources}}
             <!-- Resource card structure similar to original Part 3 -->
          {{/each}}
        </div>
        <!-- Carousel controls -->
      </div>
    </div>

    <!-- Add specific collections for Planning and Settlement -->
    <div class="collection">
      <div class="collection-header">
        <h3 class="collection-title">Pre-Decision Planning Guides</h3> [*New*]
        <a href="#" class="view-all">View All</a>
      </div>
      <div class="resource-carousel">...</div>
    </div>

     <div class="collection">
      <div class="collection-header">
        <h3 class="collection-title">Settlement & Integration Resources</h3> [*New*]
        <a href="#" class="view-all">View All</a>
      </div>
      <div class="resource-carousel">...</div>
    </div>

    <!-- Popular Resources collection similar to original Part 3 -->
    <div class="collection">
      <div class="collection-header">
        <h3 class="collection-title">Popular Resources</h3>
        <a href="#" class="view-all">View All</a>
      </div>
      <div class="resource-carousel">...</div>
    </div>
  </div>
</section>
```

### 2. Resource Detail View
*(Remains largely the same as original Part 3 - displays content, attachments, tags, rating, related resources)*

```html
<section class="resource-detail">
  <!-- Structure similar to original Part 3 -->
</section>
