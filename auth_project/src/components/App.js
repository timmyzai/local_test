import React from "react"
import { Container } from "react-bootstrap"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import Signup from "./Signup"
import ForgotPassword from "./ForgotPassword"
import ChangePassword from "./ChangePassword"
import PrivateRoute from "./PrivateRoute"
import 'react-datepicker/dist/react-datepicker.css';

function App(){
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", minWidth: "100vw", backgroundImage: "linear-gradient(#2c3e50,#bdc3c7)"}}
    >
      <div className="w-100" style={{ maxWidth: "400px"}}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<PrivateRoute component={Dashboard}/>}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route element={<PrivateRoute component={ChangePassword}/>}>
                <Route path="/update-profile" element={<ChangePassword />} />
              </Route>
              <Route path="/signup" element={<Signup/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </Container>
  )
}

export default App
