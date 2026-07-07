import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "../../firebase-applet-config.json";

// Check if Firebase configuration has valid credentials
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.appId &&
  firebaseConfig.projectId
);

let app: any = null;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Support default or custom database IDs gracefully in Firestore initialization
    const dbId = (firebaseConfig as any).firestoreDatabaseId;
    db = dbId ? getFirestore(app, dbId) : getFirestore(app);
    console.log("Firebase initialized successfully with project: " + firebaseConfig.projectId);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn(
    "Firebase configuration is incomplete. App falls back to local storage isolation mode."
  );
}

export {
  app,
  auth,
  db,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged
};
