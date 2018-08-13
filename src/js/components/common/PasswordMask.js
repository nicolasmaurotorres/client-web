import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../css/passwordField.scss';
import zxcvbn from 'zxcvbn';

class ShowPassword extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      type: 'password',
      score: 'null',
      value : "",
      showStrongPassword : false,
      showTitle : false,
      editable : true
    }
    /* binding */
    this.showHide = this.showHide.bind(this);
    this.onChange = this.onChange.bind(this);
    this._controlState = this._controlState.bind(this);
  }
  
  _controlState(props){
    
    if (typeof this.props.value  !== 'undefined'){ // dado que no es requerido
     this.setState({ value : props.value});
     }

    if (typeof props.showStrongPassword  !== 'undefined'){ // dado que no es requerido
      this.setState({showStrongPassword : props.showStrongPassword}); 
    }

    if (typeof props.showTitle  !== 'undefined'){ // dado que no es requerido
      this.setState({showTitle : props.showTitle}); 
    }

    if (typeof props.editable  !== 'undefined'){ // dado que no es requerido
      this.setState({editable : props.editable}); 
    }
  }

  componentWillMount(){
    this._controlState(this.props);
  }

  componentWillReceiveProps(newProps){
    var actualProps = this.props;
    if (actualProps.value !== newProps.value){
      this.setState({value:newProps.value});
    }
  }
  
  showHide(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    })  
  }
  
  onChange(e){
    if (this.state.editable){
      if(e.target.value === ''){
         this.setState({
           score: 'null', value : e.target.value
         });
      } else {
         var pw = zxcvbn(e.target.value);
         this.setState({
           score: pw.score, value : e.target.value
         });      
      }
      if (typeof this.props.onChange !== 'undefined'){
         this.props.onChange(e);
      }
    }
  }
  
  render(){
    const { name } = this.props;
    var value = "";
    
    return(
      <div className="form-group"> 
      { this.state.showTitle && <label className="control-label" > Password </label>}
      <div className="password">
      <input name={ name } type={this.state.type}  className="password__input" onChange={this.onChange} value={ this.state.value }  disabled = { (this.state.editable) ? "" : "disabled" }/>
      <span className="password__show" onClick={this.showHide}>{this.state.type === 'input' ? 'Hide' : 'Show'}</span>
      { this.state.showStrongPassword && <span className="password__strength" data-score={this.state.score} />}
      </div>
      </div>
    )
  }
}

ShowPassword.PropTypes = {
  value : PropTypes.string,
  showStrongPassword : PropTypes.bool,
  showTitle : PropTypes.bool,
  editable : PropTypes.bool,
  onChange : PropTypes.func,
  name : PropTypes.string.isRequired
}

export default ShowPassword;