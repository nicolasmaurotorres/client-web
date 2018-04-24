import React from 'react';
import PropTypes from 'prop-types'
import PasswordMask from '../common/PasswordMask';

class Table extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            passwords: [],
            data : []
        };

        /* Bindings */
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e){
        console.log("me clickeaste gato");
        debugger;
    }

    componentWillMount(){
        var passwords = [];
        for (var i = 0; i < this.props.data.length; i++) {
            var item = this.props.data[i];
            var user = [item.email , item.password];
            passwords.push(user);
        }
        this.setState({passwords});
    }


    render(){
        var columns = this.props.columns.map( (element) => {
            return <th className="table-active" scope="col" key={element}> { element } </th>    
        });

        var data = [];
        for (var i = 0; i < this.props.data.length; i++) {
            var item = this.props.data[i];
            var row = ( <tr className = "table-secondary" key = { item.email } id = { item.email }>
                            <td scope="row" name={item.category}>{ (item.category === 0) ? "Doctor" : "Pladema" }</td>
                            <td>{ item.email }</td>{/*disable package css*/}
                            <td><PasswordMask useVendorStyles = {true}
                                              id = { item.email }
                                              name = "password"
                                              placeholder = "Enter password"
                                              value = { item.password }
                                              onChange = { this.handleChange }/></td>
                        </tr>);
            data.push(row);
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
                        { data }
                    </tbody>
                </table>
            </div>
        );
    }
}

Table.PropTypes = {
    columns : PropTypes.array.isRequired,
    data : PropTypes.array.isRequired,
}

export default Table;