import SmartConnect       from 'paraviewweb/src/IO/WebSocket/SmartConnect'; 
import RemoteRenderer     from 'paraviewweb/src/NativeUI/Canvas/RemoteRenderer'; 
import SizeHelper         from 'paraviewweb/src/Common/Misc/SizeHelper';
import ParaViewWebClient  from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient';

import React from 'react'
import PropTypes from 'prop-types';

export default class RemoteRender extends React.Component {
    render(){
        const container = document.getElementById('contentRendered');
        container.style.width = '800px';
        container.style.height = '600px';
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        
        const config = {
            sessionManagerURL : 'http://localhost:8080/paraview', // fijo
            node: 1024, // no tengo puta idea que es 
            application: 'visualizer', // fijo
            secret: 'katglrt54#%dfg', // podria no estar pero bue...
            user: 'sebastien.jourdain', // podria no estar pero bue...
            password: 'ousdfbdxldfgh', // podria no estar pero bue...
            filetoopen : this.props.file // path del archivo en la carpeta /data
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
        return (
            <div id="contentRendered">
            </div>            
        );
    }
}

RemoteRender.propTypes = {
  file: PropTypes.string.isRequired,
};
