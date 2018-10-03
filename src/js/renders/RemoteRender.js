import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import SmartConnect  from 'paraviewweb/src/IO/WebSocket/SmartConnect'; 
import RemoteRenderer     from 'paraviewweb/src/NativeUI/Canvas/RemoteRenderer'; 
import SizeHelper         from 'paraviewweb/src/Common/Misc/SizeHelper';
import ParaViewWebClient  from 'paraviewweb/src/IO/WebSocket/ParaViewWebClient';
import WidgetColorWrapper from '../components/common/WidgetColorWrapper';
import { setSpinnerState } from '../actions/spinnerActions'
import { addFlashMessage } from '../actions/flashMessagesActions';
import { renderConfig } from '../config/renderConfig'

class RemoteRender extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        resetCamara : false,
        valid : false,
        opacity : false,
      }

      this.SmartConnect = null;
      this.pvwClient = null;
      this.renderer = null;
      this.container = null;
      this.sourceId = null;
      this.repId = null;
      this.viewId2 = null;
      this.proxyId = null;
      this.rgbPoints = null;
      this.pathFileToOpen = null;
      this.colorPalette = null;
      this.indexColor = 0;
      /*bindings*/
      this._resetCamara = this._resetCamara.bind(this);
      this._setOpacity = this._setOpacity.bind(this);
    }

    _resetCamara(){
      /*/
      TODO: ESTE CODIGO ANDA BIEN, SOLO COMENTADO PARA HACER PRUEBAS
      this.pvwClient.ViewPort.resetCamera(this.viewId).then((response)=>{
        debugger;
        var pepe = response;
      });
      this.pvwClient.ProxyManager.create(this.proxyId)
      .then((response)=>{
        debugger;
        var pepe = response;
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      
      this.pvwClient.ColorManager.getCurrentScalarRange(this.viewId2)
      .then((response)=>{
        debugger;
        var pepe = response;
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      this.pvwClient.ColorManager.setScalarBarVisibilities(this.viewId)
      .then((response)=>{
        debugger;
        var pepe = response;
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      this.pvwClient.ColorManager.getScalarBarVisibilities(this.viewId)
      .then((response)=>{
        debugger;
        var pepe = response;
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      this.pvwClient.ColorManager.listColorMapNames()
	    .then((_response) => {
        debugger;*/
        if (this.indexColor < this.colorPalette.length){
          const palette = this.colorPalette[this.indexColor];
          this.pvwClient.ColorManager.selectColorMap(this.repId, palette)
  		    	.then((response) => {
              debugger;
              this.props.dispatch(addFlashMessage({
                type:"success",
                text: palette+" successfully loaded"
              }));
			      })
			      .catch((response) => {
              this.props.dispatch(addFlashMessage({
                type:"error",
                text: palette+" not loaded"
              }));
            });
          this.indexColor = this.indexColor + 1;
        }
        
      
	    /*})
      this.pvwClient.ColorManager.listColorMapNames()
	    .then((_response) => {
        debugger;

        *//*
        if (this.indexColor < this.colorPalette.length){
          const palette = this.colorPalette[this.indexColor];
          this.pvwClient.ColorManager.selectColorMap(this.repId, palette)
  		    	.then((response) => {
              debugger;
              this.props.dispatch(addFlashMessage({
                type:"success",
                text: palette+" successfully loaded"
              }));
			      })
			      .catch((response) => {
              this.props.dispatch(addFlashMessage({
                type:"error",
                text: palette+" not loaded"
              }));
            });
          this.indexColor = this.indexColor + 1;
        }
        */
      
	    /*})
	    .catch(() => {
		    debugger;
		    var pepe = response;
      });/*
          this.pvwClient.ColorManager.listColorMapImages()
          .then((response)=>{
            debugger; 
            var pepe = response;
          })
          .catch((response)=>{
            debugger;
            var pepe = response;
            // "'vtkPVServerManagerCorePython.vtkSMSourceProxy' object has no attribute 'LookupTable'"
          });
     /* });
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      /*
      this.pvwClient.ColorManager.listColorMapImages()
      .then((response)=>{
        debugger; // obtengo las imagenes de los colores 
        var pepe = response;
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });*/
      /*this.pvwClient.ProxyManager.availableSources()
      .then((response)=>{
        debugger;
        var pepe = response;
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      /*this.pvwClient.ProxyManager.availableFilters()
      .then((response)=>{
        debugger;
        var pepe = response;
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      
      this.pvwClient.ColorManager.getSurfaceOpacity(this.repId)
      .then((response)=>{
        debugger;
        var pepe = response;
      })
      .catch((response)=>{
        debugger;
        var pepe = response;
      });
      var _this = this;
      this.pvwClient.ColorManager.getRgbPoints('array')
        .then((response)=>{
          debugger;
          _this.rgbPoints = response;
        });*/
    }
      var _this = this;*/
      this.pvwClient.ColorManager.getScalarBarVisibilities(this.repId)
        .then((response)=>{
          debugger;
          var pepe = response;  
        })
        .catch((response)=>{
          debugger;
          var pepe = response;
        });
    }

    _setOpacity(){
      this.pvwClient.ColorManager.setSurfaceOpacity(this.repId,this.state.opacity)
      .then((response)=>{
        this.setState({opacity:!this.state.opacity});
      })
    }

    componentWillMount(){
      var _this = this;
      _this.pathFileToOpen = this.props.file;
      _this.props.dispatch(setSpinnerState({
        state:true
      }));
      const config = renderConfig;
      const styleDiv = {
        width:'800px',
        height:'600px', 
        overflow:'hidden', 
        position:'relative'
      };
      _this.container = (<div id="contentRendered" style={styleDiv}></div>);
      _this.SmartConnect = new SmartConnect(config);
      _this.SmartConnect.onConnectionReady((connection) => {
        _this.proxyId = _this.SmartConnect.config.id;
        console.log("on connection ready message");
        _this.pvwClient = ParaViewWebClient.createClient(connection, ['MouseHandler', 'ViewPort', 'ViewPortImageDelivery', 'ColorManager','ProxyManager']);
        _this.renderer = new RemoteRenderer(_this.pvwClient);
        _this.pvwClient.ProxyManager.open(_this.pathFileToOpen)
          .then(function (response) {
            if (response.success) {
			        _this.sourceId = response.id; // save source id 
			        _this.setState({
				        valid: true
              });
              _this.pvwClient.ProxyManager.list()
              .then((response)=>{
                _this.viewId2 = response.view;
                var found = false;
                var i = 0;
                while (!found && i < response.sources.length){
                  if (response.sources[i].id === _this.sourceId){
                    _this.repId = response.sources[i].rep;
                    found=true;
                  } else {
                    i++;
                  }
                }
                _this.pvwClient.ColorManager.colorBy(_this.repId,'','POINTS','array');
                _this.pvwClient.ColorManager.listColorMapNames().then((response)=>{
                  _this.colorPalette = response;
                });
              })
              .catch((response)=>{
                debugger;
                var foo = response;
                var bar = _this;
              });
	          } else {
			          //TODO: show error message
            }
            _this.props.dispatch(setSpinnerState({
              state:false
            }));
          })
          .catch((response)=>{
            debugger;
            var pepe = response;
            _this.props.dispatch(setSpinnerState({
              state:false
            }));
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
    _this.SmartConnect.onConnectionClose((callback) => {
      console.log("on connection close message");
    });
    _this.SmartConnect.onConnectionError((callback) => {
      console.log("on connection error message");
    });
    _this.SmartConnect.connect();
  }
 
  render(){
    const container = this.container;
    return (
      <div>
        <WidgetColorWrapper/>
          <button onClick={ this._resetCamara }>RESETEAR CAMARA </button>
          <button onClick={ this._setOpacity }>Opacity  </button>
          { container }
      </div>
    );
  }
}

RemoteRender.propTypes = {
  file: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
      auth : state.auth,
      table : state.table
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  }
};


export default connect(mapStateToProps,mapDispatchToProps)(RemoteRender);