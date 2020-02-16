import React from 'react';
import Modal from 'react-bootstrap/Modal';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import './SignupLoginModal.scss';
window.firebase = firebase;
const firebaseui = require('firebaseui');

const config = ({
    apiKey: "AIzaSyCVE8qj3LiQRu7nwy4CohDbtsCxS4_65xw",
    authDomain: "ingest-1fea9.firebaseapp.com",
    databaseURL: "https://ingest-1fea9.firebaseio.com/",
    projectId: "ingest-1fea9",
    storageBucket: "ingest-1fea9.appspot.com",
    messagingSenderId: "793791917575",
    appId: "1:793791917575:web:dd55b32269a5b09fee84a2"
  })
  
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
    tosUrl: '/terms-of-service'
  })
  
  window.firebase.initializeApp(config)

export default class SignupLoginModal extends React.Component {

    render() {
        const { displayModal, handleClose } = this.props;
        return (
            <Modal centered show={displayModal} onHide={handleClose}>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </Modal>
        );
    }
}