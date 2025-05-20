// Mock documents data for testing
export const mockDocuments = [
  {
    _id: 'doc-1',
    name: 'Passport',
    fileName: 'passport.pdf',
    fileType: 'application/pdf',
    fileSize: 2500000,
    uploadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'identification',
    status: 'verified',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Passport verified and valid',
    tags: ['identification', 'travel', 'required'],
    isRequired: true
  },
  {
    _id: 'doc-2',
    name: 'Resume',
    fileName: 'resume.pdf',
    fileType: 'application/pdf',
    fileSize: 1200000,
    uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'employment',
    status: 'pending',
    expiryDate: null,
    notes: 'Resume pending review',
    tags: ['employment', 'required'],
    isRequired: true
  },
  {
    _id: 'doc-3',
    name: 'Language Test Results',
    fileName: 'ielts_results.pdf',
    fileType: 'application/pdf',
    fileSize: 1800000,
    uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'language',
    status: 'verified',
    expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'IELTS results verified',
    tags: ['language', 'required'],
    isRequired: true
  },
  {
    _id: 'doc-4',
    name: 'Education Credential Assessment',
    fileName: 'eca_wes.pdf',
    fileType: 'application/pdf',
    fileSize: 2100000,
    uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'education',
    status: 'pending',
    expiryDate: null,
    notes: 'ECA pending verification',
    tags: ['education', 'required'],
    isRequired: true
  },
  {
    _id: 'doc-5',
    name: 'Birth Certificate',
    fileName: 'birth_certificate.pdf',
    fileType: 'application/pdf',
    fileSize: 1500000,
    uploadDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'identification',
    status: 'verified',
    expiryDate: null,
    notes: 'Birth certificate verified',
    tags: ['identification', 'required'],
    isRequired: true
  }
];
