# Migratio User Profile Management Specification - Part 4

## Technical Implementation

### Frontend Architecture

The frontend implementation of the profile management system uses a component-based architecture:

```javascript
// React component structure for profile management
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUserProfile, 
  updateProfileSection,
  calculateProfileCompleteness,
  uploadDocument
} from '../actions/profileActions';

// Profile Dashboard Component
const ProfileDashboard = () => {
  const dispatch = useDispatch();
  const { 
    profile, 
    isLoading, 
    error, 
    completeness 
  } = useSelector(state => state.profile);
  
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div className="profile-dashboard">
      <ProfileHeader 
        firstName={profile.personalInfo?.firstName}
        lastName={profile.personalInfo?.lastName}
        completionPercentage={completeness.overallCompletion}
      />
      
      <ProfileCompletionSummary 
        completeness={completeness}
        onSectionClick={sectionId => navigateToSection(sectionId)}
      />
      
      <ProfileSectionList 
        sections={getSectionData(profile, completeness)}
        onEditSection={sectionId => navigateToSection(sectionId)}
      />
      
      <ProfileRecommendations 
        recommendations={completeness.improvementSuggestions}
        onActionClick={handleRecommendationAction}
      />
    </div>
  );
};

// Profile Section Editor Component
const ProfileSectionEditor = ({ sectionId }) => {
  const dispatch = useDispatch();
  const { 
    profile, 
    isLoading, 
    isSaving, 
    error 
  } = useSelector(state => state.profile);
  
  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  
  useEffect(() => {
    if (profile && profile[sectionId]) {
      setFormData(profile[sectionId]);
    }
  }, [profile, sectionId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const errors = validateSectionData(sectionId, formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Submit changes
    try {
      await dispatch(updateProfileSection(sectionId, formData));
      showSuccessNotification(`${getSectionName(sectionId)} updated successfully`);
      navigateBack();
    } catch (error) {
      setValidationErrors({ form: error.message });
    }
  };
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="profile-section-editor">
      <EditorHeader 
        sectionName={getSectionName(sectionId)}
        onBackClick={navigateBack}
      />
      
      <form onSubmit={handleSubmit}>
        <SectionFormFields 
          sectionId={sectionId}
          formData={formData}
          errors={validationErrors}
          onChange={handleInputChange}
        />
        
        {error && <ErrorMessage message={error} />}
        
        <div className="form-actions">
          <button 
            type="button" 
            className="secondary-button" 
            onClick={navigateBack}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="primary-button"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Document Upload Component
const DocumentUploader = ({ documentType, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    const documentTypeConfig = getDocumentTypeConfig(documentType);
    
    // Validate file type
    if (!documentTypeConfig.allowedMimeTypes.includes(file.type)) {
      setError(`Invalid file type. Allowed types: ${documentTypeConfig.allowedFileTypes.join(', ')}`);
      return;
    }
    
    // Validate file size
    if (file.size > documentTypeConfig.maxSizeBytes) {
      setError(`File too large. Maximum size: ${documentTypeConfig.maxSizeBytes / 1024 / 1024}MB`);
      return;
    }
    
    // Validate expiry date if required
    if (documentTypeConfig.expiryRequired && !expiryDate) {
      setError('Please provide an expiry date for this document');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      await dispatch(uploadDocument(documentType, file, expiryDate, {
        onProgress: (progress) => setUploadProgress(progress)
      }));
      
      setIsUploading(false);
      setFile(null);
      setExpiryDate('');
      setUploadProgress(0);
      
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      showSuccessNotification('Document uploaded successfully');
    } catch (error) {
      setIsUploading(false);
      setError(error.message);
    }
  };
  
  return (
    <div className="document-uploader">
      <div 
        className="upload-dropzone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {!file ? (
          <>
            <div className="dropzone-icon">
              <svg><!-- Upload icon --></svg>
            </div>
            <div className="dropzone-text">
              <span className="primary-text">Drag & drop your file here</span>
              <span className="secondary-text">or</span>
            </div>
            <button 
              type="button"
              className="browse-files-btn"
              onClick={() => document.getElementById('file-input').click()}
            >
              Browse Files
            </button>
            <input 
              type="file"
              id="file-input"
              className="file-input"
              onChange={handleFileChange}
              accept={getDocumentTypeConfig(documentType).acceptedFileTypes}
              hidden
            />
          </>
        ) : (
          <div className="selected-file">
            <div className="file-icon">
              <svg><!-- File type icon --></svg>
            </div>
            <div className="file-details">
              <div className="file-name">{file.name}</div>
              <div className="file-size">{formatFileSize(file.size)}</div>
            </div>
            <button 
              type="button"
              className="remove-file-btn"
              onClick={() => setFile(null)}
              disabled={isUploading}
            >
              <svg><!-- Remove icon --></svg>
            </button>
          </div>
        )}
      </div>
      
      {getDocumentTypeConfig(documentType).expiryRequired && (
        <div className="expiry-date-input">
          <label htmlFor="expiry-date">Document Expiry Date</label>
          <input 
            type="date"
            id="expiry-date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            min={getTomorrowDate()}
            disabled={isUploading}
          />
        </div>
      )}
      
      {error && <div className="upload-error">{error}</div>}
      
      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="progress-percentage">{uploadProgress}%</div>
        </div>
      )}
      
      <div className="upload-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => setFile(null)}
          disabled={!file || isUploading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={handleUpload}
          disabled={!file || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
};
```

### Backend Services

The backend implementation consists of several microservices that work together to manage user profiles:

```javascript
// Profile Service API (Node.js/Express)
const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');
const DocumentController = require('../controllers/DocumentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Profile routes
router.get(
  '/profile',
  authenticate,
  ProfileController.getUserProfile
);

router.get(
  '/profile/completeness',
  authenticate,
  ProfileController.getProfileCompleteness
);

router.put(
  '/profile/:section',
  authenticate,
  validateProfileUpdate,
  ProfileController.updateProfileSection
);

router.post(
  '/profile/export',
  authenticate,
  ProfileController.exportUserProfile
);

// Document routes
router.get(
  '/documents',
  authenticate,
  DocumentController.getUserDocuments
);

router.get(
  '/documents/:documentId',
  authenticate,
  DocumentController.getDocument
);

router.post(
  '/documents/upload',
  authenticate,
  upload.single('file'),
  DocumentController.uploadDocument
);

router.delete(
  '/documents/:documentId',
  authenticate,
  DocumentController.deleteDocument
);

// Privacy routes
router.get(
  '/privacy/consents',
  authenticate,
  ProfileController.getUserConsents
);

router.put(
  '/privacy/consents/:consentType',
  authenticate,
  ProfileController.updateConsent
);

router.post(
  '/privacy/data-deletion',
  authenticate,
  ProfileController.requestDataDeletion
);

module.exports = router;
```

### Data Flow

The profile management system implements a clear data flow for managing user information:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Interface │────▶│  Profile API    │────▶│  Profile        │
│                 │     │  Gateway        │     │  Service        │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Recommendation │◀────│  Event Bus      │◀────│  Profile        │
│  Engine         │     │                 │     │  Database       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       │                        ▲                        │
       │                        │                        │
       ▼                        │                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Document       │     │  Roadmap        │     │  Document       │
│  Management     │────▶│  Service        │◀────│  Storage        │
│  Service        │     │                 │     │  Service        │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **User Interface** sends profile updates and document uploads to the API Gateway
2. **Profile API Gateway** validates requests and routes them to appropriate services
3. **Profile Service** processes profile data and stores it in the Profile Database
4. **Profile Database** triggers events when profile data changes
5. **Event Bus** distributes profile update events to dependent services
6. **Recommendation Engine** receives profile updates to recalculate recommendations
7. **Document Management Service** handles document uploads and verification
8. **Document Storage Service** securely stores and retrieves user documents
9. **Roadmap Service** updates user roadmaps based on profile changes

## Performance Optimization

### Caching Strategy

The profile management system implements a multi-level caching strategy:

```javascript
// Profile caching service
class ProfileCachingService {
  constructor() {
    this.redisClient = new RedisClient();
    this.localCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
    this.profileRepository = new ProfileRepository();
  }
  
  async getProfileById(userId, options = {}) {
    const { bypassCache = false, sections = null } = options;
    
    // Generate cache key
    const cacheKey = this.generateProfileCacheKey(userId, sections);
    
    // Check if bypassing cache
    if (bypassCache) {
      return await this.fetchAndCacheProfile(userId, sections);
    }
    
    // Try local cache first for fastest access
    const localCacheResult = this.localCache.get(cacheKey);
    if (localCacheResult) {
      return localCacheResult;
    }
    
    // Try Redis cache next
    try {
      const redisCacheResult = await this.redisClient.get(cacheKey);
      if (redisCacheResult) {
        // Parse the cached data
        const profileData = JSON.parse(redisCacheResult);
        
        // Store in local cache for future requests
        this.localCache.set(cacheKey, profileData);
        
        return profileData;
      }
    } catch (error) {
      console.warn('Redis cache error:', error);
      // Continue to database if Redis fails
    }
    
    // Fetch from database and cache
    return await this.fetchAndCacheProfile(userId, sections);
  }
  
  async fetchAndCacheProfile(userId, sections = null) {
    // Fetch profile from database
    const profile = sections 
      ? await this.profileRepository.getProfileSections(userId, sections)
      : await this.profileRepository.getFullProfile(userId);
    
    if (!profile) {
      return null;
    }
    
    // Generate cache key
    const cacheKey = this.generateProfileCacheKey(userId, sections);
    
    // Cache in Redis
    try {
      await this.redisClient.set(
        cacheKey,
        JSON.stringify(profile),
        'EX',
        3600 // 1 hour expiration
      );
    } catch (error) {
      console.warn('Redis cache set error:', error);
    }
    
    // Cache locally
    this.localCache.set(cacheKey, profile);
    
    return profile;
  }
  
  async invalidateProfileCache(userId, sections = null) {
    // Generate cache key patterns
    const cacheKeys = this.generateCacheInvalidationKeys(userId, sections);
    
    // Invalidate Redis cache
    try {
      for (const key of cacheKeys) {
        await this.redisClient.del(key);
      }
    } catch (error) {
      console.warn('Redis cache invalidation error:', error);
    }
    
    // Invalidate local cache
    for (const key of cacheKeys) {
      this.localCache.del(key);
    }
  }
  
  generateProfileCacheKey(userId, sections = null) {
    if (!sections || sections.length === 0) {
      return `profile:${userId}:full`;
    }
    
    const sectionKey = Array.isArray(sections) 
      ? sections.sort().join('-')
      : sections;
      
    return `profile:${userId}:sections:${sectionKey}`;
  }
  
  generateCacheInvalidationKeys(userId, sections = null) {
    const keys = [`profile:${userId}:full`];
    
    if (sections && sections.length > 0) {
      // Add specific section keys
      if (Array.isArray(sections)) {
        const sectionKey = sections.sort().join('-');
        keys.push(`profile:${userId}:sections:${sectionKey}`);
      } else {
        keys.push(`profile:${userId}:sections:${sections}`);
      }
    } else {
      // If no specific sections, invalidate all section patterns
      keys.push(`profile:${userId}:sections:*`);
    }
    
    return keys;
  }
}
```

### Lazy Loading

The profile management system implements lazy loading for efficient data retrieval:

```javascript
// Profile lazy loading implementation
function useProfileSection(sectionId) {
  const dispatch = useDispatch();
  const { 
    profile, 
    loadedSections, 
    isLoading 
  } = useSelector(state => state.profile);
  
  useEffect(() => {
    // Check if section is already loaded
    if (!loadedSections.includes(sectionId) && !isLoading) {
      dispatch(fetchProfileSection(sectionId));
    }
  }, [sectionId, loadedSections, isLoading, dispatch]);
  
  return {
    sectionData: profile[sectionId] || null,
    isLoading: isLoading && !loadedSections.includes(sectionId),
    isLoaded: loadedSections.includes(sectionId)
  };
}

// Lazy loading document list
function useUserDocuments(options = {}) {
  const { 
    pageSize = 10, 
    initialPage = 1,
    filters = {}
  } = options;
  
  const [page, setPage] = useState(initialPage);
  const [documents, setDocuments] = useState([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await documentService.getUserDocuments({
        page,
        pageSize,
        ...filters
      });
      
      setDocuments(prevDocs => {
        // If first page or filter/sort changed, replace documents
        if (page === 1) {
          return result.documents;
        }
        
        // Otherwise append to existing documents
        return [...prevDocs, ...result.documents];
      });
      
      setTotalDocuments(result.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, filters]);
  
  // Load documents when dependencies change
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);
  
  // Function to load more documents
  const loadMore = useCallback(() => {
    if (documents.length < totalDocuments && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [documents.length, totalDocuments, isLoading]);
  
  return {
    documents,
    totalDocuments,
    isLoading,
    error,
    loadMore,
    hasMore: documents.length < totalDocuments,
    refresh: () => setPage(1)
  };
}
```

## Testing Strategy

### Unit Testing

```javascript
// Jest unit tests for profile validation
describe('Profile Validation', () => {
  describe('validatePersonalInfo', () => {
    test('should validate complete personal info', () => {
      const personalInfo = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        nationality: [{ countryId: 'us', isPrimary: true }],
        currentResidence: {
          countryId: 'ca',
          region: 'Ontario',
          city: 'Toronto',
          since: '2018-05-01'
        },
        maritalStatus: 'single',
        contactInformation: {
          email: 'john.doe@example.com',
          phone: '+1234567890'
        }
      };
      
      const result = validatePersonalInfo(personalInfo);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
    
    test('should return errors for missing required fields', () => {
      const personalInfo = {
        firstName: 'John',
        // lastName missing
        dateOfBirth: '1990-01-01',
        // nationality missing
        currentResidence: {
          countryId: 'ca',
          // region missing
          city: 'Toronto'
          // since missing
        },
        maritalStatus: 'single',
        contactInformation: {
          // email missing
          phone: '+1234567890'
        }
      };
      
      const result = validatePersonalInfo(personalInfo);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('lastName');
      expect(result.errors).toHaveProperty('nationality');
      expect(result.errors).toHaveProperty('currentResidence.region');
      expect(result.errors).toHaveProperty('currentResidence.since');
      expect(result.errors).toHaveProperty('contactInformation.email');
    });
    
    test('should validate email format', () => {
      const personalInfo = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        nationality: [{ countryId: 'us', isPrimary: true }],
        currentResidence: {
          countryId: 'ca',
          region: 'Ontario',
          city: 'Toronto',
          since: '2018-05-01'
        },
        maritalStatus: 'single',
        contactInformation: {
          email: 'invalid-email',
          phone: '+1234567890'
        }
      };
      
      const result = validatePersonalInfo(personalInfo);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty('contactInformation.email');
      expect(result.errors['contactInformation.email']).toMatch(/valid email/i);
    });
    
    // Additional tests...
  });
  
  // Tests for other profile sections...
});
```

### Integration Testing

```javascript
// Cypress integration tests for profile management
describe('Profile Management', () => {
  beforeEach(() => {
    // Log in before each test
    cy.login();
    
    // Intercept API calls
    cy.intercept('GET', '/api/profile').as('getProfile');
    cy.intercept('PUT', '/api/profile/*').as('updateProfile');
    cy.intercept('GET', '/api/profile/completeness').as('getCompleteness');
  });
  
  it('should display profile dashboard with completeness information', () => {
    cy.visit('/profile');
    cy.wait('@getProfile');
    cy.wait('@getCompleteness');
    
    cy.get('.profile-dashboard').should('exist');
    cy.get('.completion-percentage').should('exist');
    cy.get('.section-completion-item').should('have.length.at.least', 5);
  });
  
  it('should navigate to section editor when clicking edit', () => {
    cy.visit('/profile');
    cy.wait('@getProfile');
    
    // Click edit on personal information section
    cy.get('.section-completion-item')
      .contains('Personal Information')
      .parent()
      .find('.edit-section-btn')
      .click();
    
    // Verify navigation to editor
    cy.url().should('include', '/profile/edit/personalInfo');
    cy.get('.profile-section-editor').should('exist');
    cy.get('form').should('exist');
  });
  
  it('should update profile section successfully', () => {
    cy.visit('/profile/edit/personalInfo');
    cy.wait('@getProfile');
    
    // Update form fields
    cy.get('input[name="firstName"]').clear().type('Updated');
    cy.get('input[name="lastName"]').clear().type('Name');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    cy.wait('@updateProfile');
    
    // Verify success notification
    cy.get('.notification.success').should('exist');
    
    // Verify navigation back to profile dashboard
    cy.url().should('include', '/profile');
    
    // Verify updated data is displayed
    cy.get('.profile-summary').should('contain', 'Updated Name');
  });
  
  it('should upload document successfully', () => {
    cy.visit('/profile/documents');
    
    // Intercept document upload request
    cy.intercept('POST', '/api/documents/upload').as('uploadDocument');
    
    // Find passport document type and click upload
    cy.get('.document-item')
      .contains('Passport')
      .parent()
      .find('.upload-document-btn')
      .click();
    
    // Upload file
    cy.get('input[type="file"]').attachFile('test-passport.pdf');
    
    // Add expiry date if required
    cy.get('input[type="date"]').then($input => {
      if ($input.is(':visible')) {
        cy.wrap($input).type('2030-01-01');
      }
    });
    
    // Click upload button
    cy.get('button').contains('Upload Document').click();
    cy.wait('@uploadDocument');
    
    // Verify success notification
    cy.get('.notification.success').should('exist');
    
    // Verify document appears in list
    cy.get('.document-item')
      .contains('Passport')
      .parent()
      .should('have.class', 'uploaded');
  });
  
  // Additional tests...
});
```

## Conclusion

The user profile management system is a foundational component of the Migratio platform, providing a comprehensive framework for collecting, storing, and managing user information. By implementing a robust data model, intuitive user interfaces, and strong privacy protections, the system enables accurate immigration pathway recommendations while ensuring a positive user experience.

The technical implementation leverages modern web technologies and best practices to ensure a responsive, accessible, and secure experience. The component-based architecture and comprehensive testing strategy support maintainability and ongoing development as the platform evolves.

Through thoughtful design and robust functionality, the profile management system serves as the central repository for all user information that drives the personalized experience across the Migratio platform.
