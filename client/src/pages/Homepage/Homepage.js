import React from 'react';
import './Homepage.scss';
import contentSVG from '../../assets/content.svg';
import { SignupLoginModal } from '../../components';

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    render() {
        const { showModal } = this.state;
        return (
            <main className='home-page'>
                <section className='details'>
                    <div className='details--title'>Your news. Relevant.<br/>Concise.</div>
                    <div className='details--body'>Always stay up to date on news you care about. Spend less time reading filler, and more time on what really matters to you.</div>
                    <div className='details--sign-in' onClick={() => this.setState({ showModal: true })}>Sign in or Register</div>
                </section>
                <section className='news-image'>
                    <img alt='content' className='content-svg' src={contentSVG} />
                </section>
                <SignupLoginModal displayModal={showModal} handleClose={() => this.setState({ showModal: false })} />
            </main>
        );
    }
}