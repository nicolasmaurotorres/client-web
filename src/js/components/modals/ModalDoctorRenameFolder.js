import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DoctorRenameFolderForm from '../forms/DoctorRenameFolderForm'
import { doctorRenameFolder } from '../../actions/doctorActions'
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

class ModalDoctorRenameFolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.callbackRenameOrCancel = this.callbackRenameOrCancel.bind(this);
  }

  callbackRenameOrCancel(updateState,newName, oldName){
    this.props.callbackRenameFolder(updateState,newName,oldName);
    this.setState({modalIsOpen : false});
  }

  render() {
    const { doctorRenameFolder,otherFiles, otherFolders, addFlashMessage, folderToRename, actualPath} = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          style={ customStyles }
          contentLabel="Edit Modal">
            <DoctorRenameFolderForm callbackRenameOrCancel = { this.callbackRenameOrCancel }
                                    otherFolders  = { otherFolders }
                                    otherFiles = { otherFiles }
                                    folderToRename = { folderToRename }
                                    doctorRenameFolder = { doctorRenameFolder } 
                                    addFlashMessage = { addFlashMessage }
                                    actualPath = { actualPath } /> 
        </Modal>
      </div>
    );
  }
}

ModalDoctorRenameFolder.propTypes = {
  callbackRenameFolder : PropTypes.func.isRequired,
  addFlashMessage : PropTypes.func.isRequired,
  otherFolders : PropTypes.object.isRequired,
  otherFiles : PropTypes.object.isRequired,
  folderToRename : PropTypes.string.isRequired,
  actualPath : PropTypes.string.isRequired
}

export default connect(null,{doctorRenameFolder,addFlashMessage})(confirmable(ModalDoctorRenameFolder));