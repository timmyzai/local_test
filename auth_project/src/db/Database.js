import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore"; 
import { db, auth } from "../firebase"

export async function storeLastLogInTime(){
    try {
      getDocs(collection(db, "users"))
      .then((response) => {
        let data = findUser(response);
        let doc_id = data[0];
        
        data.length == 0 ? addData() : updateData(doc_id);
      });
    } catch (error) {
      console.error("Error reading data from firestore: ", error);
    };

    const findUser = (collection) => {
      return collection.docs.map(doc => [doc.id, doc.data().user_email])
                            .filter((x) => x[1] == auth.currentUser.email)
                            .flat();
    }
  }

async function addData(){
  try {
    const docRef = await addDoc(collection(db, "users"), {
      user_email: auth.currentUser.email,
      user_last_login_time: auth.currentUser.metadata.lastSignInTime,
      user_log_in_provider: auth.currentUser.providerData[0].providerId
    });
    console.log(`Added document with ID: ${docRef.id}`);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

function updateData(doc_id){
  try {
    updateDoc(doc(db, "users", doc_id), {
      user_last_login_time: auth.currentUser.metadata.lastSignInTime
    });
    console.log(`Updated document with ID: ${doc_id}`);

  } catch (error) {
    console.error("Error updating document: ", error);
  }
}