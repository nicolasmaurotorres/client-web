import React from 'react';
import PropTypes from 'prop-types'

class TableDoctor extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            data : []
        };
    }
    
    render(){
        var data = [];
        const { onClickItems, onMouseEnter } = this.props;
        for (var i = 0; i < this.props.data.length; i++) {
            var item = this.props.data[i];
            var row = ( <tr className = "table-secondary" key = { item[1] } id = { item[2]+"-"+item[1] }>
                            <td onClick = { onClickItems } scope="row" name={ item[1] } onMouseEnter = { onMouseEnter }> { item[0] } </td>
                            <td onClick = { onClickItems } onMouseEnter = { onMouseEnter }>{ item[1] }</td>
                        </tr>);
            data.push(row);
        }

        return (
            <div className="bs-component">
                <table className="table table-hover">
                    <thead>
                        <tr> 
                            <th className="table-active" scope="col" key="type"> Type </th>    
                            <th className="table-active" scope="col" key="name"> Name </th>
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
    onClickItems : PropTypes.func.isRequired,
    onMouseEnter : PropTypes.func.isRequired,
}

export default TableDoctor;