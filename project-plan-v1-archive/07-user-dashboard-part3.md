# Migratio User Dashboard Specification - Part 3

## Document Management Section

The document management section helps users organize and track all documents required for their immigration process:

### 1. Document Overview

```html
<section class="document-overview">
  <div class="section-header">
    <h2>Document Management</h2>
    <div class="header-actions">
      <button class="upload-document-btn">Upload Document</button>
      <button class="create-checklist-btn">Create Checklist</button>
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
    <div class="stat-card">
      <div class="stat-value">{{documentsPending}}</div>
      <div class="stat-label">Pending</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{documentsExpiring}}</div>
      <div class="stat-label">Expiring Soon</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{documentsVerified}}</div>
      <div class="stat-label">Verified</div>
    </div>
  </div>
  
  <div class="storage-usage">
    <div class="usage-label">Storage Usage</div>
    <div class="usage-bar">
      <div class="usage-fill" style="width: {{storagePercentage}}%"></div>
    </div>
    <div class="usage-details">
      <span class="used-storage">{{usedStorage}} MB</span> of 
      <span class="total-storage">{{totalStorage}} MB</span>
      <span class="upgrade-prompt">
        {{#if storageNearLimit}}
        <a href="/subscription/upgrade">Upgrade for more storage</a>
        {{/if}}
      </span>
    </div>
  </div>
</section>
```

### 2. Document Library

```html
<section class="document-library">
  <div class="library-controls">
    <div class="search-filter">
      <input type="text" placeholder="Search documents..." class="search-input">
      <button class="search-btn">
        <svg><!-- Search icon --></svg>
      </button>
    </div>
    
    <div class="filter-options">
      <select class="status-filter">
        <option value="all">All Statuses</option>
        <option value="needed">Needed</option>
        <option value="in-progress">In Progress</option>
        <option value="obtained">Obtained</option>
        <option value="submitted">Submitted</option>
        <option value="verified">Verified</option>
        <option value="expired">Expired</option>
      </select>
      
      <select class="type-filter">
        <option value="all">All Types</option>
        <option value="identification">Identification</option>
        <option value="education">Education</option>
        <option value="employment">Employment</option>
        <option value="financial">Financial</option>
        <option value="language">Language</option>
        <option value="medical">Medical</option>
        <option value="legal">Legal</option>
        <option value="other">Other</option>
      </select>
      
      <select class="program-filter">
        <option value="all">All Programs</option>
        {{#each programs}}
        <option value="{{programId}}">{{programName}}</option>
        {{/each}}
      </select>
    </div>
    
    <div class="view-options">
      <button class="view-option active" data-view="grid">
        <svg><!-- Grid icon --></svg>
      </button>
      <button class="view-option" data-view="list">
        <svg><!-- List icon --></svg>
      </button>
    </div>
  </div>
  
  <div class="document-grid">
    {{#each documents}}
    <div class="document-card {{documentStatus}}">
      <div class="document-preview">
        <div class="document-icon">
          <svg><!-- Document type icon --></svg>
        </div>
        {{#if hasThumbnail}}
        <img src="{{thumbnailUrl}}" alt="{{documentName}} preview" class="thumbnail">
        {{/if}}
        <div class="document-type-badge">{{documentType}}</div>
      </div>
      
      <div class="document-info">
        <h4 class="document-name">{{documentName}}</h4>
        <div class="document-meta">
          <span class="document-program">{{programName}}</span>
          <span class="document-date">{{lastUpdated}}</span>
        </div>
        <div class="document-status-badge {{statusClass}}">
          {{statusText}}
        </div>
      </div>
      
      {{#if expiryDate}}
      <div class="expiry-info {{#if isExpiringSoon}}expiring-soon{{/if}} {{#if isExpired}}expired{{/if}}">
        {{#if isExpired}}
        Expired: {{expiryDate}}
        {{else if isExpiringSoon}}
        Expires soon: {{expiryDate}}
        {{else}}
        Expires: {{expiryDate}}
        {{/if}}
      </div>
      {{/if}}
      
      <div class="document-actions">
        <button class="primary-action">View</button>
        <div class="action-menu">
          <button class="menu-trigger">
            <svg><!-- More icon --></svg>
          </button>
          <ul class="menu-options">
            <li class="menu-option">Download</li>
            <li class="menu-option">Replace</li>
            <li class="menu-option">Update Status</li>
            <li class="menu-option">Share</li>
            <li class="menu-option">Delete</li>
          </ul>
        </div>
      </div>
    </div>
    {{/each}}
  </div>
</section>
```

### 3. Document Checklist

```html
<section class="document-checklist">
  <div class="checklist-header">
    <h3>{{programName}} Document Checklist</h3>
    <div class="checklist-meta">
      <span class="checklist-progress">{{completedDocuments}}/{{totalDocuments}} Complete</span>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {{completionPercentage}}%"></div>
      </div>
    </div>
  </div>
  
  <div class="checklist-categories">
    {{#each documentCategories}}
    <div class="category-section">
      <div class="category-header">
        <h4 class="category-name">{{categoryName}}</h4>
        <span class="category-progress">{{categoryCompletedDocuments}}/{{categoryTotalDocuments}}</span>
      </div>
      
      <div class="category-documents">
        {{#each documents}}
        <div class="checklist-item {{documentStatus}}">
          <div class="item-status-indicator">
            <svg><!-- Status icon --></svg>
          </div>
          
          <div class="item-details">
            <div class="item-name">{{documentName}}</div>
            <div class="item-description">{{documentDescription}}</div>
            
            {{#if documentRequirements}}
            <div class="item-requirements">
              <div class="requirements-toggle">Requirements</div>
              <div class="requirements-content">
                <ul class="requirements-list">
                  {{#each documentRequirements}}
                  <li class="requirement-item">{{this}}</li>
                  {{/each}}
                </ul>
              </div>
            </div>
            {{/if}}
            
            {{#if documentNotes}}
            <div class="item-notes">
              <div class="notes-toggle">Notes</div>
              <div class="notes-content">{{documentNotes}}</div>
            </div>
            {{/if}}
          </div>
          
          <div class="item-meta">
            {{#if dueDate}}
            <div class="due-date {{#if isOverdue}}overdue{{/if}}">
              Due: {{dueDate}}
            </div>
            {{/if}}
            
            {{#if uploadedDate}}
            <div class="uploaded-date">
              Uploaded: {{uploadedDate}}
            </div>
            {{/if}}
          </div>
          
          <div class="item-actions">
            {{#if isUploaded}}
            <button class="view-document-btn">View</button>
            <button class="replace-document-btn">Replace</button>
            {{else}}
            <button class="upload-document-btn">Upload</button>
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

## Resources and Guides Section

The resources and guides section provides users with educational content to help them navigate the immigration process:

### 1. Resource Library

```html
<section class="resource-library">
  <div class="section-header">
    <h2>Resources & Guides</h2>
    <div class="header-actions">
      <div class="search-box">
        <input type="text" placeholder="Search resources..." class="search-input">
        <button class="search-btn">
          <svg><!-- Search icon --></svg>
        </button>
      </div>
    </div>
  </div>
  
  <div class="resource-filters">
    <div class="filter-group">
      <label class="filter-label">Resource Type</label>
      <div class="filter-options">
        <label class="filter-option">
          <input type="checkbox" checked data-filter="article">
          <span class="option-label">Articles</span>
        </label>
        <label class="filter-option">
          <input type="checkbox" checked data-filter="video">
          <span class="option-label">Videos</span>
        </label>
        <label class="filter-option">
          <input type="checkbox" checked data-filter="checklist">
          <span class="option-label">Checklists</span>
        </label>
        <label class="filter-option">
          <input type="checkbox" checked data-filter="guide">
          <span class="option-label">Guides</span>
        </label>
        <label class="filter-option">
          <input type="checkbox" checked data-filter="template">
          <span class="option-label">Templates</span>
        </label>
      </div>
    </div>
    
    <div class="filter-group">
      <label class="filter-label">Country</label>
      <select class="country-filter">
        <option value="all">All Countries</option>
        {{#each countries}}
        <option value="{{countryCode}}">{{countryName}}</option>
        {{/each}}
      </select>
    </div>
    
    <div class="filter-group">
      <label class="filter-label">Topic</label>
      <select class="topic-filter">
        <option value="all">All Topics</option>
        <option value="getting-started">Getting Started</option>
        <option value="document-preparation">Document Preparation</option>
        <option value="language-tests">Language Tests</option>
        <option value="education-assessment">Education Assessment</option>
        <option value="work-experience">Work Experience</option>
        <option value="financial-planning">Financial Planning</option>
        <option value="application-process">Application Process</option>
        <option value="interview-preparation">Interview Preparation</option>
        <option value="arrival-settlement">Arrival & Settlement</option>
      </select>
    </div>
  </div>
  
  <div class="resource-collections">
    <div class="collection">
      <div class="collection-header">
        <h3 class="collection-title">Recommended for You</h3>
        <a href="#" class="view-all">View All</a>
      </div>
      
      <div class="resource-carousel">
        <button class="carousel-control prev">
          <svg><!-- Previous icon --></svg>
        </button>
        
        <div class="carousel-items">
          {{#each recommendedResources}}
          <div class="resource-card {{resourceType}}">
            <div class="resource-thumbnail">
              <img src="{{thumbnailUrl}}" alt="{{title}} thumbnail">
              <div class="resource-type-badge">{{resourceTypeLabel}}</div>
              {{#if isPremium}}
              <div class="premium-badge">Premium</div>
              {{/if}}
            </div>
            
            <div class="resource-content">
              <h4 class="resource-title">{{title}}</h4>
              <p class="resource-description">{{description}}</p>
            </div>
            
            <div class="resource-meta">
              <div class="meta-item">
                <svg><!-- Time icon --></svg>
                <span class="meta-text">{{readingTime}} min</span>
              </div>
              <div class="meta-item">
                <svg><!-- Rating icon --></svg>
                <span class="meta-text">{{rating}}/5</span>
              </div>
            </div>
            
            <div class="resource-actions">
              <button class="primary-action">View Resource</button>
              <button class="secondary-action">Save</button>
            </div>
          </div>
          {{/each}}
        </div>
        
        <button class="carousel-control next">
          <svg><!-- Next icon --></svg>
        </button>
      </div>
    </div>
    
    <div class="collection">
      <div class="collection-header">
        <h3 class="collection-title">Getting Started Guides</h3>
        <a href="#" class="view-all">View All</a>
      </div>
      
      <div class="resource-carousel">
        <!-- Similar structure to the previous carousel -->
      </div>
    </div>
    
    <div class="collection">
      <div class="collection-header">
        <h3 class="collection-title">Popular Resources</h3>
        <a href="#" class="view-all">View All</a>
      </div>
      
      <div class="resource-carousel">
        <!-- Similar structure to the previous carousel -->
      </div>
    </div>
  </div>
</section>
```

### 2. Resource Detail View

```html
<section class="resource-detail">
  <div class="resource-header">
    <div class="breadcrumb">
      <a href="/resources">Resources</a> &gt;
      <a href="/resources/{{resourceCategory}}">{{resourceCategoryName}}</a> &gt;
      <span class="current-page">{{resourceTitle}}</span>
    </div>
    
    <div class="resource-title-section">
      <h2 class="resource-title">{{resourceTitle}}</h2>
      <div class="resource-meta">
        <span class="resource-type {{resourceTypeClass}}">{{resourceTypeLabel}}</span>
        <span class="resource-date">Published: {{publishDate}}</span>
        <span class="resource-author">By: {{authorName}}</span>
      </div>
    </div>
    
    <div class="resource-actions">
      <button class="save-resource-btn {{#if isSaved}}saved{{/if}}">
        <svg><!-- Save icon --></svg>
        <span class="btn-text">{{#if isSaved}}Saved{{else}}Save{{/if}}</span>
      </button>
      <button class="share-resource-btn">
        <svg><!-- Share icon --></svg>
        <span class="btn-text">Share</span>
      </button>
      <button class="print-resource-btn">
        <svg><!-- Print icon --></svg>
        <span class="btn-text">Print</span>
      </button>
    </div>
  </div>
  
  <div class="resource-content">
    {{#if resourceThumbnail}}
    <div class="resource-featured-image">
      <img src="{{resourceThumbnail}}" alt="{{resourceTitle}}">
    </div>
    {{/if}}
    
    <div class="content-body">
      {{{resourceContent}}}
    </div>
    
    {{#if hasAttachments}}
    <div class="resource-attachments">
      <h4 class="attachments-title">Attachments</h4>
      <ul class="attachment-list">
        {{#each attachments}}
        <li class="attachment-item">
          <div class="attachment-icon">
            <svg><!-- File type icon --></svg>
          </div>
          <div class="attachment-details">
            <div class="attachment-name">{{attachmentName}}</div>
            <div class="attachment-meta">{{attachmentType}} • {{attachmentSize}}</div>
          </div>
          <button class="download-attachment-btn">Download</button>
        </li>
        {{/each}}
      </ul>
    </div>
    {{/if}}
    
    <div class="resource-tags">
      <div class="tags-label">Related Topics:</div>
      <div class="tags-list">
        {{#each tags}}
        <a href="/resources/tag/{{tagSlug}}" class="tag-item">{{tagName}}</a>
        {{/each}}
      </div>
    </div>
  </div>
  
  <div class="resource-footer">
    <div class="resource-rating">
      <div class="rating-label">Was this resource helpful?</div>
      <div class="rating-stars">
        <button class="star-btn" data-rating="1">
          <svg><!-- Star icon --></svg>
        </button>
        <button class="star-btn" data-rating="2">
          <svg><!-- Star icon --></svg>
        </button>
        <button class="star-btn" data-rating="3">
          <svg><!-- Star icon --></svg>
        </button>
        <button class="star-btn" data-rating="4">
          <svg><!-- Star icon --></svg>
        </button>
        <button class="star-btn" data-rating="5">
          <svg><!-- Star icon --></svg>
        </button>
      </div>
      <button class="submit-rating-btn">Submit Rating</button>
    </div>
    
    <div class="related-resources">
      <h4 class="related-title">Related Resources</h4>
      <div class="related-items">
        {{#each relatedResources}}
        <a href="/resources/{{resourceId}}" class="related-item">
          <div class="related-thumbnail">
            <img src="{{thumbnailUrl}}" alt="{{title}} thumbnail">
          </div>
          <div class="related-details">
            <div class="related-resource-title">{{title}}</div>
            <div class="related-resource-type">{{resourceTypeLabel}}</div>
          </div>
        </a>
        {{/each}}
      </div>
    </div>
  </div>
</section>
```
