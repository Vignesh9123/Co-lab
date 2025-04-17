
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { config } from ".";
const firebaseConfig = {
  apiKey: config.firebaseAPIKey,
  authDomain: config.firebaseAuthDomain,
  projectId: config.firebaseProjectId,
  storageBucket: config.firebaseStorageBucket,
  messagingSenderId: config.firebaseMessagingSenderId,
  appId: config.firebaseAppId,
  measurementId: config.firebaseMeasurementId,
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);