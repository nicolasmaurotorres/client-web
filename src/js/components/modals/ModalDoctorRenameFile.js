import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DoctorRenameFileForm from '../forms/DoctorRenameFileForm'
import { doctorRenameFile } from '../../actions/doctorActions'
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

class ModalDoctorRenameFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.callbackRenameOrCancel = this.callbackRenameOrCancel.bind(this);
  }

  callbackRenameOrCancel(updateState,newName, oldName){
    this.props.callbackRenameFile(updateState,newName,oldName);
    this.setState({modalIsOpen : false});
  }

  render() {
    const { doctorRenameFile,otherFiles, otherFolders, addFlashMessage, fileToRename, actualPath,fileExtension} = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          style={ customStyles }
          contentLabel="Edit Modal">
            <DoctorRenameFileForm callbackRenameOrCancel = { this.callbackRenameOrCancel }
                                    otherFolders  = { otherFolders }
                                    otherFiles = { otherFiles }
                                    fileToRename = { fileToRename }
                                    doctorRenameFile = { doctorRenameFile } 
                                    addFlashMessage = { addFlashMessage }
                                    actualPath = { actualPath }
                                    fileExtension = {fileExtension} /> 
        </Modal>
      </div>
    );
  }
}
// <ModalDoctorRenameFile fileToRename = { fileToRename } otherFiles = { currentFiles } otherFolders = { currentFolder } actualPath = { currentPath } callbackRenameFile = { this._callbackRenameFile }/>
ModalDoctorRenameFile.propTypes = {
  callbackRenameFile : PropTypes.func.isRequired,
  otherFolders : PropTypes.object.isRequired,
  otherFiles : PropTypes.object.isRequired,
  fileToRename : PropTypes.string.isRequired,
  actualPath : PropTypes.string.isRequired,
  addFlashMessage : PropTypes.func.isRequired,
  doctorRenameFile : PropTypes.func.isRequired,
  fileExtension : PropTypes.string.isRequired
}

export default connect(null,{doctorRenameFile,addFlashMessage})(confirmable(ModalDoctorRenameFile));