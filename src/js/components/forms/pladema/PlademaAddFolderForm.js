import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../../common/TextFieldGroup'
import validator from 'validator'
import { connect } from 'react-redux';
import { _nextNode, _getPathAsString, _getFoldersAsObject, _getFilesAsObject } from '../../../utils/tableFunctions'
import { setTableState, setCurrentLevel } from '../../../actions/tableActions';
import { plademaAddFolder } from '../../../actions/plademaActions';

class PlademaAddFolderForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            name: "",
            files : {},
            folders : {},
            path : ""
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
        this._callbackAddFolder = this._callbackAddFolder.bind(this);
    }

    componentWillMount(){
        var files = _getFilesAsObject(this.props.table.level.files);
        var folders = _getFoldersAsObject(this.props.table.level.folders);
        var path = _getPathAsString(this.props.table.level.path);
        this.setState({ files, folders, path});
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const { callback } = this.props;
            const _callbackAddFolder = this._callbackAddFolder;
            obj["folder"] = this.state.path +"/"+ this.state.name;
            plademaAddFolder(obj)
            .then((response)=>{
                callback();
                _callbackAddFolder(this.state.name);
            })
            .catch((response)=>{
                var errors = {};
                errors["name"] = (typeof response.response === 'undefined') ? response.message : response.response.data.message ;
                this.setState({errors});
            });
        }
    }

    _isValid(){
        var toReturn = true;
        var name = this.state.name;
        name = name.trim();
        var _errors = {};
        var res = name.match(/^[a-z0-9]+$/i); // solo letras y numeros 
        if (res === null){
            toReturn = false;
            _errors["name"] = "only can contains numbers and letters the name of the pacient";
        }
        
        if (toReturn && validator.isEmpty(name)){
            toReturn = false;
            _errors["name"] = "the name cannot be empty";
        }   
        
        if (toReturn && this.state.files[name] != null){
            toReturn = false;
            _errors["name"] = "you already have a file with that name";
        }  

        if (toReturn && this.state.folders[name] != null){
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
    
    _callbackAddFolder(newName){
        debugger;
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
        var newFolder = {
            Files:[],
            Folder:currentPath+"/"+newName,
            SubFolders:[]
        }
        aux.SubFolders.push(newFolder);
        this.props.dispatch(setTableState({
            content : _content
        }));
        var _folders = this.props.table.level.folders;
        _folders.push(newName);
        this.props.dispatch(setCurrentLevel({
            files : this.props.table.level.files,
            folders : _folders,
            path: this.props.table.level.path,
            position : this.props.table.level.position
        }));
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
                        <button onClick={ this._submitForm } className="btn btn-primary btn-lg"> Create </button>
                        <button onClick={ this._cancelForm } className="btn btn-danger btn-lg marginButton"> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

PlademaAddFolderForm.propTypes = {
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
};
  
export default  connect(mapStateToProps,mapDispatchToProps)(PlademaAddFolderForm);