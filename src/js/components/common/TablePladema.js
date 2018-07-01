import React from 'react';
import PropTypes from 'prop-types'
import { IconFont } from 'react-contexify'

class TableDoctor extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            files: {},
            folders : {}
        };

        /* Bindings */
        this._updateState = this._updateState.bind(this);
    }
    
    _updateState(props){
        const { onClickItems, onMouseEnter } = props;
        var files = [];
        var folders = [];
        props.files.forEach(function(elem){
            var parts = elem.split(".");
            var extention = parts[parts.length-1]; // me quedo con la extencion
            var row = ( <tr className = "table-secondary" key = { elem } id = { "file-"+elem+"-"+extention }>
                            <td onClick = { onClickItems } scope="row" name={ elem } onMouseEnter = { onMouseEnter }><IconFont className = "fa fa-file-text-o"/> </td>
                            <td onClick = { onClickItems } onMouseEnter = { onMouseEnter }>{ elem }</td>
                        </tr>);
            files.push(row);
        });

        props.folders.forEach(function(elem){
            var row = (<tr className = "table-secondary" key = { elem.Folder } id = { "folder-"+elem.Folder }>
                        <td onClick = { onClickItems } scope="row" name={ elem.Folder } onMouseEnter = { onMouseEnter }><IconFont className = "fa fa-folder-o"/> </td>
                        <td onClick = { onClickItems } onMouseEnter = { onMouseEnter }>{ elem.Folder }</td>
                       </tr>
            );
            folders.push(row);
        });
        this.setState({files,folders});
    }

    componentWillMount(){
        this._updateState(this.props);
    }

    componentWillUpdate(nextProps){
        this._updateState(nextProps)
    }

    render(){
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
                        { this.state.folders }
                        { this.state.files }
                    </tbody>
                </table>
            </div>
        );
    }
}

TableDoctor.PropTypes = {
    files : PropTypes.array.isRequired,
    folders : PropTypes.array.isRequired,
    onClickItems : PropTypes.func.isRequired,
    onMouseEnter : PropTypes.func.isRequired,
}

export default TableDoctor;