import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAsgzWtcft15fvv_I9gouWGlBUsQcrMOa4",
  authDomain: "pigeon-72a5b.firebaseapp.com",
  projectId: "pigeon-72a5b",
  storageBucket: "pigeon-72a5b.appspot.com",
  messagingSenderId: "131692915787",
  appId: "1:131692915787:web:dada4bf8412cc6027db1ce",
  measurementId: "G-YT5X9Q7KSQ"
};


const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { firestore, auth, app, storage };
export default app;
