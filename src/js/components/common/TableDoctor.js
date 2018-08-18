import React from 'react';
import PropTypes from 'prop-types'
import uuid from 'uuid';
import { connect } from 'react-redux';
import { IconFont } from 'react-contexify'

import { setCurrentLevel } from '../../actions/tableActions'
import { _nextNode, _getFilesAsArray, _getPathAsArray, _getFoldersAsArray } from '../../utils/tableFunctions';


class TableDoctor extends React.Component {
    constructor(props){
        super(props);

        /*bindings*/
        this._handleOnClickTableItem = this._handleOnClickTableItem.bind(this);
        this._handleClickPath = this._handleClickPath.bind(this);
    }
    
    _handleOnClickTableItem(e){
        var parent = e.target.parentElement;
        var idArray = parent.id.split("-"); 
        var nameTarget = "";
        for (var i = 1; i < idArray.length; i++){ // el nombre del archivo o carpeta puede contener "-", pero el primer elemento (0), es el folder ó file element
            nameTarget = nameTarget + idArray[i] + "-";
        }
        nameTarget = nameTarget.substr(0,nameTarget.length - 1); // quito el ultimo "-"
        // tengo que armar el path
        var path = "";
        for (var i = 0; i < this.props.table.level.path.length; i++){//arranco en 1 para no poner el primer /
            path = path + this.props.table.level.path[i] + "/";
        }
        path = path + nameTarget;
        switch (idArray[0]){
            case "folder":{
                // estoy en el nivel inicial, cambio a una subcarpeta
                var nextNode = null;
                var found = false;
                for (var i = 0; i < this.props.table.content.SubFolders.length && !found; i++) {
                    var nextNode = _nextNode(path,this.props.table.content.SubFolders[i]); // busco la carpeta para abrirla
                    if (nextNode !== null){
                        found=true;
                    }
                }
                if (nextNode === null){
                    // significa que hizo click en Home del path, tengo que cargarlo de 0
                    var auxFolders = [];
                    this.props.table.content.forEach(function(elem){
                        auxFolders.push(elem.Folder);
                    });
                    this.props.dispatch(setCurrentLevel({
                        path : [],
                        files : [],
                        folders : auxFolders,
                        position : 0
                    }));
                } else {
                    this.props.dispatch(setCurrentLevel({
                        path : _getPathAsArray(nextNode),
                        files : _getFilesAsArray(nextNode),
                        folders : _getFoldersAsArray(nextNode),
                        position : this.props.table.level.position+1
                    }));
                }
                break;
            }
            case "file":
                console.log("en teoria no tendria que haber ningun archivo sin paciente!");
                break;
        }
    }
    
    _handleClickPath(e){
        var target = e.target.innerText; // un item del path clickeado, vuelvo a esa carpeta
        var index = this.props.table.level.path.indexOf(target);
        if (index === 0 || index === -1){ // hizo click en Home o en el email
            //click en el principio de todo, vuelvo al estado inicial.
            this.props.dispatch(setCurrentLevel({
                path : [this.props.auth.user.username],
                files : [],
                folders : _getFoldersAsArray(this.props.table.content),
                position : 0
            }));
        } else {
            var nextTarget = "";
            for(var i = 0; i < index; i++){
                nextTarget = nextTarget + this.props.table.level.path[i] + "/";
            }
            nextTarget = nextTarget + target;
            var nextNode = null;
            var found = false;
            for (var i = 0; i < this.props.table.content.SubFolders.length && !found; i++){
                var nextNode = _nextNode(nextTarget,this.props.table.content.SubFolders[i]); // busco la carpeta para abrirla
                if (nextNode !== null){
                    found = true;
                }
            }
            this.props.dispatch(setCurrentLevel({
                path : _getPathAsArray(nextNode),
                files : _getFilesAsArray(nextNode),
                folders : _getFoldersAsArray(nextNode),
                position : index+1
            }));
        }
    }

    render(){
        var path = ["/",<label key = "Home" onClick = { this._handleClickPath } style={{cursor:"pointer"}}> Home </label>];
        this.props.table.level.path.forEach((item) => {
            if (item !== "/"){
                path.push("/");
                path.push(<label key = { uuid.v4() } onClick = { this._handleClickPath } style={{cursor:"pointer"}}>{ item }</label>);
            } else {
                path.push(<label key = { uuid.v4() } onClick = { this._handleClickPath } style={{cursor:"pointer"}}>{ item }</label>);
            }
        });

        const { onMouseEnter } = this.props;
        var files = [];
        var folders = [];
        var handleOnClickTableItem = this._handleOnClickTableItem;

        this.props.table.level.files.forEach(function(elem){
            var parts = elem.split(".");
            var extention = parts[parts.length-1]; // me quedo con la extencion
            var row = ( <tr className = "table-secondary" key = { elem } id = { "file-"+elem+"-"+extention }>
                            <td onClick = { handleOnClickTableItem } scope="row" name={ elem } onMouseEnter = { onMouseEnter }><IconFont className = "fa fa-file-text-o"/> </td>
                            <td onClick = { handleOnClickTableItem } onMouseEnter = { onMouseEnter }>{ elem }</td>
                        </tr>);
            files.push(row);
        });

        this.props.table.level.folders.forEach(function(elem){
            var folder = elem;
            var row = (<tr className = "table-secondary" key = {elem } id = { "folder-"+folder }>
                        <td onClick = { handleOnClickTableItem } scope="row" name={ folder } onMouseEnter = { onMouseEnter }><IconFont className = "fa fa-folder-o"/> </td>
                        <td onClick = { handleOnClickTableItem } onMouseEnter = { onMouseEnter }>{ folder }</td>
                       </tr>
            );
            folders.push(row);
        });

        return (
            <div>
                <div> { path } </div>
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
            </div>
        );
    }
}

TableDoctor.PropTypes = {
    onMouseEnter : PropTypes.func.isRequired,
}

function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    }
};

function mapStateToProps(state){
    return {
        table : state.table,
        auth: state.auth
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TableDoctor);