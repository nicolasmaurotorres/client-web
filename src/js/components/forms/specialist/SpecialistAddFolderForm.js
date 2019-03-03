import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import validator from 'validator';
import TextFieldGroup from '../../common/TextFieldGroup';
import { _getFilesAsObject, _getFoldersAsObject, _getPathAsString, _getFoldersAsArray } from '../../../utils/tableFunctions';
import { addFlashMessage } from '../../../actions/flashMessagesActions';
import { specialistAddFolder } from '../../../actions/specialistActions';
import { _nextNode } from '../../../utils/tableFunctions';
import { setCurrentLevel } from '../../../actions/tableActions';

class SpecialistAddFolderForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            name: "",
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
        this._callbackAddFolder = this._callbackAddFolder.bind(this);
    }

    _callbackAddFolder(newFolder){
        var path = _getPathAsString(this.props.table.level.path);
        var nextNode = _nextNode(path,this.props.table.content);
        var auxNode = {
            Folder : path+"/" + newFolder,
            Files : [],
            SubFolders : []
        };
        nextNode.SubFolders.push(auxNode);
        this.props.dispatch(setCurrentLevel({
            files : this.props.table.level.files,
            folders : _getFoldersAsArray(nextNode),
            path: this.props.table.level.path,
            position : this.props.table.level.position
        }));
    }    

    _submitForm(){
        if (this._isValid()){
            const newFolder = this.state.name;
            var obj = {
                folder : (this.props.table.level.position === 0) ? newFolder : _getPathAsString(this.props.table.level.path,1) +"/"+ newFolder
            };
            specialistAddFolder(obj)
            .then((response)=>{
                this._callbackAddFolder(newFolder);
                this.props.callback();
            })
            .catch((response)=>{
                this.props.dispatch(addFlashMessage({
                    type:"error",
                    text:"network error - specialistAddFolderForm - _submitForm"
                }));
            });
        }
    }

    _isValid(){
        var toReturn = true;
        var name = this.state.name;
        name = name.trim();
        var _errors = {};
        var res = name.match(/^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/i); // solo letras y numeros 
        if (res === null){
            toReturn = false;
            _errors["name"] = "only can contains numbers and letters the name of the pacient";
        }
        if (toReturn && validator.isEmpty(name)){
            toReturn = false;
            _errors["name"] = "the name cannot be empty";
        }   
        var files =_getFilesAsObject(this.props.table.level.files);
        if (toReturn && files[name] != null){
            toReturn = false;
            _errors["name"] = "you already have a file with that name";
        }  
        var folders = _getFoldersAsObject(this.props.table.level.folders);
        if (toReturn && folders[name] != null){
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
                        <button onClick={ this._submitForm } className="btn btn-primary btn-lg"> Add </button>
                        <button onClick={ this._cancelForm } className="btn btn-danger btn-lg marginButton"> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

SpecialistAddFolderForm.propTypes = {
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


export default connect(mapStateToProps,mapDispatchToProps)(SpecialistAddFolderForm);