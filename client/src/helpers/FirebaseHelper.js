// import firebaseui from 'firebaseui'
const firebase = require('firebase/app');
window.firebase = firebase;
const firebaseui = require('firebaseui');
const config = ({
  // your config
  apiKey: "AIzaSyCVE8qj3LiQRu7nwy4CohDbtsCxS4_65xw",
  authDomain: "ingest-1fea9.firebaseapp.com",
  databaseURL: "https://ingest-1fea9.firebaseio.com/",
  projectId: "ingest-1fea9",
  storageBucket: "ingest-1fea9.appspot.com",
  messagingSenderId: "793791917575",
  appId: "1:793791917575:web:dd55b32269a5b09fee84a2"
})

// This is our firebaseui configuration object
const uiConfig = ({
  signInSuccessUrl: '/',
  signInOptions: [
    {
      provider: window.firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    }
  ],
  credentialHelper: firebaseui.auth.CredentialHelper.NONE,
  signInFlow: 'popup',
  tosUrl: '/terms-of-service' // This doesn't exist yet
})

// This must run before any other firebase functions
window.firebase.initializeApp(config)

// This sets up firebaseui
const ui = new firebaseui.auth.AuthUI(window.firebase.auth())

// This adds firebaseui to the page
// It does everything else on its own
const startFirebaseUI = function (elementId) {
  ui.start(elementId, uiConfig)
}

export { startFirebaseUI }