import React from 'react';
import PropTypes from 'prop-types'
import { IconFont } from 'react-contexify'

class TablePladema extends React.Component {
    render(){
        const { onClickItems, onMouseEnter } = this.props;
        var files = [];
        var folders = [];

        this.props.files.forEach(function(elem){
            var parts = elem.split(".");
            var extention = parts[parts.length-1]; // me quedo con la extencion
            var row = ( <tr className = "table-secondary" key = { elem } id = { "file-"+elem+"-"+extention }>
                            <td onClick = { onClickItems } scope="row" name={ elem } onMouseEnter = { onMouseEnter }><IconFont className = "fa fa-file-text-o"/> </td>
                            <td onClick = { onClickItems } onMouseEnter = { onMouseEnter }>{ elem }</td>
                        </tr>);
            files.push(row);
        });

        this.props.folders.forEach(function(elem){
            var row = (<tr className = "table-secondary" key = { elem } id = { "folder-"+elem }>
                        <td onClick = { onClickItems } scope="row" name={ elem.Folder } onMouseEnter = { onMouseEnter }><IconFont className = "fa fa-folder-o"/> </td>
                        <td onClick = { onClickItems } onMouseEnter = { onMouseEnter }>{ elem }</td>
                       </tr>
            );
            folders.push(row);
        });
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
                        { folders }
                        { files }
                    </tbody>
                </table>
            </div>
        );
    }
}

TablePladema.PropTypes = {
    files : PropTypes.array.isRequired,
    folders : PropTypes.array.isRequired,
    onClickItems : PropTypes.func.isRequired,
    onMouseEnter : PropTypes.func.isRequired,
}

export default TablePladema;