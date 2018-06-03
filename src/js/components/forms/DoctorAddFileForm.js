import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import validator from 'validator'
import classnames from 'classnames'

class DoctorAddFileForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            file: null,
            otherFolders : [],
            otherFiles : [],
            actualPath:""
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._handleFileSelect = this._handleFileSelect.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
    }

    componentWillMount(){
        this.setState({otherFiles : this.props.otherFiles,
                      otherFolders : this.props.otherFolders,
                      actualPath : this.props.actualPath});
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const { doctorAddFile, callbackAddOrCancel } = this.props;
            const { file, actualPath }  = this.state;
            var formData = new FormData();
            var name = file.name;
            formData.append("file", file);
            formData.append("folder", actualPath)
            doctorAddFile(formData)
            .then((response)=>{
                callbackAddOrCancel(true,name);
            })
            .catch((response)=>{
                callbackAddOrCancel(false);
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
        
        if (toReturn && this.state.otherFiles[file] != null){
            toReturn = false;
            _errors["file"] = "you already have a file with that name";
        }

        if (toReturn && this.state.otherFolders[file] != null){
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
        this.props.callbackAddOrCancel(false);
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
    callbackAddOrCancel : PropTypes.func.isRequired,
    doctorAddFile : PropTypes.func.isRequired,
    otherFiles : PropTypes.object.isRequired,
    otherFolders : PropTypes.object.isRequired,
    actualPath : PropTypes.string.isRequired,
}    

export default DoctorAddFileForm;