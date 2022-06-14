import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { storeLastLogInTime } from "../db/Database"

export default function Signup(){
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup, sendVerifyEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();

    let password = passwordRef.current.value;
    let confirm_password = passwordConfirmRef.current.value;
    let email = emailRef.current.value

    if (password.length < 6){
      return setError("Password should be at least 6 characters");
    }

    if (confirm_password.length < 6){
      return setError("Password Confirmation should be at least 6 characters");
    }

    if (password !== confirm_password){
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signup(email, password);
      storeLastLogInTime();
      navigate("/dashboard");
    } catch {
      setError("Failed to create an account");
    }

    tryToSendEmail();

    setLoading(false);
  }

  async function tryToSendEmail(){
    try {
      await sendVerifyEmail();
      console.log("Verification email has been sent.");
    } catch {
      console.log("Failed to send email.");
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  )
}
