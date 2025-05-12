import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Button, 
  Form, 
  ListGroup, 
  Badge, 
  Spinner,
  Alert
} from 'react-bootstrap';
import { FaFile, FaUpload, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const DocumentSelector = ({ 
  show, 
  onHide, 
  roadmapId, 
  phaseIndex, 
  milestoneIndex, 
  milestone,
  onDocumentAssigned
}) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch user's documents
  useEffect(() => {
    if (show) {
      fetchDocuments();
    }
  }, [show]);

  // Pre-select documents that are already assigned to this milestone
  useEffect(() => {
    if (milestone && milestone.documents) {
      setSelectedDocuments(milestone.documents.map(doc => doc.documentId));
    } else {
      setSelectedDocuments([]);
    }
  }, [milestone]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/documents');
      setDocuments(response.data.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load documents. Please try again.');
      setLoading(false);
      console.error('Error fetching documents:', err);
    }
  };

  const handleDocumentSelect = (documentId) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Prepare document assignments with pending status
      const documentAssignments = selectedDocuments.map(documentId => ({
        documentId,
        status: 'pending',
        assignedAt: new Date()
      }));
      
      // Update milestone with document assignments
      await axios.put(
        `/api/roadmaps/${roadmapId}/phases/${phaseIndex}/milestones/${milestoneIndex}/documents`,
        { documents: documentAssignments }
      );
      
      setSuccess(true);
      setLoading(false);
      
      // Notify parent component
      if (onDocumentAssigned) {
        onDocumentAssigned(documentAssignments);
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onHide();
      }, 1500);
    } catch (err) {
      setError('Failed to assign documents. Please try again.');
      setLoading(false);
      console.error('Error assigning documents:', err);
    }
  };

  const getDocumentStatusBadge = (document) => {
    if (!milestone || !milestone.documents) return null;
    
    const assignedDoc = milestone.documents.find(doc => doc.documentId === document._id);
    if (!assignedDoc) return null;
    
    switch (assignedDoc.status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      default:
        return <Badge bg="secondary">Not Submitted</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Assign Documents to Milestone</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center my-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading documents...</p>
          </div>
        )}
        
        {error && (
          <Alert variant="danger" className="my-3">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="my-3">
            Documents successfully assigned to milestone!
          </Alert>
        )}
        
        {!loading && !error && documents.length === 0 && (
          <Alert variant="info" className="my-3">
            You don't have any documents yet. Upload documents first to assign them to milestones.
            <div className="mt-3">
              <Button variant="primary" href="/documents">
                <FaUpload className="me-2" />
                Upload Documents
              </Button>
            </div>
          </Alert>
        )}
        
        {!loading && !error && documents.length > 0 && (
          <>
            <p>Select documents to assign to this milestone:</p>
            <ListGroup className="mb-3">
              {documents.map(document => (
                <ListGroup.Item 
                  key={document._id}
                  className="d-flex justify-content-between align-items-center"
                  action
                  onClick={() => handleDocumentSelect(document._id)}
                  active={selectedDocuments.includes(document._id)}
                >
                  <div className="d-flex align-items-center">
                    <FaFile className="me-3" />
                    <div>
                      <div className="fw-bold">{document.originalName}</div>
                      <div className="small text-muted">
                        {document.documentType} • {document.category} • 
                        {new Date(document.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {getDocumentStatusBadge(document)}
                    {selectedDocuments.includes(document._id) && (
                      <FaCheck className="ms-3 text-success" />
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={loading || documents.length === 0}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Saving...
            </>
          ) : (
            <>
              <FaCheck className="me-2" />
              Save Document Assignments
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentSelector;
