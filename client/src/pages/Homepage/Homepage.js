import React from 'react';
import { NewsFeedComponent } from '../../components';
import './Homepage.scss';
import contentSVG from '../../assets/content.svg';
import { SignupLoginModal } from '../../components';

// import ContentSVG from '../../assets/ContentSVG';

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
        // TODO: On constructor (or componentDidMount), check if the authorization token exists
        // if yes, then they are logged in and display the articles
        // Else, display a homepage asking them to login/create an account (using Firebase)
    }

    render() {
        const { showModal } = this.state;
        return (
            <main className='home-page'>
                <section className='details'>
                    <div className='details--title'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do </div>
                    <div className='details--body'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                    <div className='details--sign-in' onClick={() => this.setState({ showModal: true })}>Sign Up/Log in</div>
                </section>
                <section className='news-image'>
                    <img className='content-svg' src={contentSVG} />
                </section>
                <SignupLoginModal displayModal={showModal} handleClose={() => this.setState({ showModal: false })} />
            </main>
        );
    }
}