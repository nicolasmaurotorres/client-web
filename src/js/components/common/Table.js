import React from 'react';
import PropTypes from 'prop-types'

class Table extends React.Component {
    render(){
        var columns = this.props.columns.map( (element) => {
            return <th className="table-active" scope="col" key={element}> { element } </th>    
        });
        
        var data = [];
        for (var i = 0; i < this.props.data.length; i++) {
            var item = this.props.data[i];
            var row = ( <tr className = "table-secondary" key = { item.email } id = { item.email }>
                            <td scope="row">{ (item.category === 0) ? "Doctor" : "Pladema" }</td>
                            <td>{ item.email }</td>
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