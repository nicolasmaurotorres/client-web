import React from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { connect } from 'react-redux';

import { technicianAddFile } from '../../../actions/technicianActions'
import { _nextNode, _getFoldersAsObject, _getFilesAsObject, _getPathAsString } from '../../../utils/tableFunctions';
import { setTableState, setCurrentLevel } from '../../../actions/tableActions';
import { setSpinnerState } from '../../../actions/spinnerActions';

class TechnicianAddFileForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            file: null,
            folders : [],
            files : [],
            path: ""
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._handleFileSelect = this._handleFileSelect.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
        this._callbackAddFile = this._callbackAddFile.bind(this);
    }

    componentWillMount(){
        this.setState({files : _getFilesAsObject(this.props.table.level.files),
                       folders : _getFoldersAsObject(this.props.table.level.folders),
                       path : _getPathAsString(this.props.table.level.path) });
    }

    _submitForm(){
        if (this._isValid()){
            const { callback } = this.props;
            const { file, path }  = this.state;
            var formData = new FormData();
            var name = file.name;
            formData.append("file", file);
            formData.append("folder", path);
            this.props.dispatch(setSpinnerState({
                state:true
            }));
            technicianAddFile(formData)
            .then((response)=>{
                this.props.dispatch(setSpinnerState({
                    state:false
                }));
                callback();
                this._callbackAddFile(name);
            })
            .catch((response)=>{
                this.props.dispatch(setSpinnerState({
                    state:false
                }));
                callback();
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
        
        if (ext !== "vtk"){
            toReturn = false;
            _errors["file"] = "only files with vtk extention are allowed";
        }
        
        if (toReturn && this.state.files[file] != null){
            toReturn = false;
            _errors["file"] = "you already have a file with that name";
        }

        if (toReturn && this.state.folders[file] != null){
            toReturn = false;
            _errors["file"] = "you already have a folder with that name";
        }

        this.setState( { errors : _errors });
        return toReturn;
    }

    _handleFileSelect(e) {
        this.setState({file:e.target.files[0]},()=>{
            this._isValid();
        });
    }

    _cancelForm(){
        this.props.callback(false);
    }
      
    _callbackAddFile(newFile){
        
        var found = false;
        var currentPath = _getPathAsString(this.props.table.level.path);
        var _content = this.props.table.content;
        var aux = null;
        for (var i = 0; i < _content.length && !found; i++){
            aux = _nextNode(currentPath,_content[i]);
            if (aux !== null){
                found = true;
            }
        }
        aux.Files.push(newFile);
        this.props.dispatch(setTableState({
            content : _content
        }));
        var _files = this.props.table.level.files;
        _files.push(newFile);
        this.props.dispatch(setCurrentLevel({
            files : _files,
            folders : this.props.table.level.folders,
            path: this.props.table.level.path,
            position : this.props.table.level.position
        }));
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

TechnicianAddFileForm.PropTypes = {
    callback : PropTypes.func.isRequired,
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
  
export default connect(mapStateToProps,mapDispatchToProps)(TechnicianAddFileForm);