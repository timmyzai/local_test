import React, { useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useNavigate  } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'

export default function HomePage() {
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Welcome</h2>
              <Link disabled={loading} className="w-100 btn btn-primary" to="/login"><b>Login</b></Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
      Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}
