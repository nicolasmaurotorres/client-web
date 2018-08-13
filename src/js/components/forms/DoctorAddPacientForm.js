import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../common/TextFieldGroup'
import validator from 'validator'
import { connect } from 'react-redux';
import { addFlashMessage } from '../../actions/flashMessages';
import { _getPathAsArray, _nextNode } from '../../utils/tableFunctions';
import { setCurrentLevel } from '../../actions/tableActions';

class DoctorAddPacientForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            errors: {},
            name: "",
            otherPacients : [],
        }

        /* bindings */
        this._submitForm = this._submitForm.bind(this);
        this._onChange = this._onChange.bind(this);
        this._isValid = this._isValid.bind(this);
        this._cancelForm = this._cancelForm.bind(this);
        this._onConfirmAddPacient = this._onConfirmAddPacient.bind(this);
    }

    componentWillMount(){
        this.setState({otherPacients : this.props.otherPacients});
    }

    _onConfirmAddPacient(newPacient){
        var path = _getPathAsArray(this.props.table.level.path);
        var node = _nextNode(path,this.props.table.content);
        node.SubFolders.push(newPacient);
        this.props.dispatch(setCurrentLevel({
            files : this.props.table.level.files,
            folders : _getFoldersAsArray(node),
            path: this.props.table.level.path,
            position : this.props.table.level.position
        }));
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const { callback } = this.props;
            const name = this.state.name;
            obj["folder"] = this.state.name;
            doctorAddPacient(obj)
            .then((response)=>{
                this._onConfirmAddPacient(name);
                callback(true);
            })
            .catch((response)=>{
                this.props.dispatch(addFlashMessage({
                    type:"error",
                    text:"network error - DoctorAddPacientForm - _submitForm"
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
        this.props.callbackCreateOrCancel();
    }
    
    _onClickCloseMessage(){
        this.setState({serverMessage:"",serverStatus:""});
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

DoctorAddPacientForm.propTypes = {
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

export default connect(mapStateToProps,mapDispatchToProps)(DoctorAddPacientForm);