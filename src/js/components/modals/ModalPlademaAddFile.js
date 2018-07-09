import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import PlademaAddFileForm from '../forms/DoctorAddFileForm'
import { plademaAddFile } from '../../actions/plademaActions'

class ModalPlademaAddFile extends React.Component {
  render() {
    const { plademaAddFile,  files, folders, path ,callback } = this.props;
    return (
      <div>
            <PlademaAddFileForm callback = { callback } 
                                  plademaAddFile = { plademaAddFile } 
                                  otherFiles = { files } 
                                  otherFolders = { folders}
                                  actualPath = { path }/> 
      </div>
    );
  }
}

ModalPlademaAddFile.propTypes = {
  callback : PropTypes.func.isRequired,
  plademaAddFile : PropTypes.func.isRequired,
  files : PropTypes.object.isRequired,
  folders : PropTypes.object.isRequired,
  path : PropTypes.string.isRequired,
}
 

export default connect(null,{ plademaAddFile })(ModalPlademaAddFile);