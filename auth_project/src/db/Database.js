import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { db, auth } from "../firebase"

export let userEmailArr = [];

export async function getUserEmail(){
    try {
      const userCollection = collection(db, "users");
      getDocs(userCollection)
      .then((response) => {
        const users = response.docs.map(doc => ({
          data: doc.data(),
          id: doc.id,
        }))
        userEmailArr = users.map(x => x.data.user_email);
      });
    } catch (error) {
      console.error("Error reading document: ", error);
    };
  }

export async function storeLastLogInTime(){
    try {
      const docRef = await addDoc(collection(db, "users"), {
        user_email: auth.currentUser.email,
        user_last_login_time: auth.currentUser.metadata.lastSignInTime
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }