import React from 'react';
import PropTypes from 'prop-types'

class TableDoctor extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            data : []
        };

        /* Bindings */
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(e){
        console.log("me clickeaste gato");
    }

    render(){
        var data = [];
        for (var i = 0; i < this.props.data.length; i++) {
            var item = this.props.data[i];
            var row = ( <tr className = "table-secondary" key = { item[1] } id = { item[1] }>
                            <td scope="row" name={ item[1] }> { item[0] } </td>
                            <td>{ item[1] }</td>
                        </tr>);
            data.push(row);
        }

        return (
            <div className="bs-component">
                <table className="table table-hover">
                    <thead>
                        <tr> 
                            <th className="table-active" scope="col" key="type"> type </th>    
                            <th className="table-active" scope="col" key="name"> name </th>
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

TableDoctor.PropTypes = {
    data : PropTypes.array.isRequired,
}

export default TableDoctor;