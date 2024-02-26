import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Collapse, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/Dashboard.css';
import fetchJsonp from 'fetch-jsonp';

export default function Dashboard() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState('Desa Petaling');
  const [date, setDate] = useState(new Date());
  const [bookingData, setBookingData] = useState([]);

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

  const handleSearch = async () => {
    if (!location || !date) {
      setError("Please select both a location and a date.");
      return;
    }
    setLoading(true);
    setError("");
    const locationId = location === "Desa Petaling" ? 23 : location === "Salak South" ? 40 : null;

    const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
    const apiUrl = `https://appsys.dbkl.gov.my/mytempahan_baru/gateway.asp?callback=jQuery191048209435151745206_1708922802557&actiontype=gettimetable&dateplay=${encodeURIComponent(formattedDate)}&actvid=1&locid=${locationId}`;

    try {
      const response = await fetchJsonp(apiUrl, {
        jsonpCallbackFunction: 'jQuery191048209435151745206_1708922802557'
      });
      const data = await response.json();
      console.log(data)
      const transformedData = data.datamasa.map(item => ({
        TIMEPLAYTABLE: item.TIMEPLAYTABLE,
        AVAILABLE: item.STATUS === "" ? "Available" :
          item.STATUS === "2" ? "Pending Payment" :
            item.STATUS === "3" ? "Booked" :
              item.STATUS === "70" ? "Not Available" :
                "Unknow Status"
      }));
      console.log(transformedData);
      setBookingData(transformedData);
    } catch (error) {
      console.error("Failed to fetch booking data", error);
      setError("Failed to fetch booking data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} className="dashboard-container">
          <div className="d-flex justify-content-between align-items-center p-2">
            <h3>Dashboard</h3>
            <Button variant="outline-primary" onClick={() => setOpen(!open)} aria-controls="profile-options" aria-expanded={open}>
              Profile
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

          <div className="mt-4">
            <Form>
              <Row>
                <Col xs={12} className="mb-3">
                  <div className="d-flex justify-content-around">
                    <Button
                      variant={location === 'Desa Petaling' ? "primary" : "outline-primary"}
                      onClick={() => setLocation('Desa Petaling')}
                    >
                      Desa Petaling
                    </Button>
                    <Button
                      variant={location === 'Salak South' ? "primary" : "outline-primary"}
                      onClick={() => setLocation('Salak South')}
                    >
                      Salak South
                    </Button>
                  </div>
                </Col>
                <Row className="align-items-end">
                  <Col xs={12} md={8} lg={6}>
                    <Form.Group controlId="dateSelect">
                      <Form.Label style={{ marginRight: '0.75rem' }}>Date</Form.Label>
                      <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        dateFormat="dd-MM-yyyy"
                        className="form-control date-picker-custom" // Ensure this doesn't limit width
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4} lg={6} className="mt-3 mt-md-0"> {/* Removed text-md-right to ensure full width */}
                    <Button variant="primary" onClick={handleSearch} className="w-100 custom-button">Search</Button> {/* w-100 to ensure full width */}
                  </Col>
                </Row>
              </Row>
            </Form>
            {loading ? (
              <div className="text-center custom-spinner">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="mt-3">
                <h3>Available Slots</h3>
                {bookingData.length > 0 ? bookingData.map((slot, index) => (
                  <Card key={index} className="mb-2">
                    <Card.Body>
                      <strong>Time:</strong> {slot.TIMEPLAYTABLE}<br />
                      <strong>Status:</strong> <span className={`status ${slot.AVAILABLE.replace(/\s+/g, '-').toLowerCase()}`}>{slot.AVAILABLE}</span>
                    </Card.Body>
                  </Card>
                )) : !loading && <Alert variant="warning">No slots available. Please select a location and date, then click search.</Alert>}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
