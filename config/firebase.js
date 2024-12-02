import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBm2oqlhIjaggRl_GyXmmqu_VC_5FQB_bY",
  authDomain: "react-final-project-f3496.firebaseapp.com",
  projectId: "react-final-project-f3496",
  storageBucket: "react-final-project-f3496.appspot.com",
  messagingSenderId: "945871340199",
  appId: "1:945871340199:web:ebc0db73ff697823ea5182",
  measurementId: "G-SLT2GDFB96"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const firestore = getFirestore(app);

export { auth, firestore };
