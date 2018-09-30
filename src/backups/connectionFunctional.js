// this is a backup file for connection with the server
//remote render imports
import SmartConnect       from 'paraviewweb/src/IO/WebSocket/SmartConnect'; 
import RemoteRenderer     from 'paraviewweb/src/NativeUI/Canvas/RemoteRenderer'; 
import SizeHelper         from 'paraviewweb/src/Common/Misc/SizeHelper';
import ParaViewWebClient  from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient';

// file browser widget imports
import FileBrowserWidget  from 'paraviewweb/src/React/Widgets/FileBrowserWidget';
import React                from 'react';
import { render }         from 'react-dom';

// remote render config
document.body.style.padding = '0';
document.body.style.margin = '0';
// filebrowserwidget config
//document.getElementById('filecontent').style.height = '';
function onAction(type, files, aaa) {
  console.log(type, files, aaa);
}
render(
  React.createElement(
      FileBrowserWidget,
      {
      directories: ['a', 'b', 'c'],
      groups: [
          { label: 'd', files: ['da', 'db', 'dc']},
          { label: 'e', files: ['ea', 'eb', 'ec']},
          { label: 'f', files: ['fa', 'fb', 'fc']},
      ],
      files: ['g', 'h', 'i', 'Super long name with not much else bla bla bla bla bla bla bla bla bla bla bla bla.txt'],
      onAction,
      path: ['Home', 'subDir1', 'subDir2', 'subDir3'],
      }),
  document.getElementById('filecontent'));

// renderer container
const container = document.getElementById('content');

container.style.position = 'relative';
container.style.width = '100vw';
container.style.height = '100vh';
container.style.overflow = 'hidden';

const config = {
  sessionManagerURL : 'http://localhost:8080/paraview',
  node: 1024,
  application: 'visualizer',
  secret: 'katglrt54#%dfg',
  user: 'sebastien.jourdain',
  password: 'ousdfbdxldfgh',
  filetoopen : 'imagen_procesada.vtk'
}
const smartConnect = new SmartConnect(config);
smartConnect.onConnectionReady((connection) => {
  console.log("on connection ready message");
  const pvwClient = ParaViewWebClient.createClient(connection, ['MouseHandler', 'ViewPort', 'ViewPortImageDelivery']);
  const renderer = new RemoteRenderer(pvwClient);
  renderer.setContainer(container);
  renderer.onImageReady(() => {
    console.log('We are good');
  });
  window.renderer = renderer;
  SizeHelper.onSizeChange(() => {
    renderer.resize();
  });
  SizeHelper.startListening();
});
smartConnect.onConnectionClose((callback) => {
  console.log("on connection close message");
});
smartConnect.onConnectionError((callback) => {
  console.log("on connection error message");
});

smartConnect.connect();
