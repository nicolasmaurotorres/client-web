import React    from 'react'
import FileBrowserWidget  from 'paraviewweb/src/React/Widgets/FileBrowserWidget';
import RemoteRender from '../../renders/RemoteRender'

class DoctorLobby extends React.Component {
    constructor(props){
       super(props);
       
       this.state = {
           rawResponse : {},
           actualPath : [],
           actualFiles : [],
           actualDirectorys: [],
           contextMenu : {},
           selectedFile: "" 
       }

       this._updateState = this._updateState.bind(this);
       this._nextNode = this._nextNode.bind(this);
    }

    componentWillMount(){
        // mock-i-to
        var rawResponse =   {
            "Folder": "doctor@doctor.com",
            "Files": [
                "README.txt",
                "imagen_procesada.vtk",
                "paciente31README.txt"
            ],
            "SubFolders": [{
                "Folder": "doctor@doctor.com/paciente2",
                "Files": [
                            "README.txt",
                            "README2.txt",
                            "imagen_procesada31.vtk"
                        ],
                "SubFolders": [{
                        "Folder": "doctor@doctor.com/paciente2/paciente3",
                        "Files": [
                                    "README (copy).txt",
                                    "README.txt",
                                    "imagen_procesada31.vtk"
                                ],
                        "SubFolders": []
                    },
                    {
                        "Folder": "doctor@doctor.com/paciente2/paciente31",
                        "Files": [
                                    "README.txt"
                                ],
                        "SubFolders": []
                    },
                    {
                        "Folder": "doctor@doctor.com/paciente2/paciente33",
                        "Files": [
                                    "README.txt"
                                ],
                        "SubFolders": []
                    }
                ]},
                {
                    "Folder": "doctor@doctor.com/paciente31",
                    "Files": [
                            "README.txt",
                            "imagen_procesada.vtk"
                        ],
                    "SubFolders": []
                }]
     };
     this.setState({ rawResponse : rawResponse});
     this._setActualPath(rawResponse);
     this._setActualFiles(rawResponse);
     this._setActualSubDirectorys(rawResponse);
    }
   
    _setActualSubDirectorys(resp){
        var parts = resp.Folder.split('/');
        var currentFolder = parts[ parts.length - 1 ];
        var subFolders = [];
        resp.SubFolders.forEach(function(elem){
            var split = elem.Folder.split('/');
            subFolders.push(split[split.length - 1]); // el 0 es el email del doctor
        });
        this.setState({actualDirectorys:subFolders});
    }

    _setActualFiles(resp){
        this.setState({actualFiles: resp.Files})        
    }

    _setActualPath(resp){
        this.setState({actualPath : resp.Folder.split('/')});
    }

    _nextNode(name,node) {
        if (node.Folder === name)
            return node;
        for(var i = 0; i < node.SubFolders.length; i++){
            var aux = this._nextNode(name,node.SubFolders[i]);
            if (aux != null){
                return aux
            }
        }
    }

    _updateState(type, name, groups) {
        if (type === 'directory'){
            var path = "";
            //formo el path completo de la carpeta seleccionada
            for (var i = 0; i < this.state.actualPath.length; i++){
                path += this.state.actualPath[i]+"/";
            }   
            var name = path + name;
            var aux = this._nextNode(name,this.state.rawResponse);
            this._setActualFiles(aux);
            this._setActualPath(aux);
            this._setActualSubDirectorys(aux);
        }
        if (type === 'path'){
            var aux = this._nextNode(name,this.state.rawResponse);
            this._setActualFiles(aux);
            this._setActualPath(aux);
            this._setActualSubDirectorys(aux);
        }
        if (type === 'file'){
            //FIXME: por ahora si hace click izquierdo en el archivo 
            //TODO:  click izquierdo en el archivo, mostrar el menu contextual
            // visualizar remotamente
            // renombrar
            // eliminar
            
            // visualizo un solo archivo temporalmente
            var path = "";
            if (this.state.selectedFile === ""){
                for (var i = 0; i < this.state.actualPath.length; i++){
                    path+=this.state.actualPath[i]+"/";
                }
                path = path + name;
                this.setState({selectedFile:path});
            }
        }
    }

    _rightClick(event){
        event.preventDefault();
        var dataset = event.target.dataset;
        if (dataset !== 'undefined' || dataset != null){
            var type = event.target.dataset.action; // el type del elemento rightclikeado
            var name = event.target.dataset.name; // el nombre del elemento rightclikeado
            //TODO: right click on folder
            // Agregar archivo
            // Agregar carpeta
            // Renombrar carpeta
            // Eliminar carpeta
    
            //TODO: right click en file
            // Visualizar archivo
            // Renombrar archivo
            // Eliminar archivo
        }
    }

    render(){
        var visualizer = <RemoteRender file ={ this.state.selectedFile+"" } /> 
        return (
            <div>
                <div className="mainLeft"> 
                    <div onContextMenu={this._rightClick.bind(this)}>
                        <FileBrowserWidget  
                            className="FileBrowserWidget"
                            directories = {this.state.actualDirectorys } 
                            files = { this.state.actualFiles }
                            path = { this.state.actualPath  }
                            groups = { [] }
                            onAction = { this._updateState } />
                        { this.props.contextMenu }
                    </div>
                </div>
                <div id="contentRendered" className="mainMain"> {/*este id es utilizado por el renderizador remoto*/}
                    { (this.state.selectedFile != "") ? visualizer : ""}
                </div>
            </div>
            );
    }
}

export default DoctorLobby;