import React from 'react';
import PropTypes from 'prop-types'
import { confirmable } from 'react-confirm';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import DoctorAddFileForm from '../forms/DoctorAddFileForm'
import { doctorAddFile } from '../../actions/doctorActions'

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

class ModalDoctorAddFile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true
    };

    this.callbackAddFileOrCancel = this.callbackAddFileOrCancel.bind(this);
  }

  callbackAddFileOrCancel(updatePacients,newFile){
    this.props.callbackAddFile(updatePacients,newFile);
    this.setState({modalIsOpen : false});
  }

  render() {
    const { doctorAddFile,  otherFiles, otherFolders, actualPath} = this.props;
    return (
      <div>
        <Modal
          isOpen = { this.state.modalIsOpen }
          style={ customStyles }
          contentLabel="Example Modal">
            <DoctorAddFileForm callbackAddOrCancel = { this.callbackAddFileOrCancel } 
                                  doctorAddFile = { doctorAddFile } 
                                  otherFiles = { otherFiles } 
                                  otherFolders = { otherFolders}
                                  actualPath = { actualPath }/> 
        </Modal>
      </div>
    );
  }
}

ModalDoctorAddFile.propTypes = {
  callbackAddFile : PropTypes.func.isRequired,
  doctorAddFile : PropTypes.func.isRequired,
  otherFiles : PropTypes.object.isRequired,
  otherFolders : PropTypes.object.isRequired,
  actualPath : PropTypes.string.isRequired,
}


export default connect(null,{doctorAddFile})(confirmable(ModalDoctorAddFile));