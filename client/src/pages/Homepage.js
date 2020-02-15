import React from 'react';

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        };
        // TODO: On constructor (or componentDidMount), check if the authorization token exists
        // if yes, then they are logged in and display the articles
        // Else, display a homepage asking them to login/create an account (using Firebase)
    }

    render() {
        return (
            <main>
                {
                    this.state.loggedIn ? 
                    <NewsFeedComponent /> :
                    <LoginComponent />
                }
            </main>
        );
    }
}