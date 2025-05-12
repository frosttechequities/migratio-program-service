import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { FaPlus, FaDownload, FaShare, FaEllipsisV } from 'react-icons/fa';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const RoadmapList = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/roadmaps');
        setRoadmaps(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load roadmaps. Please try again later.');
        setLoading(false);
        console.error('Error fetching roadmaps:', err);
      }
    };

    fetchRoadmaps();
  }, []);

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
    return `${date.toLocaleDateString()} (${formatDistanceToNow(date, { addSuffix: true })})`;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading your roadmaps...</p>
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

  if (roadmaps.length === 0) {
    return (
      <div className="my-4">
        <Alert variant="info">
          You don't have any roadmaps yet. Create your first roadmap to get started on your immigration journey.
        </Alert>
        <div className="text-center mt-4">
          <Button as={Link} to="/recommendations" variant="primary" size="lg">
            <FaPlus className="me-2" />
            Create Your First Roadmap
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Roadmaps</h2>
        <Button as={Link} to="/recommendations" variant="primary">
          <FaPlus className="me-2" />
          New Roadmap
        </Button>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {roadmaps.map((roadmap) => (
          <Col key={roadmap._id}>
            <Card className="h-100 roadmap-card">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    {getStatusBadge(roadmap.status)}
                    {roadmap.visibility === 'public' && (
                      <Badge bg="info" className="me-2">Public</Badge>
                    )}
                    {roadmap.visibility === 'shared' && (
                      <Badge bg="info" className="me-2">Shared</Badge>
                    )}
                  </div>
                  <div className="dropdown">
                    <Button variant="light" size="sm" className="btn-icon">
                      <FaEllipsisV />
                    </Button>
                  </div>
                </div>
                
                <Card.Title className="mt-2 mb-3">
                  <Link to={`/roadmaps/${roadmap._id}`} className="text-decoration-none">
                    {roadmap.title}
                  </Link>
                </Card.Title>
                
                <Card.Text className="text-muted small mb-3">
                  {roadmap.description?.substring(0, 100)}
                  {roadmap.description?.length > 100 ? '...' : ''}
                </Card.Text>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progress</span>
                    <span>{roadmap.completionPercentage}%</span>
                  </div>
                  <ProgressBar 
                    now={roadmap.completionPercentage} 
                    variant={roadmap.completionPercentage >= 100 ? 'success' : 'primary'} 
                  />
                </div>
                
                <div className="roadmap-meta small text-muted">
                  <div className="mb-1">
                    <strong>Start Date:</strong> {formatDate(roadmap.startDate)}
                  </div>
                  <div className="mb-1">
                    <strong>Target Completion:</strong> {formatDate(roadmap.targetCompletionDate)}
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {formatDate(roadmap.updatedAt)}
                  </div>
                </div>
              </Card.Body>
              
              <Card.Footer className="bg-white border-top">
                <div className="d-flex justify-content-between">
                  <Button 
                    as={Link} 
                    to={`/roadmaps/${roadmap._id}`} 
                    variant="outline-primary" 
                    size="sm"
                  >
                    View Details
                  </Button>
                  <div>
                    <Button 
                      variant="light" 
                      size="sm" 
                      className="btn-icon me-2"
                      title="Download PDF"
                      onClick={() => window.open(`/api/roadmaps/${roadmap._id}/pdf?download=true`, '_blank')}
                    >
                      <FaDownload />
                    </Button>
                    <Button 
                      variant="light" 
                      size="sm" 
                      className="btn-icon"
                      title="Share Roadmap"
                    >
                      <FaShare />
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RoadmapList;
