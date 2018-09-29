import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { setCurrentLevel } from '../../../actions/tableActions';
import { _nextNode, _getFilesAsObject, _getFoldersAsObject, _getPathAsString } from '../../../utils/tableFunctions'
import { addFlashMessage } from '../../../actions/flashMessages';
import { connect } from 'react-redux';
import { doctorAddFile } from '../../../actions/doctorActions'

class DoctorAddFileForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            file: null,
            name : ""
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._handleFileSelect = this._handleFileSelect.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
        this._callbackAddFile = this._callbackAddFile.bind(this);
    }
  
    _callbackAddFile(newFileName){
        var path = _getPathAsString(this.props.table.level.path);
        var nextNode = _nextNode(path,this.props.table.content);
        nextNode.Files.push(newFileName);
        this.props.dispatch(setCurrentLevel({
            files : nextNode.Files,
            folders : this.props.table.level.folders,
            path: this.props.table.level.path,
            position : this.props.table.level.position
        }));
    }

    _submitForm(){
        if (this._isValid()){
            var formData = new FormData();
            const nameFile = this.state.file.name;
            formData.append("file", this.state.file);
            formData.append("folder", _getPathAsString(this.props.table.level.path,1));
            doctorAddFile(formData)
            .then((response)=>{
                this.props.callback();
                this._callbackAddFile(nameFile);
            })
            .catch((response)=>{
                this.props.dispatch(addFlashMessage({
                    type:"error",
                    text:"cant add file form error"
                }));
            });
        }
    }

    _isValid(){
        var toReturn = true;
        var _errors = {};
        if (this.state.file === null){
            toReturn = false;
            _errors["file"] = "you have to select a file to send";   
        } else { 
            var file = this.state.file.name;
            var parts = file.split(".");
            var ext = parts[parts.length - 1] ; // me quedo con la extension
        }
        //TODO: sacado temporalmente
        /*if (ext !== "vtk"){
            toReturn = false;
            _errors["file"] = "only files with vtk extention are allowed";
        }*/
        var otherFiles = _getFilesAsObject(this.props.table.level.files);
        if (toReturn && otherFiles[file] != null){
            toReturn = false;
            _errors["file"] = "you already have a file with that name";
        }
        var otherFolders = _getFoldersAsObject(this.props.table.level.folders);
        if (toReturn && otherFolders[file] != null){
            toReturn = false;
            _errors["file"] = "you already have a folder with that name";
        }
        this.setState( { errors : _errors });
        return toReturn;
    }

    _handleFileSelect(e) {
        var epe = e.target.files[0];
        this.setState({file:epe},()=>{
            this._isValid();
        });
    }

    _cancelForm(){
        this.props.callback();
    }
      
    render(){
        var error = this.state.errors.file;
        return (
            <div className="jumbotron">
                <div className="middle">
                    <h1>File Upload</h1>
                    <input type="file" name="file" onChange = { this._handleFileSelect } />
                    <br/>
                    { error && <span className={classnames('help-block', { 'text-danger': error })}>{error}</span> }
                    <div className="form-group">
                        <button onClick={ this._submitForm } className="btn btn-primary btn-lg"> Add </button>
                        <button onClick={ this._cancelForm } className="btn btn-danger btn-lg marginButton"> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

DoctorAddFileForm.propTypes = {
    callback : PropTypes.func.isRequired,
}    
function mapStateToProps(state) {
    return {
        auth : state.auth,
        table : state.table
    }
}

function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(DoctorAddFileForm);