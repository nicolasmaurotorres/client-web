import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import validator from 'validator'
import { connect } from 'react-redux';
import { addFlashMessage } from '../../actions/flashMessages'
import { doctorRenameFile } from '../../actions/doctorActions'
import { _getPathAsString, _nextNode } from '../../utils/tableFunctions'
import { setCurrentLevel } from '../../actions/tableActions';

class DoctorRenameFileForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            actualName : "",
            name: "",
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
        this._updateTable = this._updateTable.bind(this);
    }

    _updateTable(newFileName,oldFileName){
        const { username } = this.props.auth.user;
        var actualPath = username + "/" + _getPathAsString(this.props.table.level.path);
        var node = _nextNode(actualPath,this.props.table.content);
        var found = false;
        var arrFiles = node.Files;
        for (var i = 0; i < arrFiles.length && !found; i++){
            if (arrFiles.Files[i] === oldFileName){
                arrFiles.Files[i] = newFileName;
                found = true;
            }
        }
        this.props.dispatch(setCurrentLevel({
            files : arrFiles,
            folders : this.props.table.level.folders,
            path: this.props.table.level.path,
            position : this.props.table.level.position
        }));
    }
    
    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const { fileExtension } = this.props;
            var newName = this.state.name+ "."+ fileExtension;
            var oldName = this.state.actualName + "."+ fileExtension;
            obj["filenew"] =  newName;// le agrego la extension al renombrarlos
            obj["fileold"] = oldName;
            obj["folder"] = this.state.actualPath;
            doctorRenameFile(obj)
            .then((response)=>{
                this._updateTable(newName,oldName);
                this.props.callback();
            })
            .catch((response)=>{
                this.props.dispatch(addFlashMessage({
                    type:"error",
                    text:"network error - DoctorRenameFileForm - _submitForm"
                }));
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
        this.props.callback();
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
    fileToRename : PropTypes.string.isRequired,
    fileExtension : PropTypes.string.isRequired,
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
        auth : state.auth
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DoctorRenameFileForm);