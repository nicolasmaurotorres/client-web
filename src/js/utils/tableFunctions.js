/**
 * Dado un path de carpeta devuelve el nodo donde esta es esa carpetaen el arbol
 * @param {string} first Path de la carpeta
 * @param {node} second arbol a buscar
 * @returns {node} nodo donde esta la carpeta
*/
  export function _nextNode(name,node) {
    if (node.Folder === name){
        return node;
    }
    for(var i = 0; i < node.SubFolders.length; i++){
        var aux = _nextNode(name,node.SubFolders[i]);
        if (aux != null){
            return aux
        }
    }
    return null;
}

/**
 * Dado un nodo devuelve las carpetas del mismo en un arreglo 
 * @param {node} nodo nodo a tomar las carpetas 
 * @returns {array} arreglo con las carpetas
 */
export function _getFoldersAsArray(nodo) {
    var auxFolders = [];
    nodo.SubFolders.forEach(function (element) {
        var parts = element.Folder.split("/");
        auxFolders.push(parts[parts.length-1]); // obtengo el ultimo a la derecha
    });
    return auxFolders;
}

/**
 * Dado un nodo devuelve el path en un arreglo 
 * @param {node} nodo nodo a tomar las partes del path
 * @returns {array} arreglo donde estan las partes del path
 */
export function _getPathAsArray(node) {
    return node.Folder.split('/');
}

/**
 * Dado un nodo devuelve los archivos en un arreglo 
 * @param {node} nodo nodo a tomar los archivos
 * @returns {array} arreglo donde estan las partes de los archivos
 */
export function _getFilesAsArray(nodo) {
    var auxFiles = [];
    nodo.Files.forEach(function (elem) {
       auxFiles.push(elem);
    });
    return auxFiles;
}

export function _getPathAsString(path,startFrom = 0){
    var toReturn = "";
    for( var index = startFrom; index < path.length; index++){
        toReturn = toReturn + path[index] + "/";
    }
    toReturn = toReturn.substring(0,toReturn.length-1); // quito el ultimo /
    return toReturn;
}

export function _getFilesAsObject(files){
    var toReturn = {};
    for (var i = 0; i < files.length; i++){
        toReturn[files[i]] = i;
    }
    return toReturn;
}

export function _getFoldersAsObject(folders){
    var toReturn = {};
    for (var i = 0; i < folders.length; i++){
        toReturn[folders[i]] = i;
    }
    return toReturn;
}