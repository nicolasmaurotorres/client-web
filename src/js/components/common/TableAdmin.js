import React from 'react';
import PasswordMask from '../common/PasswordMask';
import { connect } from 'react-redux'

class TableAdmin extends React.Component {
    constructor(props){
        super(props);

        /* Bindings */
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e){
        console.log("me clickeaste gato");
    }
    
    render(){
        var columns = ["Category","Email","Password"];
        columns = columns.map( (element) => {
            return <th className="table-active" scope="col" key={element}> { element } </th>    
        });
        var body = [];
        var data = this.props.table.content;
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var row = ( <tr className = "table-secondary" key = { item.email } id = { item.email }>
                            <td scope="row" name={item.category}>{ (item.category === 0) ? "Doctor" : "Pladema" }</td>
                            <td>{ item.email }</td>
                            <td><PasswordMask id = { item.email }
                                              name = "password"
                                              placeholder = "Enter password"
                                              value = { item.password }
                                              onChange = { this.handleChange }
                                              editable = { false } /></td>
                        </tr>);
            body.push(row);
        }

        return (
            <div className="bs-component">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            { columns }
                        </tr>
                    </thead>
                    <tbody>
                        { body }
                    </tbody>
                </table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        table : state.table
    }
}

function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(TableAdmin);