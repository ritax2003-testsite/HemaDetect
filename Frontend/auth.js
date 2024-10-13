import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDo2xOy0NgexfjLDzm7d2tKMhywgoxOQoE",
    authDomain: "hemadetect.firebaseapp.com",
    databaseURL: "https://hemadetect-default-rtdb.firebaseio.com",
    projectId: "hemadetect",
    storageBucket: "hemadetect.appspot.com",
    messagingSenderId: "897471177127",
    appId: "1:897471177127:web:75e6c61ba5024dc8869682",
    measurementId: "G-1JMBQZW4YL"
  };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = firebase.firestore();
  
    window.addEventListener('load', async function (){
      await Clerk.load()
  
      if (Clerk.user) {
        document.getElementById('page-content').style.pointerEvents = 'auto';
        document.getElementById('body').innerHTML = `
          <div id="user-button"></div>
        `;
        const user = Clerk.user;
        const username = user.username || user.firstName || user.emailAddress || 'User';
        const userButtonDiv = document.getElementById('user-button');
        document.getElementById('user-info').innerHTML = `
          <div id ="info">Welcome, ${username} !!</div>
          <style>
            #info{
              color:white;
            }
            </style>
          `
          try {
          const token = await Clerk.session.getToken({ template: 'integration_firebase' });
          const userCredentials = await signInWithCustomToken(auth, token);
          console.log('User signed into Firebase:', userCredentials.user);
        } catch (error) {
          console.error('Error signing into Firebase:', error);
        }
  
        Clerk.mountUserButton(userButtonDiv);
      } 
      else {
        document.getElementById('page-content').style.pointerEvents = 'none';
        Clerk.openSignUp({ 
            afterSignInUrl: window.location.href, 
            afterSignUpUrl: window.location.href 
        });
       /* Clerk.openSignIn({
            afterSignInUrl: window.location.href,
            afterSignUpUrl: window.location.href
          }); */ 
      }
    })