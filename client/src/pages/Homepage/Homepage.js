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
                    <div className='details--title'>Your news. Summarized. Relevant.</div>
                    <div className='details--body'>Read news fast. always stay up to date. With INgest as your news source, nothing will slip past your information network.</div>
                    <div className='details--sign-in' onClick={() => this.setState({ showModal: true })}>Sign in or Register</div>
                </section>
                <section className='news-image'>
                    <img className='content-svg' src={contentSVG} />
                </section>
                <SignupLoginModal displayModal={showModal} handleClose={() => this.setState({ showModal: false })} />
            </main>
        );
    }
}