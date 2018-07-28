import React from 'react';
import PropTypes from 'prop-types'

import PlademaAddFolderForm from '../../forms/pladema/PlademaAddFolderForm'
import { plademaAddFolder } from '../../../actions/plademaActions'

class ModalPlademaAddFolder extends React.Component {
  render() {
    const { plademaAddFolder, callback } = this.props;
    var path  = "";
    for (var i = 0;  i < this.props.table.level.path.length; i++){
      path += this.props.table.level.path[i] + "/";
    }
    path = path.substring(0,path.length-1);
    return (
      <div>
            <PlademaAddFolderForm callback = { callback }
                                  plademaAddFolder = { plademaAddFolder } 
                                  files = { this.props.table.level.files } 
                                  folders = { this.props.table.level.folders}
                                  path = { path }/> 
      </div>
    );
  }
}

ModalPlademaAddFolder.propTypes = {
  callback : PropTypes.func,
  plademaAddFolder : PropTypes.func.isRequired,
}
 
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  }
};

function mapStateToProps(state){
  return {
      table : state.table,
  }
}
export default connect(mapStateToProps,{ plademaAddFolder })(ModalPlademaAddFolder);