import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import validator from 'validator'
import { connect } from 'react-redux';
import { setCurrentLevel } from '../../actions/tableActions';
import { addFlashMessage } from '../../actions/flashMessages';

class DoctorRenamePacientForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            actualName : "",
            name: "",
            otherPacients : [],
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
        this._onConfirmRenamePacient = this._onConfirmRenamePacient.bind(this);
    }

    componentWillMount(){
        const { pacientToRename } = this.props;
        this.setState({actualName : pacientToRename, name : pacientToRename});
    }

    _onConfirmRenamePacient(newFolderName,oldFolderName){
        const { username } = this.props.auth.user;
        var previousFolder = username+"/";
        var split = oldFolderName.split("/");
        for (var i = 0; i < split.length-1; i++){ // me paro en la carpeta que lo contiene al viejo nombre
            previousFolder += split[i] + "/";
        }
        previousFolder = previousFolder.substring(0,previousFolder.length-1);  // quito el ultimo /
        var nextNode = _nextNode(previousFolder,this.props.table.content);
        var toRename = username+"/"+oldFolderName;
        var newNameFolder = username+"/"+newFolderName;
        var found = false;
        var i = 0;
        while (!found && i < nextNode.SubFolders.length){
            if (nextNode.SubFolders[i].Folder === toRename){
                nextNode.SubFolders[i].Folder = newNameFolder;
                found = true;
            } else {
                i++;
            }
        }
        this.props.dispatch(setCurrentLevel({
            files : this.props.table.level.files,
            folders : _getFoldersAsArray(nextNode),
            path: this.props.table.level.path,
            position : this.props.table.level.position
        }));
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const newName = this.state.name;
            const oldName = this.state.actualName;
            obj["newfolder"] = newName;
            obj["oldfolder"] = oldName;
            doctorRenamePacient(obj)
            .then((response)=>{
                this.props.callback();
                this._onConfirmRenamePacient(newName,oldName);
            })
            .catch((response)=>{
                   this.props.dispatch(addFlashMessage({
                    type:"error",
                    text:"network error - DoctorRenamePacientForm - _submitForm"
                }));
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
        
        if (toReturn && this.state.actualName === name){
            toReturn = false;
            _errors["name"] = "the name cannot be the same as the old one"
        }

        if (toReturn && this.state.otherPacients[name] != null){
            toReturn = false;
            _errors["name"] = "you already have a pacient with that name";
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

DoctorRenamePacientForm.propTypes = {
    callback: PropTypes.func.isRequired,
    pacientToRename : PropTypes.string.isRequired
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

export default  connect(mapStateToProps,mapDispatchToProps)(DoctorRenamePacientForm);