import React, { useContext, useState, useEffect } from "react"
import { auth, googleProvider } from "../firebase"

const AuthContext = React.createContext();

export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({ children }){
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password){
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password){
    return auth.signInWithEmailAndPassword(email, password);
  }

  function googleLogin(){
    return auth.signInWithPopup(googleProvider);
  }

  function logout(){
    return auth.signOut();
  }

  function resetPassword(email){
    return auth.sendPasswordResetEmail(email);
  }

  function updatePassword(password){
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, [])

  const value = {
    currentUser,
    login,
    googleLogin,
    signup,
    logout,
    resetPassword,
    updatePassword,
    // sendEmail
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}