import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  ProgressBar,
  Tabs,
  Tab,
  Form,
  Modal
} from 'react-bootstrap';
import {
  FaArrowLeft,
  FaDownload,
  FaShare,
  FaEdit,
  FaTrash,
  FaFilePdf,
  FaFile,
  FaPaperclip
} from 'react-icons/fa';
import DocumentSelector from './DocumentSelector';
import axios from 'axios';
import { formatDistanceToNow, format } from 'date-fns';

const RoadmapDetail = () => {
  const { roadmapId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // PDF generation options
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeDocuments, setIncludeDocuments] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Document management
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(null);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/roadmaps/${roadmapId}`);
        setRoadmap(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load roadmap. Please try again later.');
        setLoading(false);
        console.error('Error fetching roadmap:', err);
      }
    };

    fetchRoadmap();
  }, [roadmapId]);

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { variant: 'secondary', label: 'Draft' },
      active: { variant: 'primary', label: 'Active' },
      completed: { variant: 'success', label: 'Completed' },
      archived: { variant: 'dark', label: 'Archived' }
    };

    const statusInfo = statusMap[status] || { variant: 'light', label: status };

    return (
      <Badge bg={statusInfo.variant} className="me-2">
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';

    const date = new Date(dateString);
    return format(date, 'PPP');
  };

  const handleGeneratePdf = () => {
    setShowPdfModal(true);
  };

  const handleDownloadPdf = () => {
    setGeneratingPdf(true);

    // Construct the URL with query parameters
    const pdfUrl = `/api/roadmaps/${roadmapId}/pdf?download=true&includeNotes=${includeNotes}&includeDocuments=${includeDocuments}`;

    // Open the URL in a new tab
    window.open(pdfUrl, '_blank');

    setGeneratingPdf(false);
    setShowPdfModal(false);
  };

  const handleAssignDocuments = (phaseIndex, milestoneIndex, milestone) => {
    setSelectedPhaseIndex(phaseIndex);
    setSelectedMilestoneIndex(milestoneIndex);
    setSelectedMilestone(milestone);
    setShowDocumentSelector(true);
  };

  const handleDocumentAssigned = async (documentAssignments) => {
    // Update the local state to reflect the document assignments
    if (roadmap && roadmap.phases) {
      const updatedPhases = [...roadmap.phases];

      if (!updatedPhases[selectedPhaseIndex].milestones[selectedMilestoneIndex].documents) {
        updatedPhases[selectedPhaseIndex].milestones[selectedMilestoneIndex].documents = [];
      }

      updatedPhases[selectedPhaseIndex].milestones[selectedMilestoneIndex].documents = documentAssignments;

      setRoadmap({
        ...roadmap,
        phases: updatedPhases
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading roadmap details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

  if (!roadmap) {
    return (
      <Alert variant="warning" className="my-3">
        Roadmap not found.
      </Alert>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Link to="/roadmap" className="text-decoration-none">
          <FaArrowLeft className="me-2" />
          Back to Roadmaps
        </Link>
      </div>

      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="mb-2">{roadmap.title}</h1>
          <div className="mb-3">
            {getStatusBadge(roadmap.status)}
            {roadmap.visibility === 'public' && (
              <Badge bg="info" className="me-2">Public</Badge>
            )}
            {roadmap.visibility === 'shared' && (
              <Badge bg="info" className="me-2">Shared</Badge>
            )}
          </div>
          <p className="text-muted">
            Created: {formatDate(roadmap.createdAt)} •
            Last updated: {formatDistanceToNow(new Date(roadmap.updatedAt), { addSuffix: true })}
          </p>
        </div>

        <div className="d-flex">
          <Button
            variant="outline-primary"
            className="me-2"
            onClick={handleGeneratePdf}
          >
            <FaFilePdf className="me-2" />
            Generate PDF
          </Button>
          <Button
            variant="outline-secondary"
            className="me-2"
          >
            <FaShare className="me-2" />
            Share
          </Button>
          <Button
            variant="outline-danger"
          >
            <FaTrash className="me-2" />
            Delete
          </Button>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Description</Card.Title>
              <Card.Text>
                {roadmap.description || 'No description provided.'}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Timeline</Card.Title>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <div className="text-muted mb-1">Start Date</div>
                  <div>{formatDate(roadmap.startDate)}</div>
                </div>
                <div>
                  <div className="text-muted mb-1">Target Completion</div>
                  <div>{formatDate(roadmap.targetCompletionDate)}</div>
                </div>
                {roadmap.actualCompletionDate && (
                  <div>
                    <div className="text-muted mb-1">Actual Completion</div>
                    <div>{formatDate(roadmap.actualCompletionDate)}</div>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Overall Progress</span>
                  <span>{roadmap.completionPercentage}%</span>
                </div>
                <ProgressBar
                  now={roadmap.completionPercentage}
                  variant={roadmap.completionPercentage >= 100 ? 'success' : 'primary'}
                />
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Phases</Card.Title>
              {roadmap.phases && roadmap.phases.length > 0 ? (
                roadmap.phases.map((phase, index) => (
                  <div key={index} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5>{phase.title}</h5>
                      <Badge
                        bg={
                          phase.status === 'completed' ? 'success' :
                          phase.status === 'in_progress' ? 'primary' :
                          phase.status === 'delayed' ? 'warning' :
                          'secondary'
                        }
                      >
                        {phase.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-muted small">{phase.description}</p>
                    <div className="d-flex justify-content-between small text-muted mb-1">
                      <span>Phase Progress</span>
                      <span>{phase.completionPercentage}%</span>
                    </div>
                    <ProgressBar
                      now={phase.completionPercentage}
                      variant={phase.completionPercentage >= 100 ? 'success' : 'primary'}
                      className="mb-3"
                    />

                    {phase.milestones && phase.milestones.length > 0 && (
                      <div className="ms-3">
                        <div className="text-muted mb-2">Milestones:</div>
                        {phase.milestones.map((milestone, mIndex) => (
                          <div key={mIndex} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <div>{milestone.title}</div>
                                {milestone.documents && milestone.documents.length > 0 && (
                                  <Badge bg="info" className="ms-2">
                                    <FaPaperclip className="me-1" />
                                    {milestone.documents.length}
                                  </Badge>
                                )}
                              </div>
                              <div className="d-flex align-items-center">
                                <Badge
                                  bg={
                                    milestone.status === 'completed' ? 'success' :
                                    milestone.status === 'in_progress' ? 'primary' :
                                    milestone.status === 'delayed' ? 'warning' :
                                    milestone.status === 'blocked' ? 'danger' :
                                    'secondary'
                                  }
                                  className="me-2"
                                >
                                  {milestone.status.replace('_', ' ')}
                                </Badge>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => handleAssignDocuments(index, mIndex, milestone)}
                                >
                                  <FaFile className="me-1" />
                                  Documents
                                </Button>
                              </div>
                            </div>

                            {milestone.documents && milestone.documents.length > 0 && (
                              <div className="ms-3 small">
                                <div className="text-muted mb-1">Required Documents:</div>
                                <div className="d-flex flex-wrap">
                                  {milestone.documents.map((doc, dIndex) => (
                                    <Badge
                                      key={dIndex}
                                      bg={
                                        doc.status === 'approved' ? 'success' :
                                        doc.status === 'rejected' ? 'danger' :
                                        doc.status === 'pending' ? 'warning' :
                                        'secondary'
                                      }
                                      className="me-2 mb-1"
                                    >
                                      {doc.documentId}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No phases defined for this roadmap.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Quick Stats</Card.Title>
              <div className="mb-3">
                <div className="text-muted mb-1">Program</div>
                <div>{roadmap.programId}</div>
              </div>

              {roadmap.estimatedCost && (
                <div className="mb-3">
                  <div className="text-muted mb-1">Estimated Cost</div>
                  <div>
                    {roadmap.estimatedCost.total} {roadmap.estimatedCost.currency}
                  </div>
                </div>
              )}

              {roadmap.tags && roadmap.tags.length > 0 && (
                <div>
                  <div className="text-muted mb-1">Tags</div>
                  <div>
                    {roadmap.tags.map((tag, index) => (
                      <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {roadmap.notes && (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Notes</Card.Title>
                <Card.Text>
                  {roadmap.notes}
                </Card.Text>
              </Card.Body>
            </Card>
          )}

          {roadmap.estimatedCost && roadmap.estimatedCost.breakdown && roadmap.estimatedCost.breakdown.length > 0 && (
            <Card>
              <Card.Body>
                <Card.Title>Cost Breakdown</Card.Title>
                {roadmap.estimatedCost.breakdown.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <div>{item.category}</div>
                    <div>{item.amount} {roadmap.estimatedCost.currency}</div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* PDF Generation Modal */}
      <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Generate PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Customize your PDF export:</p>
          <Form>
            <Form.Check
              type="checkbox"
              id="include-notes"
              label="Include notes"
              checked={includeNotes}
              onChange={(e) => setIncludeNotes(e.target.checked)}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              id="include-documents"
              label="Include documents"
              checked={includeDocuments}
              onChange={(e) => setIncludeDocuments(e.target.checked)}
              className="mb-2"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPdfModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
          >
            {generatingPdf ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Generating...
              </>
            ) : (
              <>
                <FaDownload className="me-2" />
                Download PDF
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Document Selector Modal */}
      <DocumentSelector
        show={showDocumentSelector}
        onHide={() => setShowDocumentSelector(false)}
        roadmapId={roadmapId}
        phaseIndex={selectedPhaseIndex}
        milestoneIndex={selectedMilestoneIndex}
        milestone={selectedMilestone}
        onDocumentAssigned={handleDocumentAssigned}
      />
    </Container>
  );
};

export default RoadmapDetail;
