import SmartConnect from 'wslink/src/SmartConnect'; //ta
import RemoteRenderer from 'paraviewweb/src/NativeUI/Canvas/RemoteRenderer'; //ta
import SizeHelper from 'paraviewweb/src/Common/Misc/SizeHelper'; //ta
import ParaViewWebClient from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient';
import axios from 'axios';

document.body.style.padding = '0';
document.body.style.margin = '0';

const container = document.getElementById('content');

container.style.position = 'relative';
container.style.width = '100vw';
container.style.height = '100vh';
container.style.overflow = 'hidden';

axios.post('http://192.168.1.40:8080/paraview',{  
  timeout : 25000,
  headers : {
    'Allow-Control-Allow-Origin': '*'
  },
  responseType: 'json', // default
  data : {
    sessionManagerURL: 'http://192.168.1.40:8080/paraview',
    node: 1024,
    application: 'visualizer',
    secret: 'katglrt54#%dfg',
    user: 'sebastien.jourdain',
    password: 'ousdfbdxldfgh'
  }
}).then(function (response) {
  console.log('exito');
  const smartConnect = SmartConnect.newInstance({ response });
  smartConnect.onConnectionReady((connection) => {
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
  smartConnect.connect();
}).catch(function (error) {
      console.log("error amigacho");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("data: "+error.response.data);
        console.log("status: "+error.response.status);
        console.log("headers: "+error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        
        console.log("request: ");
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error ', error.message);
      }
      console.log(error.config);
  });