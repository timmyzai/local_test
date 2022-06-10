import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const app = firebase.initializeApp({
    apiKey: "AIzaSyAJXUtekHYNDbghPn_pJ6S57n5wFWB5JQ4",
    authDomain: "auth-development-b0a61.firebaseapp.com",
    projectId: "auth-development-b0a61",
    storageBucket: "auth-development-b0a61.appspot.com",
    messagingSenderId: "510849277406",
    appId: "1:510849277406:web:f3db2968c33d8a4fe0114f"
  })

export const auth = app.auth()
export default app