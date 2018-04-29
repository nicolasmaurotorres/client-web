import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import AdminEditUserForm from '../forms/AdminEditUserForm'
import { editUserRequest } from '../../actions/adminActions'
import { addFlashMessage } from '../../actions/flashMessages'

const customStyles = {
  content : {
    top : '50%',
    left : '50%',
    right : '20%',
    bottom : 'auto',
    marginRight : '-50%',
    transform : 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app')

class ModalAdminEditUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.callbackEditOrCancel = this.callbackEditOrCancel.bind(this);
  }

  callbackEditOrCancel(){
    debugger;
    this.props.callbackEditUser();
    this.setState({modalIsOpen : false});
  }

  render() {
    const { editUserRequest, addFlashMessage, callbackEditUser, user} = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          onRequestClose={ this.closeModal }
          style={ customStyles }
          contentLabel="Edit Modal">
            <AdminEditUserForm callbackEditUser = { this.callbackEditOrCancel } 
                              editUserRequest = { editUserRequest } 
                              addFlashMessage = { addFlashMessage }
                              user = { user } /> 
        </Modal>
      </div>
    );
  }
}

ModalAdminEditUser.propTypes = {
  callbackEditUser : PropTypes.func.isRequired,
  editUserRequest : PropTypes.func.isRequired,
  addFlashMessage : PropTypes.func.isRequired,
  user : PropTypes.object.isRequired
}


export default connect(null,{editUserRequest,addFlashMessage})(confirmable(ModalAdminEditUser));