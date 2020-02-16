import React from "react";
import './NavbarComponent.scss';
import { SignupLoginModal } from '../';
import logo from '../../assets/logo.png';
const firebase = require('firebase/app');
window.firebase = firebase;

// Delta for scroll distance
const DELTA = 5;
// Buffer for top of page before navbar collapses
const NAV_BUFFER = 25;

export default class NavbarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollDirection: 'none',
      previousFromTop: 0,
      navActive: false,
      showModal: false,
    }
  }


  componentDidMount() {
    setTimeout(() => {
      window.addEventListener('scroll', () => debounce(this.handleScroll()));
    }, 100);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => this.handleScroll());
  }

  handleScroll = () => {
    const { scrollDirection, previousFromTop } = this.state;
    const fromTop = window.scrollY;

    const scrollDistance = Math.abs(previousFromTop - fromTop);

    if (scrollDistance <= DELTA) { // Ensure scroll distance is more than DELTA
      return;
    } 
    
    if (fromTop < DELTA ) { // Reached top of page
      this.setState({ scrollDirection: 'none' });
    } else if (fromTop > previousFromTop && fromTop > NAV_BUFFER) { // Scrolled down past BUFFER zone
      if (scrollDirection !== 'down') {
        this.setState({ scrollDirection: 'down' });
      }
    } else if (fromTop + window.innerHeight < document.body.scrollHeight) { // Scrolled up
      if (scrollDirection !== 'up') {
        this.setState({ scrollDirection: 'up' });
      }
    }

    this.setState({ previousFromTop: fromTop });
  }

  toggleNavLinks = () => {
    const { navActive } = this.state;
    this.setState({ navActive: !navActive });

  }

  render() {
    const { scrollDirection, navActive, showModal } = this.state;
    const { loggedIn } = this.props;

    return (
      <header className={scrollDirection === 'down' ? 'scrolledDown' : ''}>
        <nav>
          <div className='nav-header'><img className='nav-logo' alt='logo' src={logo}/><div className='nav-title'>INgest</div></div>
          <ul className={`nav-list ${navActive ? 'nav-active' : ''}`}>
            <li className='nav-list--item'>
              {
                loggedIn ?
                <div className='logout-btn' onClick={() => firebase.auth().signOut()}>Log out</div> :
                <div className='nav-modal-btn' onClick={() => this.setState({ showModal: true })}>Sign in or Register</div>
              }
            </li>
          </ul>
          <div className={`hamburger-menu ${navActive ? 'nav-active' : ''}`} onClick={this.toggleNavLinks}>
            <div className='hamburger-line line-1'></div>
            <div className='hamburger-line line-2'></div>
            <div className='hamburger-line line-3'></div>
          </div>
        </nav>
        <SignupLoginModal displayModal={showModal} handleClose={() => this.setState({ showModal: false })} />
      </header>
    )
  }
}

const debounce = (func, wait = 100) => {
    let timer = null;
    return function(...args) {
      if (timer === null) {
        timer = setTimeout(() => {
          func.apply(this, args);
          timer = null;
        }, wait);
      }
    };
};