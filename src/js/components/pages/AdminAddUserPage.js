import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import AdminAddUserForm from '../forms/AdminAddUserForm'
import { createUserRequest } from '../../actions/adminActions'
import { addFlashMessage } from '../../actions/flashMessages'

class AdminAddUserPage extends React.Component {
    render(){ 
        const { createUserRequest, addFlashMessage } = this.props;
        return (
            <AdminAddUserForm createUserRequest = { createUserRequest } addFlashMessage = { addFlashMessage } />
        );
    }
}

AdminAddUserPage.propTypes = {
    createUserRequest : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired
}

export default connect(null,{ createUserRequest,addFlashMessage })(AdminAddUserPage);