import React from 'react';
import PropTypes from 'prop-types'
import TextFieldGroup from '../../common/TextFieldGroup'
import validator from 'validator'

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
    }

    componentWillMount(){
        var files = {};
        var folders = {};
        for (var i = 0; i < this.props.files.length; i++ ){
            files[this.props.files[i]] = i;
        }
        for (var i = 0; i < this.props.folders.length; i++ ){
            folders[this.props.folders[i]] = i;
        }
        this.setState({ files, folders, path : this.props.path});
    }

    _submitForm(){
        if (this._isValid()){
            var obj = {}
            const { plademaAddFolder , callback } = this.props;
            obj["folder"] = this.state.path +"/"+ this.state.name;
            plademaAddFolder(obj)
            .then((response)=>{
                callback(true,this.state.name);
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
        this.props.callback(false);
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
    plademaAddFolder : PropTypes.func.isRequired,
    files : PropTypes.array.isRequired,
    folders : PropTypes.array.isRequired,
    path : PropTypes.string.isRequired,
}

export default PlademaAddFolderForm;