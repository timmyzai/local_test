import React, { useState } from "react"
import { Card, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate  } from "react-router-dom"

export default function Dashboard(){
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isGoogleLogin = currentUser.displayName ? true : false;

  async function handleLogout(){
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center">My Profile</h2>
          {isGoogleLogin &&
            <div className="d-flex align-items-center justify-content-center mb-3">
              <img src={currentUser.photoURL} alt="google"/>
            </div>
          }
          {error && <Alert variant="danger">{error}</Alert>}
          <p><strong>Email: </strong>{currentUser.email}</p>
          {isGoogleLogin ?
            <p><strong>Name: </strong>{currentUser.displayName}</p> :
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              Change Password
            </Link>
           }
          
          
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  )
}
