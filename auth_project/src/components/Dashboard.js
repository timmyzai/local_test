import React, { useState } from 'react';
import { Card, Button, Alert, Collapse, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import DbklSearchForm from './DbklSearch';
import { List } from 'react-bootstrap-icons';

export default function Dashboard() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError("");
    setLoading(true);
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={10} className="dashboard-container">
          <div className="dashboard-top">
            <h3 className="dashboard-heading">Dashboard</h3>
            <Button className="dashboard-button" onClick={() => setOpen(!open)} aria-controls="profile-options" aria-expanded={open}>
              <List />
            </Button>
          </div>

          <Collapse in={open}>
            <div id="profile-options">
              <Card>
                <Card.Body>
                  <h2 className="text-center mb-4">My Profile</h2>
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    {currentUser.photoURL && <img src={currentUser.photoURL} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
                  </div>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <p><strong>Email: </strong>{currentUser.email}</p>
                  <p><strong>Name: </strong>{currentUser.displayName || 'Not available'}</p>
                  <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Change Password</Link>
                  <Button variant="link" onClick={handleLogout} className="w-100 mt-2">Log Out</Button>
                </Card.Body>
              </Card>
            </div>
          </Collapse>

          <DbklSearchForm />
        </Col>
      </Row>
    </Container>
  );
}
