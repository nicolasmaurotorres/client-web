import React    from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoginForm from '../forms/LoginForm'
import { userLoginRequest } from '../../actions/authActions'
import { addFlashMessage } from '../../actions/flashMessages'

class LoginPage extends React.Component {
    render(){ 
        const  { addFlashMessage, userLoginRequest } = this.props;
        return (
                <div className="container"> 
                    <LoginForm userLoginRequest = { userLoginRequest } addFlashMessage = { addFlashMessage } />
                </div>
        );
    }
}

LoginPage.propTypes = {
    userLoginRequest : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired
}

export default connect(null, { userLoginRequest, addFlashMessage })(LoginPage);