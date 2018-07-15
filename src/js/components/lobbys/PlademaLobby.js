import React from 'react'
import TablePladema from '../common/TablePladema'
import { openModal } from '../../actions/modalActions'
import { connect } from 'react-redux';
import uuid from 'uuid'
import { ContextMenu, Item, ContextMenuProvider,IconFont } from 'react-contexify'
import { ModalContainer }  from '../common/Modal';
import ModalPlademaAddFolder from '../modals/pladema/ModalPlademaAddFolder';

  class CustomModalContent extends React.Component {
    render() {
      return (
        <div className="modal-content">Custom Modal Content</div>
      )
    }
  }

class PlademaLobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rawResponse: {},
            folders: [],
            files: [],
            path: [],
            isModalOpen : false,
            isFolder : false,
            idContextText : 'rightClickContextMenuInitialMenuFolder',
            level : 0
        };

        /* bindings */
        this._setFolders = this._setFolders.bind(this);
        this._setFiles = this._setFiles.bind(this);
        this._setPath = this._setPath.bind(this);

        this._getFolders = this._getFolders.bind(this);
        this._getFiles = this._getFiles.bind(this);
        this._getPath = this._getPath.bind(this);
        this._hoverTableItem = this._hoverTableItem.bind(this);
        this._handleOnClickTableItem = this._handleOnClickTableItem.bind(this);
        this._nextNode = this._nextNode.bind(this);
        this._updateTable = this._updateTable.bind(this);
        this._handleClickPath = this._handleClickPath.bind(this);
        this._init = this._init.bind(this);
        /*callbacks*/
        this._callbackTest = this._callbackTest.bind(this);
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
    
    _hoverTableItem(e){
        //cada vez que paso el mouse por encima de algo, cambio los menues que se muestran
        var parent = e.target.parentElement;
        if (this.state.initialLevel){
            this.setState({isFolder: true, idContextText:"rightClickContextMenuInitialMenuFolder"});
        } else {
            if (parent.id.includes("folder")){
                this.setState({isFolder: true, idContextText:"rightClickContextMenuNotInitialMenuFolder"});
            } else {
                this.setState({isFolder: false, idContextText:"rightClickContextMenuNotInitialMenuFile"});
                }
            }
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
        for (var i = 0; i < this.state.path.length; i++){//arranco en 1 para no poner el primer /
            path = path + this.state.path[i] + "/";
        }
        path = path + nameTarget;
        switch (idArray[0]){
            case "folder":{
                // estoy en el nivel inicial, cambio a una subcarpeta
                var nextNode = null;
                var found = false;
                for (var i = 0; i < this.state.rawResponse.length && !found; i++) {
                    var nextNode = this._nextNode(path,this.state.rawResponse[i]); // busco la carpeta para abrirla
                    if (nextNode !== null){
                        found=true;
                    }
                }
                if (nextNode === null){
                    // significa que hizo click en Home del path, tengo que cargarlo de 0
                    this._init(this.state.rawResponse);
                    this.setState({level: 0 })
                } else {
                    this._updateTable(nextNode);
                    var actualLevel = this.state.level + 1;
                    this.setState({level :actualLevel});
                }
                
                break;
            }
            case "file":
                console.log("en teoria no tendria que haber ningun archivo sin paciente!");
                break;
        }
    }    
    
    componentWillMount() {
        //mock de la respuesta del servidor
        var rawResponse = [{
            "Folder": "doctor",
            "Files": [],
            "SubFolders": [{
                "Folder": "doctor/paciente1",
                "Files": [],
                "SubFolders": [{
                    "Folder": "doctor/paciente1/carpeta2",
                    "Files": [],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor/paciente1/carpeta3asd",
                    "Files": [],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor/paciente1/carpeta4asd",
                    "Files": [],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor/paciente1/carpeta5dddd",
                    "Files": [],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor/paciente1/carpeta6rrrr",
                    "Files": [],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor/paciente1/carpeta7ggggg",
                    "Files": [],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor/paciente1/carpeta8ggg",
                    "Files": [],
                    "SubFolders": []
                }]
            },
            {
                "Folder": "doctor/paciente3",
                "Files": [
                    "imagen_procesada.vtk",
                    "imagen_procesada31.vtk",
                    "paciente31README.txt"
                ],
                "SubFolders": [{
                    "Folder": "doctor/paciente3/carpeta1",
                    "Files": [
                        "fantino final.jpg",
                        "its-something.jpg"
                    ],
                    "SubFolders": []
                }]
            },
            {
                "Folder": "doctor/paciente8",
                "Files": [
                    "README.txt",
                    "aM7GRjdb_700w_0.jpg",
                    "imagen_procesada31.vtk"
                ],
                "SubFolders": []
            },
            {
                "Folder": "doctor/paciente9",
                "Files": [],
                "SubFolders": []
            }]
        },
        {
            "Folder": "doctor1@doctor1.com",
            "Files": [],
            "SubFolders": [
                {
                    "Folder": "doctor1@doctor1.com/paciente4",
                    "Files": [
                        "README.txt",
                        "imagen_procesada.vtk",
                        "imagen_procesada31.vtk",
                        "paciente31README.txt"
                    ],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor1@doctor1.com/paciente5",
                    "Files": [
                        "README.txt",
                        "imagen_procesada.vtk",
                        "imagen_procesada31.vtk",
                        "paciente31README.txt"
                    ],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor1@doctor1.com/paciente6",
                    "Files": [
                        "README.txt",
                        "imagen_procesada.vtk",
                        "imagen_procesada31.vtk",
                        "paciente31README.txt"
                    ],
                    "SubFolders": []
                }
            ]
        },
        {
            "Folder": "doctor2@doctor2.com",
            "Files": [],
            "SubFolders": [
                {
                    "Folder": "doctor2@doctor2.com/paciente1",
                    "Files": [
                        "README.txt",
                        "imagen_procesada.vtk",
                        "imagen_procesada31.vtk",
                        "paciente31README.txt"
                    ],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor2@doctor2.com/paciente2",
                    "Files": [
                        "README.txt",
                        "imagen_procesada.vtk",
                        "imagen_procesada31.vtk",
                        "paciente31README.txt"
                    ],
                    "SubFolders": []
                },
                {
                    "Folder": "doctor2@doctor2.com/paciente3",
                    "Files": [
                        "README.txt",
                        "imagen_procesada.vtk",
                        "imagen_procesada31.vtk",
                        "paciente31README.txt"
                    ],
                    "SubFolders": []
                }
            ]
        }
        ];

               
        this.setState({ rawResponse: rawResponse});
        this._init(rawResponse);
    }

    _init(rawResponse){
        var auxFolders = [];
        rawResponse.forEach(function(elem){
            auxFolders.push(elem.Folder);
        });
        this.setState({folders: auxFolders, path:[], files:[] });
    }

    _updateTable(nodo){
        this._setFolders(nodo);        
        this._setPath(nodo);
        this._setFiles(nodo);
    }

    _setFolders(nodo) {
        var auxFolders = [];
        nodo.SubFolders.forEach(function (element) {
            var parts = element.Folder.split("/");
            auxFolders.push(parts[parts.length-1]); // obtengo el ultimo a la derecha
        });
        this.setState({ folders: auxFolders });
    }

    _setPath(path) {
        this.setState({ path : path.Folder.split('/') });
    }

    _setFiles(nodo) {
        var auxFiles = [];
        nodo.Files.forEach(function (elem) {
           auxFiles.push(elem);
        });
        this.setState({ files: auxFiles });
    }

    _getPath(){
        var toReturn = "";
        for(var i = 0; i < this.state.path.length; i++){
            toReturn = toReturn + this.state.path[i] + "/";
        }
        toReturn = toReturn.substring(0,toReturn.length-1); // quito el ultimo /
        return toReturn;
    }

    _getFiles(){
        var toReturn = {};
        for (var i = 0; i < this.state.files.length; i++){
            toReturn[this.state.files[i]] = i;
        }
        return toReturn;
    }

    _getFolders(){
        var toReturn = {};
        for (var i = 0; i < this.state.folders.length; i++){
            toReturn[this.state.folders[i]] = i;
        }
        return toReturn;
    }

    _handleClickPath(e){
        var target = e.target.innerText; // un item del path clickeado, vuelvo a esa carpeta
        var index = this.state.path.indexOf(target);
        if (index === -1){ // hizo click en Home
            //click en el principio de todo, vuelvo al estado inicial.
            this.setState({initialLevel:true, idContextText:"", path: [], level:0});
            this._init(this.state.rawResponse);
        } else {
            this.setState({level:index+1});
            var nextTarget = "";
            for(var i = 0; i < index; i++){
                nextTarget = nextTarget + this.state.path[i] + "/";
            }
            nextTarget = nextTarget + target;
            var nextNode = null;
            var found = false;
            for (var i = 0; i < this.state.rawResponse.length && !found; i++){
                var nextNode = this._nextNode(nextTarget,this.state.rawResponse[i]); // busco la carpeta para abrirla
                if (nextNode !== null){
                    found = true;
                }
            }
            this._updateTable(nextNode);
        }
    }

    _callbackTest(e){
        console.log('soy un callback test');
    }

    render() {
        const onClickAddFolder = ({event, ref,data,dataFromProvider}) => {
            this.props.dispatch(openModal({
                id: uuid.v4(),
                type: 'custom',
                content: <ModalPlademaAddFolder path = { this._getPath() } folders = { this._getFolders() } files = { this._getFiles() }/>,
                callback : this._callbackTest 
            }));
        }; 

        const onClickUploadFile = ({event, ref,data,dataFromProvider}) => {
            console.log('click on upload file');
        }; 
        
        const onClickDownloadFile = ({event, ref,data,dataFromProvider}) => {
            console.log('click on download file');
        }; 

        const NotInitialMenuFolder = () => (
            <ContextMenu  id='rightClickContextMenuNotInitialMenuFolder'>
                <Item onClick = { onClickUploadFile }><IconFont className = "fa fa-upload"/> Upload File </Item>
                <Item onClick = { onClickAddFolder }><IconFont className = "fa fa-plus"/> Create Folder </Item>
            </ContextMenu>
        );

        const NotInitialMenuFile = () => (
            <ContextMenu  id='rightClickContextMenuNotInitialMenuFile'>
                <Item onClick = { onClickDownloadFile }><IconFont className = "fa fa-download"/> Download </Item>
                <Item onClick = { onClickAddFolder }><IconFont className = "fa fa-plus"/> Create Folder </Item>
            </ContextMenu>
        );

        const idMenu = this.state.idContextText;
        const menu = (this.state.level < 2) ? null : ((this.state.isFolder) ? <NotInitialMenuFolder />: <NotInitialMenuFile />)

        var path = ["/",<label key = "Home" onClick = { this._handleClickPath } style={{cursor:"pointer"}}> Home </label>];
        this.state.path.forEach((item) => {
            if (item !== "/"){
                path.push("/");
                path.push(<label key = { item } onClick = { this._handleClickPath } style={{cursor:"pointer"}}>{ item }</label>);
            } else {
                path.push(<label key = { item } onClick = { this._handleClickPath } style={{cursor:"pointer"}}>{ item }</label>);
            }
        });
        return (
            <div>
              {/*  <button className="test-button" 
                        tabIndex = {(this.state.isModalOpen) ? 1 : -1 }
                    onClick={() => this.props.dispatch(openModal({
                                        id: uuid.v4(),
                                        type: 'confirmation',
                                        text: 'Are you sure to do this?',
                                        onClose: () => console.log("fire at closing event"),
                                        onConfirm: () => console.log("fire at confirming event")}))}>
                    Open confirmation modal
                </button>
                <button className="test-button" onClick={() => this.props.dispatch(openModal({
                                        id: uuid.v4(),
                                        type: 'custom',
                                        content: <CustomModalContent />}))}>
                    Open custom modal
                </button>*/}
                <div> { path }</div>
                <ContextMenuProvider  id = { idMenu }>
                    <TablePladema files = { this.state.files } folders = { this.state.folders } onMouseEnter = { this._hoverTableItem } onClickItems = { this._handleOnClickTableItem }/>
                </ContextMenuProvider>
                { menu }
                <ModalContainer />
            </div> 
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    }
}
export default connect(null,mapDispatchToProps)(PlademaLobby);