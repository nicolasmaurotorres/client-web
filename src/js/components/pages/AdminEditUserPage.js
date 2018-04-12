import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import AdminEditUserForm from '../forms/AdminEditUserForm'
import { editUserRequest } from '../../actions/adminActions'
import { addFlashMessage } from '../../actions/flashMessages'

class AdminEditUserPage extends React.Component {
    render(){ 
        const { editUserRequest, addFlashMessage } = this.props;
        return (
            <AdminEditUserForm editUserRequest = { editUserRequest } addFlashMessage = { addFlashMessage } />
        );
    }
}

AdminEditUserPage.propTypes = {
    editUserRequest : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired
}

export default connect(null,{ editUserRequest,addFlashMessage })(AdminEditUserPage);