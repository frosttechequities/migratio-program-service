# Migratio User Profile Management Specification - Part 2

## User Interface Components

The user profile management system includes several key interface components to facilitate data collection and management:

### 1. Profile Setup Wizard

The profile setup wizard guides new users through the initial profile creation process:

```html
<div class="profile-setup-wizard">
  <div class="wizard-header">
    <h1>Complete Your Profile</h1>
    <p class="wizard-description">
      Let's gather some information to help find the best immigration pathways for you.
      You can save your progress and return anytime.
    </p>
  </div>
  
  <div class="progress-tracker">
    <div class="progress-bar">
      <div class="progress-fill" style="width: {{completionPercentage}}%"></div>
    </div>
    <div class="progress-steps">
      {{#each sections}}
      <div class="progress-step {{status}}">
        <div class="step-indicator">
          {{#if isCompleted}}
          <svg class="check-icon"><!-- Check icon --></svg>
          {{else}}
          <span class="step-number">{{stepNumber}}</span>
          {{/if}}
        </div>
        <div class="step-label">{{sectionName}}</div>
      </div>
      {{/each}}
    </div>
  </div>
  
  <div class="wizard-content">
    <form class="profile-section-form" id="{{currentSection.id}}">
      <h2 class="section-title">{{currentSection.title}}</h2>
      <p class="section-description">{{currentSection.description}}</p>
      
      <div class="form-fields">
        {{#each currentSection.fields}}
        <div class="form-field {{fieldType}}">
          <label for="{{fieldId}}">
            {{fieldLabel}}
            {{#if isRequired}}<span class="required-indicator">*</span>{{/if}}
          </label>
          
          {{#if helpText}}
          <div class="field-help-tooltip">
            <button type="button" class="help-icon" aria-label="Help information">?</button>
            <div class="tooltip-content">{{helpText}}</div>
          </div>
          {{/if}}
          
          {{#if fieldType === 'text'}}
          <input type="text" id="{{fieldId}}" name="{{fieldName}}" 
                 value="{{fieldValue}}" {{#if isRequired}}required{{/if}}
                 placeholder="{{placeholder}}">
          {{/if}}
          
          {{#if fieldType === 'select'}}
          <select id="{{fieldId}}" name="{{fieldName}}" {{#if isRequired}}required{{/if}}>
            <option value="">Select an option</option>
            {{#each options}}
            <option value="{{value}}" {{#if isSelected}}selected{{/if}}>{{label}}</option>
            {{/each}}
          </select>
          {{/if}}
          
          {{#if fieldType === 'date'}}
          <input type="date" id="{{fieldId}}" name="{{fieldName}}" 
                 value="{{fieldValue}}" {{#if isRequired}}required{{/if}}>
          {{/if}}
          
          {{#if fieldType === 'radio'}}
          <div class="radio-options">
            {{#each options}}
            <label class="radio-option">
              <input type="radio" name="{{../fieldName}}" value="{{value}}" 
                     {{#if isSelected}}checked{{/if}} {{#if ../isRequired}}required{{/if}}>
              <span class="option-label">{{label}}</span>
            </label>
            {{/each}}
          </div>
          {{/if}}
          
          {{#if fieldType === 'checkbox'}}
          <div class="checkbox-options">
            {{#each options}}
            <label class="checkbox-option">
              <input type="checkbox" name="{{../fieldName}}[]" value="{{value}}" 
                     {{#if isSelected}}checked{{/if}}>
              <span class="option-label">{{label}}</span>
            </label>
            {{/each}}
          </div>
          {{/if}}
          
          {{#if fieldType === 'file'}}
          <div class="file-upload-control">
            <input type="file" id="{{fieldId}}" name="{{fieldName}}" 
                   accept="{{acceptedFileTypes}}" {{#if isRequired}}required{{/if}}
                   class="file-input">
            <label for="{{fieldId}}" class="file-upload-button">
              <svg class="upload-icon"><!-- Upload icon --></svg>
              <span class="button-text">Choose File</span>
            </label>
            <div class="file-name">No file chosen</div>
          </div>
          {{/if}}
          
          {{#if fieldType === 'textarea'}}
          <textarea id="{{fieldId}}" name="{{fieldName}}" 
                    placeholder="{{placeholder}}" {{#if isRequired}}required{{/if}}
                    rows="{{rows}}">{{fieldValue}}</textarea>
          {{/if}}
          
          {{#if validationError}}
          <div class="validation-error">{{validationError}}</div>
          {{/if}}
        </div>
        {{/each}}
      </div>
      
      <div class="dynamic-field-group" data-group-type="{{dynamicGroupType}}">
        {{#each dynamicFields}}
        <div class="dynamic-field-item">
          <!-- Dynamic field content similar to above -->
          <button type="button" class="remove-item-btn">Remove</button>
        </div>
        {{/each}}
        <button type="button" class="add-item-btn">Add Another {{dynamicItemLabel}}</button>
      </div>
      
      <div class="form-actions">
        <button type="button" class="secondary-button" data-action="save">Save & Exit</button>
        <button type="button" class="secondary-button" data-action="back" {{#unless hasPreviousSection}}disabled{{/unless}}>Back</button>
        <button type="submit" class="primary-button" data-action="next">
          {{#if isLastSection}}Complete Profile{{else}}Next{{/if}}
        </button>
      </div>
    </form>
  </div>
</div>
```

### 2. Profile Dashboard

The profile dashboard provides an overview of the user's profile completion status and quick access to edit sections:

```html
<div class="profile-dashboard">
  <div class="dashboard-header">
    <h1>Your Profile</h1>
    <div class="profile-actions">
      <button class="secondary-button" data-action="export-profile">
        <svg class="export-icon"><!-- Export icon --></svg>
        Export Data
      </button>
      <button class="primary-button" data-action="edit-profile">
        <svg class="edit-icon"><!-- Edit icon --></svg>
        Edit Profile
      </button>
    </div>
  </div>
  
  <div class="profile-completion-summary">
    <div class="completion-stats">
      <div class="completion-percentage">
        <svg class="circular-progress" viewBox="0 0 36 36">
          <!-- SVG circular progress indicator -->
          <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="circle-fill" stroke-dasharray="{{completionPercentage}}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div class="percentage-text">{{completionPercentage}}%</div>
      </div>
      <div class="completion-message">
        {{#if isComplete}}
        Your profile is complete!
        {{else}}
        Complete your profile to get better recommendations
        {{/if}}
      </div>
    </div>
    
    <div class="section-completion-list">
      {{#each profileSections}}
      <div class="section-completion-item {{#if isComplete}}complete{{/if}}">
        <div class="section-info">
          <div class="section-icon">
            <svg><!-- Section-specific icon --></svg>
          </div>
          <div class="section-details">
            <h3 class="section-name">{{sectionName}}</h3>
            <div class="section-completion">
              <div class="section-progress-bar">
                <div class="progress-fill" style="width: {{completionPercentage}}%"></div>
              </div>
              <span class="completion-text">{{completionPercentage}}% Complete</span>
            </div>
          </div>
        </div>
        <button class="edit-section-btn" data-section="{{sectionId}}">
          <svg class="edit-icon"><!-- Edit icon --></svg>
          Edit
        </button>
      </div>
      {{/each}}
    </div>
  </div>
  
  <div class="profile-recommendations">
    <h2>Profile Recommendations</h2>
    <div class="recommendation-items">
      {{#each profileRecommendations}}
      <div class="recommendation-item">
        <div class="recommendation-icon">
          <svg><!-- Recommendation-specific icon --></svg>
        </div>
        <div class="recommendation-content">
          <h3 class="recommendation-title">{{title}}</h3>
          <p class="recommendation-description">{{description}}</p>
        </div>
        <button class="action-button" data-action="{{actionType}}" data-target="{{actionTarget}}">
          {{actionText}}
        </button>
      </div>
      {{/each}}
    </div>
  </div>
</div>
```

### 3. Section Editor

The section editor allows users to update specific sections of their profile:

```html
<div class="profile-section-editor">
  <div class="editor-header">
    <button class="back-button" data-action="back-to-dashboard">
      <svg class="back-icon"><!-- Back icon --></svg>
      Back to Profile
    </button>
    <h1>Edit {{sectionName}}</h1>
    <div class="last-updated">Last updated: {{lastUpdatedDate}}</div>
  </div>
  
  <form class="section-edit-form">
    <!-- Form fields similar to the wizard, but focused on a specific section -->
    
    <div class="form-fields">
      <!-- Section-specific fields -->
    </div>
    
    <div class="form-actions">
      <button type="button" class="secondary-button" data-action="cancel">Cancel</button>
      <button type="submit" class="primary-button" data-action="save">Save Changes</button>
    </div>
  </form>
</div>
```

### 4. Document Upload Interface

The document upload interface facilitates the management of supporting documents:

```html
<div class="document-upload-interface">
  <div class="interface-header">
    <h2>Upload Supporting Documents</h2>
    <p class="interface-description">
      Upload documents to verify your information and strengthen your immigration applications.
      Accepted formats: PDF, JPG, PNG (max 10MB per file)
    </p>
  </div>
  
  <div class="document-categories">
    <div class="category-tabs">
      {{#each documentCategories}}
      <button class="category-tab {{#if isActive}}active{{/if}}" data-category="{{categoryId}}">
        {{categoryName}}
        {{#if hasRequiredDocuments}}
        <span class="required-indicator">*</span>
        {{/if}}
      </button>
      {{/each}}
    </div>
    
    <div class="category-content">
      <div class="document-list">
        {{#each categoryDocuments}}
        <div class="document-item {{documentStatus}}">
          <div class="document-info">
            <h3 class="document-name">
              {{documentName}}
              {{#if isRequired}}<span class="required-indicator">*</span>{{/if}}
            </h3>
            <p class="document-description">{{documentDescription}}</p>
            
            {{#if acceptedFormats}}
            <div class="format-info">
              Accepted formats: {{acceptedFormats}}
            </div>
            {{/if}}
            
            {{#if expiryRequired}}
            <div class="expiry-info">
              Expiry date required
            </div>
            {{/if}}
          </div>
          
          <div class="document-status-area">
            {{#if isUploaded}}
            <div class="uploaded-document">
              <div class="document-preview">
                <img src="{{documentThumbnail}}" alt="{{documentName}} preview">
              </div>
              <div class="document-details">
                <div class="document-filename">{{fileName}}</div>
                <div class="upload-date">Uploaded: {{uploadDate}}</div>
                {{#if expiryDate}}
                <div class="expiry-date {{#if isExpiringSoon}}expiring-soon{{/if}} {{#if isExpired}}expired{{/if}}">
                  Expires: {{expiryDate}}
                </div>
                {{/if}}
              </div>
              <div class="document-actions">
                <button class="view-document-btn" data-document-id="{{documentId}}">View</button>
                <button class="replace-document-btn" data-document-id="{{documentId}}">Replace</button>
                <button class="delete-document-btn" data-document-id="{{documentId}}">Delete</button>
              </div>
            </div>
            {{else}}
            <div class="upload-area">
              <div class="upload-dropzone" data-document-type="{{documentType}}">
                <svg class="upload-icon"><!-- Upload icon --></svg>
                <div class="dropzone-text">
                  <span class="primary-text">Drag & drop your file here</span>
                  <span class="secondary-text">or</span>
                </div>
                <button class="browse-files-btn">Browse Files</button>
                <input type="file" class="file-input" accept="{{acceptedFileTypes}}" hidden>
              </div>
              
              {{#if expiryRequired}}
              <div class="expiry-date-input">
                <label for="expiry-date-{{documentId}}">Document Expiry Date</label>
                <input type="date" id="expiry-date-{{documentId}}" name="expiryDate" min="{{minExpiryDate}}">
              </div>
              {{/if}}
            </div>
            {{/if}}
          </div>
        </div>
        {{/each}}
      </div>
    </div>
  </div>
  
  <div class="upload-progress-area">
    <h3>Upload Progress</h3>
    {{#if activeUploads}}
    <div class="active-uploads">
      {{#each activeUploads}}
      <div class="upload-progress-item">
        <div class="file-info">
          <div class="file-name">{{fileName}}</div>
          <div class="file-size">{{fileSize}}</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: {{uploadProgress}}%"></div>
        </div>
        <div class="progress-percentage">{{uploadProgress}}%</div>
        <button class="cancel-upload-btn" data-upload-id="{{uploadId}}">Cancel</button>
      </div>
      {{/each}}
    </div>
    {{else}}
    <div class="no-active-uploads">No active uploads</div>
    {{/if}}
  </div>
</div>
```

### 5. Profile Completeness Widget

The profile completeness widget provides a persistent indicator of profile status:

```html
<div class="profile-completeness-widget">
  <div class="widget-header">
    <h3>Profile Completeness</h3>
    <div class="completion-percentage">{{completionPercentage}}%</div>
  </div>
  
  <div class="progress-bar">
    <div class="progress-fill" style="width: {{completionPercentage}}%"></div>
  </div>
  
  <div class="incomplete-sections">
    {{#if hasIncompleteSections}}
    <h4>Sections to Complete</h4>
    <ul class="section-list">
      {{#each incompleteSections}}
      <li class="section-item">
        <span class="section-name">{{sectionName}}</span>
        <span class="section-completion">{{completionPercentage}}%</span>
        <a href="/profile/edit/{{sectionId}}" class="complete-section-link">Complete</a>
      </li>
      {{/each}}
    </ul>
    {{else}}
    <div class="all-complete-message">
      <svg class="check-icon"><!-- Check icon --></svg>
      All sections complete!
    </div>
    {{/if}}
  </div>
  
  <div class="widget-footer">
    <a href="/profile" class="view-profile-link">View Full Profile</a>
  </div>
</div>
```

### 6. Data Export Interface

The data export interface allows users to download their profile data:

```html
<div class="data-export-interface">
  <div class="interface-header">
    <h2>Export Your Data</h2>
    <p class="interface-description">
      Download your profile data in various formats for your records or to use with other services.
    </p>
  </div>
  
  <div class="export-options">
    <div class="export-option">
      <div class="option-icon">
        <svg><!-- PDF icon --></svg>
      </div>
      <div class="option-details">
        <h3 class="option-title">PDF Format</h3>
        <p class="option-description">
          A human-readable document containing all your profile information.
          Ideal for printing or sharing with immigration consultants.
        </p>
      </div>
      <button class="export-button" data-format="pdf">
        <svg class="download-icon"><!-- Download icon --></svg>
        Export as PDF
      </button>
    </div>
    
    <div class="export-option">
      <div class="option-icon">
        <svg><!-- JSON icon --></svg>
      </div>
      <div class="option-details">
        <h3 class="option-title">JSON Format</h3>
        <p class="option-description">
          A machine-readable format containing all your profile data.
          Useful for importing into other digital systems.
        </p>
      </div>
      <button class="export-button" data-format="json">
        <svg class="download-icon"><!-- Download icon --></svg>
        Export as JSON
      </button>
    </div>
    
    <div class="export-option">
      <div class="option-icon">
        <svg><!-- CSV icon --></svg>
      </div>
      <div class="option-details">
        <h3 class="option-title">CSV Format</h3>
        <p class="option-description">
          A spreadsheet-compatible format for your profile data.
          Useful for analysis or importing into spreadsheet applications.
        </p>
      </div>
      <button class="export-button" data-format="csv">
        <svg class="download-icon"><!-- Download icon --></svg>
        Export as CSV
      </button>
    </div>
  </div>
  
  <div class="export-history">
    <h3>Previous Exports</h3>
    {{#if hasExportHistory}}
    <table class="export-history-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Format</th>
          <th>File Size</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {{#each exportHistory}}
        <tr>
          <td>{{exportDate}}</td>
          <td>{{exportFormat}}</td>
          <td>{{fileSize}}</td>
          <td>
            <button class="download-again-btn" data-export-id="{{exportId}}">
              Download Again
            </button>
          </td>
        </tr>
        {{/each}}
      </tbody>
    </table>
    {{else}}
    <div class="no-history-message">
      You haven't exported your data yet.
    </div>
    {{/if}}
  </div>
</div>
```
