import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DoctorAddFolderForm from '../forms/DoctorAddFolderForm'
import { doctorAddFolder } from '../../actions/doctorActions'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : '20%',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app')

class ModalDoctorAddFolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.callbackAddFolderOrCancel = this.callbackAddFolderOrCancel.bind(this);
  }

  callbackAddFolderOrCancel(updatePacients,newFolder){
    this.props.callbackAddFolder(updatePacients,newFolder);
    this.setState({modalIsOpen : false});
  }

  render() {
    const { doctorAddFolder,  otherFolders, otherFiles, path} = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          style={ customStyles }
          contentLabel="Example Modal">
            <DoctorAddFolderForm  callbackAddFolderOrCancel = { this.callbackAddFolderOrCancel } 
                                  doctorAddFolder = { doctorAddFolder } 
                                  otherFolders = { otherFolders } 
                                  otherFiles = { otherFiles }
                                  actualPath = { path }/> 
        </Modal>
      </div>
    );
  }
}

ModalDoctorAddFolder.propTypes = {
    callbackAddFolder : PropTypes.func.isRequired,
    doctorAddFolder : PropTypes.func.isRequired,
    otherFiles : PropTypes.object.isRequired,
    otherFolders : PropTypes.object.isRequired,
    path : PropTypes.string.isRequired
}


export default connect(null,{doctorAddFolder})(confirmable(ModalDoctorAddFolder));