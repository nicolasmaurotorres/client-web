import React from 'react'
import PropTypes from 'prop-types';
import SmartConnect       from 'paraviewweb/src/IO/WebSocket/SmartConnect'; 
//import SmartConnect  from 'wslink/src/SmartConnect'
//import WebsocketConnection from 'wslink/src/WebsocketConnection';
import RemoteRenderer     from 'paraviewweb/src/NativeUI/Canvas/RemoteRenderer'; 
import SizeHelper         from 'paraviewweb/src/Common/Misc/SizeHelper';
import ParaViewWebClient  from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient';
import WidgetControlWrapper from '../components/common/WidgetColorWrapper';

class RemoteRender extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        resetCamara : false
      }

      this.smartConnect = null;
      this.pvwClient = null;
      this.renderer = null;
      this.container = null;
      this.viewId = null;
      /*bindings*/
      this._resetCamara = this._resetCamara.bind(this);
    }

    _resetCamara(){
      debugger;
      //
      this.pvwClient.ViewPort.resetCamera(this.viewId).then((response)=>{
        debugger;
        var pepe = response;
      });
    }

    componentWillMount(){
      const config = {
        sessionManagerURL : 'http://localhost:8080/paraview', // fijo
        node: 1024, // no tengo puta idea que es 
        application: 'visualizer', // fijo - visualizer
        secret: 'katglrt54#%dfg', // podria no estar pero bue...
        user: 'sebastien.jourdain', // podria no estar pero bue...
        password: 'ousdfbdxldfgh', // podria no estar pero bue...
        filetoopen : this.props.file // path del archivo en la carpeta /data
        //sessionURL : "ws://localhost:8080/ws",
        //app: 'Visualizer'
      }
      const styleDiv = {
        width:'800px',
        height:'600px', 
        overflow:'hidden', 
        position:'relative'
      };
      var _this = this;
      _this.container = (<div id="contentRendered" style={styleDiv}></div>);
      _this.smartConnect = new SmartConnect(config);
      _this.smartConnect.onConnectionReady((connection) => {
      console.log("on connection ready message");
        _this.pvwClient = ParaViewWebClient.createClient(connection, ['MouseHandler', 'ViewPort', 'ViewPortImageDelivery', 'ColorManager','ProxyManager']);
        _this.renderer = new RemoteRenderer(_this.pvwClient);
        _this.pvwClient.ProxyManager.list().then(function (response) {
          debugger;
          _this.viewId = response.view; // obtengo el view id y lo guardo
        });
        _this.renderer.showRenderStats(true);
        _this.renderer.setContainer(document.getElementById('contentRendered'));
        _this.renderer.onImageReady((callback) => {
        
          console.log('We are good');
          });
          window.renderer = _this.renderer;
          SizeHelper.onSizeChange(() => {
            renderer.resize();
          });
          SizeHelper.startListening();
      });
        _this.smartConnect.onConnectionClose((callback) => {
          debugger;
          console.log("on connection close message");
        });
        _this.smartConnect.onConnectionError((callback) => {
        debugger;
        console.log("on connection error message");
      });
      _this.smartConnect.connect();
    }

    render(){
      const container = this.container;
      return (
       <div>
         <WidgetControlWrapper/>
         <button onClick={ this._resetCamara }>RESETEAR CAMARA </button>
         { container }
       </div>
      );
    }
}

RemoteRender.propTypes = {
  file: PropTypes.string.isRequired,
};

export default RemoteRender;