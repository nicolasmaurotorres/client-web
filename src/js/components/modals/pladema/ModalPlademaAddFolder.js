import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import PlademaAddFolderForm from '../../forms/pladema/PlademaAddFolderForm'
import { plademaAddFolder } from '../../../actions/plademaActions'

class ModalPlademaAddFolder extends React.Component {
  render() {
    debugger;
    const { plademaAddFolder,  files, folders, path , callback } = this.props;
    return (
      <div>
            <PlademaAddFolderForm callback = { callback }
                                  plademaAddFolder = { plademaAddFolder } 
                                  files = { files } 
                                  folders = { folders}
                                  path = { path }/> 
      </div>
    );
  }
}

ModalPlademaAddFolder.propTypes = {
  callback : PropTypes.func,
  plademaAddFolder : PropTypes.func.isRequired,
  files : PropTypes.object.isRequired,
  folders : PropTypes.object.isRequired,
  path : PropTypes.string.isRequired,
}
 

export default connect(null,{ plademaAddFolder })(ModalPlademaAddFolder);