import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  setDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdH9qKH9O5wItBM-Xnyn4x2ByETTBnmdQ",
  authDomain: "highland-735d4.firebaseapp.com",
  projectId: "highland-735d4",
  storageBucket: "highland-735d4.firebasestorage.app",
  messagingSenderId: "920933691274",
  appId: "1:920933691274:web:256aeb3886512e03fba273",
  measurementId: "G-XQTGJMBV5H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Analytics (Safe check for browser support)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
};

export default { app, db, analytics };
