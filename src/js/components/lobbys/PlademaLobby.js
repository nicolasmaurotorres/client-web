import React from 'react'
import TablePladema from '../common/TablePladema'
import { openModal } from '../../actions/modalActions'
import { connect } from 'react-redux';
import uuid from 'uuid'
import { ModalContainer }  from '../common/Modal';


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
            path: []
        };

        /* bindings */
        this._setFolders = this._setFolders.bind(this);
        this._setFiles = this._setFiles.bind(this);
        this._setPath = this._setPath.bind(this);

        this._getFolders = this._getFolders.bind(this);
        this._getFiles = this._getFiles.bind(this);
        this._getPath = this._getPath.bind(this);
        this.handleModalClick = this.handleModalClick.bind(this);
        this.callbackTest = this.callbackTest.bind(this);
    }

    callbackTest(){
        console.log('soy un callback');
    }

    handleModalClick(){
       
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

        var auxFolders = [];
        rawResponse.forEach(function(elem){
            auxFolders.push(elem);
        });
        
        this.setState({ rawResponse: rawResponse.folders, folders: auxFolders, path:["/"], files:[] });
    }

    _setFolders(nodo) {
        var auxFolders = [];
        nodo.SubFolders.Folder.forEach(function (element) {
            auxFolders.push(element.Folder);
        });
        this.setState({ folders: auxFolders });
    }

    _setPath(path) {
        this.setState({ path : path.Folder.split('/') });
    }

    _setFiles(nodo) {
        var auxFiles = [];
        nodo.forEach(function (elem) {
           auxFiles.push(elem);
        });
        this.setState({ files: auxFiles });
    }

    _getPath(){
        var toReturn = "";
        for(var i = 1; i < this.state.path.length; i++){ // quito el email
            toReturn = toReturn + this.state.path[i] + "/";
        }
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

    render() {
        return (
            <div>
                <TablePladema files = { this.state.files } folders = { this.state.folders } />
                <button className="test-button" 
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
                </button>
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