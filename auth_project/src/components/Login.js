import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { GoogleButton } from "react-google-button"
import { storeLastLogInTime } from "../db/Database"
import { collection, getDocs } from "firebase/firestore"
import { db, auth } from "../firebase"

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, googleLogin, sendVerifyEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let isGoogleLogin = false;

  async function handleSubmit(e) {
    e.preventDefault();
    tryToLogIn();
  }

  async function handleGoogleLogin() {
    isGoogleLogin = true;
    tryToLogIn();
  }

  async function tryToLogIn() {
    setError("");
    try {
      setLoading(true);
      if (isGoogleLogin) {
        await googleLogin();
      } else {
          await login(emailRef.current.value, passwordRef.current.value);
      }
      // sendMail();
      storeLastLogInTime();
      navigate("/dashboard");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  function sendMail() {
    try {
      getDocs(collection(db, "users"))
        .then((response) => {
          isUserExisted(response) ? console.log("User Existed") : tryToSendEmail();
        });
    } catch (error) {
      console.error("Error reading data from firestore: ", error);
    };

    const isUserExisted = (collection) => {
      const usersEmails = collection.docs.map(doc => doc.data().user_email);

      return usersEmails.includes(auth.currentUser.email);
    }

    async function tryToSendEmail() {
      try {
        await sendVerifyEmail();
        console.log("Verification email has been sent.");
      } catch {
        console.log("Failed to send email.");
      }
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
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
            <Button disabled={loading} className="w-100 mt-2 mb-2" type="submit">
              Log In
            </Button>
            <GoogleButton className="w-100" style={{ borderRadius: "2.5px" }} onClick={handleGoogleLogin} />
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}
