import React from 'react';
import './LoginButton.scss';

export default class LoginComponent extends React.Component {
    state = {  }
    render() {
        return (
            <button type='button' className='login-component'>Sign up for free</button>
        );
    }
}