import React from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames'

class PlademaAddFileForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors : {},
            file : null,
            folders : [],
            files : [],
            path : ""
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._handleFileSelect = this._handleFileSelect.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
    }

    componentWillMount(){
        this.setState({files : this.props.files,
                      folders : this.props.folders,
                      path : this.props.path});
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const { doctorAddFile, callbackAddOrCancel } = this.props;
            const { file, actualPath }  = this.state;
            var formData = new FormData();
            var name = file.name;
            formData.append("file", file);
            formData.append("folder", path)
            doctorAddFile(formData)
            .then((response)=>{
                var params = {
                    update : true,
                    fileName : name
                };
                callbackAddOrCancel(params);
            })
            .catch((response)=>{
                var params = {
                    update : false
                };
                callbackAddOrCancel(params);
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
        var params = {
            update : false
        }
        this.props.callback(params);
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

PlademaAddFileForm.propTypes = {
    callback : PropTypes.func.isRequired,
    doctorAddFile : PropTypes.func.isRequired,
    files : PropTypes.object.isRequired,
    folders : PropTypes.object.isRequired,
    path : PropTypes.string.isRequired,
}    

export default PlademaAddFileForm;