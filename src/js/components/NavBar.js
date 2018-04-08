import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { userLogoutRequest } from '../actions/authActions'

class NavBar extends React.Component {
    constructor(props){
        super(props);

        this._onClickLogout = this._onClickLogout.bind(this);
    }

    _onClickLogout(e){
        this.props.userLogoutRequest();
    }

    render(){
        const { isAuthenticated } = this.props.auth;
        const notAuthenticated = (
            <ul className="navbar-nav mr-auto navbar-right"> 
                <li className="nav-item"><Link className="nav-link" to = "/login">Login</Link></li>
            </ul>
        );
        const authenticated = (
            <ul className="navbar-nav mr-auto navbar-right"> 
                <li className="nav-item" ><Link className="nav-link" to = "/login" onClick = { this._onClickLogout } >Logout</Link></li>
            </ul>
        );
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation" >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    { isAuthenticated ? authenticated : notAuthenticated }
                </div>
            </nav>
        );
    }
}

NavBar.PropTypes = {
    auth : PropTypes.object.isRequired,
    userLogoutRequest : PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        auth : state.auth
    };
}

export default connect(mapStateToProps,{ userLogoutRequest })(NavBar);