import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import validator from 'validator'

class DoctorRenameFileForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            actualName : "",
            name: "",
            otherFolders : {},
            otherFiles: {},
            actualPath : ""
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
    }

    componentWillMount(){
        const { otherFolders, otherFiles,fileToRename,actualPath } = this.props;
        this.setState({otherFolders, otherFiles, actualPath, actualName : fileToRename, name : fileToRename});
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const { doctorRenameFile , callbackRenameOrCancel,fileExtension} = this.props;
            var newName = this.state.name+ "."+ fileExtension;
            var oldName = this.state.actualName + "."+ fileExtension;
            obj["filenew"] =  newName;// le agrego la extension al renombrarlos
            obj["fileold"] = oldName;
            obj["folder"] = this.state.actualPath;
            doctorRenameFile(obj)
            .then((response)=>{
                callbackRenameOrCancel(true,newName,oldName);
            })
            .catch((response)=>{
                callbackRenameOrCancel(false);
            });
        }
    }

    _isValid(){
        var toReturn = true;
        var name = this.state.name;
        name = name.trim();
        var _errors = {};
        var res = name.match(/^[a-zA-Z0-9 _]+$/i); // solo letras y numeros 
        if (res === null){
            toReturn = false;
            _errors["name"] = "only can contains numbers and letters the name of the file";
        }
        
        if (toReturn && validator.isEmpty(name)){
            toReturn = false;
            _errors["name"] = "the name cannot be empty";
        }   
        
        if (toReturn && this.state.actualName === name){
            toReturn = false;
            _errors["name"] = "the name cannot be the same as the old one"
        }

        if (toReturn && this.state.otherFiles[name] != null){
            toReturn = false;
            _errors["name"] = "you already have a file with that name";
        }   
        
        if (toReturn && this.state.otherFolders[name] != null){
            toReturn = false;
            _errors["name"] = "you already have a folder with that name";
        }   

        this.setState( { errors : _errors });
        return toReturn;
    }

    _onChange(e) {
        this.setState({ [e.target.name]: e.target.value },()=>{
            this._isValid();
        });
        
    }

    _cancelForm(){
        this.props.callbackRenameOrCancel(false);
    }
    
    render(){
        return (
            <div className="jumbotron">
                <div className="middle">
                    <TextFieldGroup
                        error = { this.state.errors.name }
                        label="Nombre"
                        onChange = { this._onChange }
                        value = { this.state.name }
                        field = "name" />

                    <div className="form-group">
                        <button onClick={ this._submitForm } className="btn btn-primary btn-lg"> Rename </button>
                        <button onClick={ this._cancelForm } className="btn btn-danger btn-lg marginButton"> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

DoctorRenameFileForm.propTypes = {
    callbackRenameOrCancel : PropTypes.func.isRequired,
    doctorRenameFile : PropTypes.func.isRequired,
    addFlashMessage : PropTypes.func.isRequired,
    otherFolders : PropTypes.object.isRequired,
    otherFiles : PropTypes.object.isRequired,
    fileToRename : PropTypes.string.isRequired,
    actualPath : PropTypes.string.isRequired,
    fileExtension : PropTypes.string.isRequired
}

export default DoctorRenameFileForm;