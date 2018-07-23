import React from 'react';
import PropTypes from 'prop-types'
import { IconFont } from 'react-contexify'
import { connect } from 'react-redux';
import { setCurrentLevel } from '../../actions/tableActions'

class TablePladema extends React.Component {
    constructor(props){
        super(props);

        /*bindings*/
        this._handleOnClickTableItem = this._handleOnClickTableItem.bind(this);
        this._nextNode = this._nextNode.bind(this);
        this._getFiles = this._getFiles.bind(this);
        this._getFolders = this._getFolders.bind(this);
        this._getPath = this._getPath.bind(this);
        this._handleClickPath = this._handleClickPath.bind(this);
    }

    /**
    * Dado un path de carpeta devuelve el nodo donde esta es esa carpetaen el arbol
    * 
    * @param {number} first Path de la carpeta
    * @param {number} second arbol a buscar
    * @returns {number} nodo donde esta la carpeta
    */
   _nextNode(name,node) {
        if (node.Folder === name){
            return node;
        }
        for(var i = 0; i < node.SubFolders.length; i++){
            var aux = this._nextNode(name,node.SubFolders[i]);
            if (aux != null){
                return aux
            }
        }
        return null;
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
                for (var i = 0; i < this.props.table.content.length && !found; i++) {
                    var nextNode = this._nextNode(path,this.props.table.content[i]); // busco la carpeta para abrirla
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
                        path : this._getPath(nextNode),
                        files : this._getFiles(nextNode),
                        folders : this._getFolders(nextNode),
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

    _getFolders(nodo) {
        var auxFolders = [];
        nodo.SubFolders.forEach(function (element) {
            var parts = element.Folder.split("/");
            auxFolders.push(parts[parts.length-1]); // obtengo el ultimo a la derecha
        });
        return auxFolders;
    }

    _getPath(node) {
        return node.Folder.split('/');
    }

    _getFiles(nodo) {
        var auxFiles = [];
        nodo.Files.forEach(function (elem) {
           auxFiles.push(elem);
        });
        return auxFiles;
    }

    _handleClickPath(e){
        var target = e.target.innerText; // un item del path clickeado, vuelvo a esa carpeta
        var index = this.props.table.level.path.indexOf(target);
        if (index === -1){ // hizo click en Home
            //click en el principio de todo, vuelvo al estado inicial.
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
            var nextTarget = "";
            for(var i = 0; i < index; i++){
                nextTarget = nextTarget + this.props.table.level.path[i] + "/";
            }
            nextTarget = nextTarget + target;
            var nextNode = null;
            var found = false;
            for (var i = 0; i < this.props.table.content.length && !found; i++){
                var nextNode = this._nextNode(nextTarget,this.props.table.content[i]); // busco la carpeta para abrirla
                if (nextNode !== null){
                    found = true;
                }
            }
            this.props.dispatch(setCurrentLevel({
                path : this._getPath(nextNode),
                files : this._getFiles(nextNode),
                folders : this._getFolders(nextNode),
                position : index+1
            }));
        }
    }
    
    render(){
        var path = ["/",<label key = "Home" onClick = { this._handleClickPath } style={{cursor:"pointer"}}> Home </label>];
        this.props.table.level.path.forEach((item) => {
            if (item !== "/"){
                path.push("/");
                path.push(<label key = { item } onClick = { this._handleClickPath } style={{cursor:"pointer"}}>{ item }</label>);
            } else {
                path.push(<label key = { item } onClick = { this._handleClickPath } style={{cursor:"pointer"}}>{ item }</label>);
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
            var row = (<tr className = "table-secondary" key = { elem } id = { "folder-"+elem }>
                        <td onClick = { handleOnClickTableItem } scope="row" name={ elem.Folder } onMouseEnter = { onMouseEnter }><IconFont className = "fa fa-folder-o"/> </td>
                        <td onClick = { handleOnClickTableItem } onMouseEnter = { onMouseEnter }>{ elem }</td>
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

TablePladema.PropTypes = {
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
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TablePladema);