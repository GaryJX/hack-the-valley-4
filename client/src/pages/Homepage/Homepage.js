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