import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Spinner, Alert, Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import fetchJsonp from 'fetch-jsonp';

function DbklSearchForm() {
    const [bookingData, setBookingData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [location, setLocation] = useState('Desa Petaling');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(() => {
        if (error) {
            alert(error);
        }
    }, [error]);

    const handleSearch = async () => {
        if (!location || !date) {
            setError("Please select both a location and a date.");
            return;
        }
        setLoading(true);
        setError(null);
        const _getLocationId = (location) => {
            switch (location) {
                case "Desa Petaling": return 23;
                case "Salak South": return 40;
                case "P.K Setiawangsa": return 57; // Example ID
                case "P.K Semarak": return 58; // Example ID
                default:
                    setError("Invalid location selected");
                    return null; // Return null if location is not recognized
            }
        };
        const locationId = _getLocationId(location);
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        const apiUrl = `https://appsys.dbkl.gov.my/mytempahan_baru/gateway.asp?callback=jQuery191048209435151745206_1708922802557&actiontype=gettimetable&dateplay=${encodeURIComponent(formattedDate)}&actvid=1&locid=${locationId}`;

        try {
            const response = await fetchJsonp(apiUrl, {
                jsonpCallbackFunction: 'jQuery191048209435151745206_1708922802557'
            });
            const data = await response.json();
            const transformedData = data.datamasa.map(item => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedDate = new Date(date);
                selectedDate.setHours(0, 0, 0, 0);
                const isPastOrToday = selectedDate <= today;
                return {
                    TIMEPLAYTABLE: item.TIMEPLAYTABLE,
                    AVAILABLE: isPastOrToday && item.STATUS !== "3" ? "Not Available" :
                        item.STATUS === "" ? "Available" :
                            item.STATUS === "2" ? "Pending Payment" :
                                item.STATUS === "3" ? "Booked" :
                                    item.STATUS === "70" ? "Not Available" :
                                        "Unknow Status"
                };
            });
            setBookingData(transformedData);
        } catch (error) {
            console.error("Failed to fetch booking data", error);
            setError("Failed to fetch booking data");
        } finally {
            setLoading(false);
        }
    };
    const handleDateChange = (selectedDate) => {
        const currentDate = new Date();
        const maxDate = new Date();
        maxDate.setDate(currentDate.getDate() + 21);
        const selectedDateObj = new Date(selectedDate);

        if (selectedDateObj > maxDate) {
            setError('Selected date is more than 21 days from now');
        } else {
            setDate(selectedDate);
            setError(null);
        }
    };
    return (
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
                            <Button
                                variant={location === 'P.K Setiawangsa' ? "primary" : "outline-primary"}
                                onClick={() => setLocation('P.K Setiawangsa')}
                            >
                                P.K Setiawangsa
                            </Button>
                            <Button
                                variant={location === 'P.K Semarak' ? "primary" : "outline-primary"}
                                onClick={() => setLocation('P.K Semarak')}
                            >
                                P.K Semarak
                            </Button>
                        </div>
                    </Col>
                    <Row className="align-items-end">
                        <Col xs={12} md={8} lg={6}>
                            <Form.Group controlId="dateSelect">
                                <Form.Label style={{ marginRight: '0.75rem' }}>Date</Form.Label>
                                <DatePicker
                                    selected={date}
                                    onChange={handleDateChange}
                                    dateFormat="dd-MM-yyyy"
                                    className="form-control date-picker-custom"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={4} lg={6}>
                            <Button variant="primary" onClick={handleSearch} className="w-100 custom-button">Search</Button>
                        </Col>
                    </Row>
                </Row>
            </Form>
            {loading ?
                (
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
    );
}

export default DbklSearchForm;
