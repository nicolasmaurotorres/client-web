/**
 * Dado un path de carpeta devuelve el nodo donde esta es esa carpetaen el arbol
 * 
 * @param {number} first Path de la carpeta
 * @param {number} second arbol a buscar
 * @returns {number} nodo donde esta la carpeta
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