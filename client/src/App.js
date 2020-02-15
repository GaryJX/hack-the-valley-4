import React from 'react';
import { Homepage } from './pages';
import { NewsFeedComponent, NavbarComponent } from './components';
import LoadingIcon from './assets/loading.svg';
import './App.scss';
const firebase = require('firebase/app');
window.firebase = firebase;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loggedIn: false,
        loading: true,
    };

    this.initialAuth = true;

    firebase.auth().onAuthStateChanged((user) => {
      if (user && this.initialAuth) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
      this.setState({ loading: false });

      this.initialAuth = false;
    });

    // firebase.auth().signOut();
  }


  render() {
    const { loggedIn, loading } = this.state;
    return (
      <>
        <NavbarComponent loggedIn={loggedIn}/>
        {
          loading ?
          <div class='loading-container'><img src={LoadingIcon} /></div> :
          loggedIn ? 
          <NewsFeedComponent /> :
          <Homepage />
        }
      </>
    )
  }
}