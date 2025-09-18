// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIRE_BASE_KEY,
//   authDomain: "mern-estate-30b3f.firebaseapp.com",
//   projectId: "mern-estate-30b3f",
//   storageBucket: "mern-estate-30b3f.firebasestorage.app",
//   messagingSenderId: "659871977607",
//   appId: "1:659871977607:web:2de1df121e4454756ce822",
//   measurementId: "G-8EKQ50FPF5",
// };

// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRE_BASE_KEY,
  authDomain: "mern-estate-30b3f.firebaseapp.com",
  projectId: "mern-estate-30b3f",
  storageBucket: "mern-estate-30b3f.firebasestorage.app",
  messagingSenderId: "659871977607",
  appId: "1:659871977607:web:2de1df121e4454756ce822",
  measurementId: "G-8EKQ50FPF5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
