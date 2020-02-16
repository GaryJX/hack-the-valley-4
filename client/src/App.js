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
        userId: null,
    };

    this.initialAuth = true;

    firebase.auth().onAuthStateChanged((user) => {
      if (user && this.initialAuth) {
        this.setState({ loggedIn: true, userId: user.uid});
      } else {
        this.setState({ loggedIn: false });
      }
      this.setState({ loading: false });

      this.initialAuth = false;
    });
  }


  render() {
    const { loggedIn, loading, userId } = this.state;
    return (
      <>
        <NavbarComponent loggedIn={loggedIn}/>
        {
          loading ?
          <div className='loading-container'><img src={LoadingIcon} alt='loading'/></div> :
          loggedIn ? 
          <NewsFeedComponent userId={userId}/> :
          <Homepage />
        }
      </>
    )
  }
}