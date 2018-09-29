import React from 'react';
import ColorByWidget from 'paraviewweb/src/React/Widgets/ColorByWidget';
import source from 'paraviewweb/src/React/Widgets/ProxyEditorWidget'///example/source-proxy.json';
import representation from 'paraviewweb/src/React/Widgets/ProxyEditorWidget'///example/representation-proxy.json';
import presets from 'paraviewweb/src/React/Widgets/ColorByWidget'///example/presets.json';
import 'normalize.css';

class WidgetColorWrapper extends React.Component {
    constructor(props){
        super(props);
       
        this.state = {
            useGaussian : true,
            scalarBar : 'iVBORw0KGgoAAAANSUhEUgAAAgAAAAABCAIAAAAn2YEhAAAGDElEQVQ4EQEBBv75ATtMwAAAAAECAgAAAAECAQAAAAEBAgAAAAICAQAAAAECAgAAAAEBAQAAAAECAgAAAAECAQAAAAECAgAAAAIBAQAAAAECAgAAAAECAQAAAAECAQAAAAEBAgAAAAICAQAAAAECAQAAAAEBAgAAAAECAQAAAAICAQAAAAEBAQAAAAECAgAAAAECAQAAAAIBAQAAAAECAQAAAAECAQAAAAEBAgAAAAICAQAAAAECAQAAAAEBAQAAAAICAQAAAAEBAQAAAAECAQAAAAECAQAAAAIBAQAAAAECAQAAAAEBAQAAAAICAQAAAAEBAAAAAAECAQAAAAIBAQAAAAECAQAAAAEBAQAAAAICAAAAAAEBAQAAAAECAQAAAAIBAQAAAAECAAAAAAEBAQAAAAICAAAAAAEBAQAAAAICAQAAAAEBAAAAAAEBAQAAAAICAAAAAAEBAQAAAAEBAAAAAAICAQAAAAEBAAAAAAIBAAAAAAECAQAAAAEBAAAAAAIBAAAAAAECAQAAAAEBAAAAAAIBAAAAAAEBAAAAAAICAAAAAAEBAQAAAAEBAAAAAAIBAAAAAAEBAAAAAAIBAAAAAAEBAAAAAAECAAAAAAIBAAAAAAEBAAAAAAEBAAAAAAIBAAAAAAEBAAAAAAEB/wAAAAIBAAAAAAEBAAAAAAIBAAAAAAEBAAAAAAEB/wAAAAIBAAAAAAEAAAAAAAEB/wAAAAIBAAAAAAEBAAAAAAEB/wAAAAEBAAAAAAIA/wAAAAEBAAAAAAEB/wAAAAIBAAAAAAEA/wAAAAEBAAAAAAEB/wAAAAIA/wAAAAEBAAAAAAEB/wAAAAEA/wAAAAIBAAAAAAEA/wAAAAEB/wAAAAEA/wAAAAEBAAAAAAIA/wAAAAEB/wAAAAEA/wAAAAEB/wAAAAEA/wAAAAEB/wAAAAIA/wAAAAEA/wAAAAEB/wAAAAEA/wAAAAEA/wAAAAEA/wAAAAEB/wAAAAEA/wAAAAEA/wAAAAEA/wAAAAEA/wAAAAEA/gAAAAEB/wAAAAH//wAAAAEA/gAAAAH//wAAAAEA/wAAAAH//gAAAAEA/wAAAAH//gAAAAEA/wAAAAH//gAAAAH//wAAAAEA/wAAAAH//gAAAAH//wAAAAEA/gAAAAH//wAAAAD//gAAAAH//wAAAAEA/gAAAAD//wAAAAH//gAAAAH//wAAAAD//gAAAAH//gAAAAEA/wAAAAD//gAAAAH//wAAAAD//gAAAAH//wAAAAD//gAAAAH//wAAAAD//gAAAAD//gAAAAH//wAAAAD+/gAAAAD//wAAAAH//gAAAAD//wAAAAD//gAAAAD//gAAAAH//wAAAAD+/gAAAAD//wAAAAD//gAAAAD//wAAAAD+/gAAAAD//gAAAAD//wAAAAD+/gAAAAD//wAAAAD//gAAAAD+/wAAAAD//gAAAAD//gAAAAD+/wAAAAD//gAAAAD+/wAAAP///gAAAAD+/wAAAAD//gAAAAD+/gAAAP///wAAAAD+/gAAAAD//wAAAP/+/gAAAAD//wAAAAD+/gAAAP/+/wAAAAD//gAAAP/+/wAAAAD+/gAAAP///wAAAAD+/gAAAP/+/wAAAAD//gAAAP/+/wAAAP/+/gAAAAD//wAAAP/+/gAAAAD+/wAAAP/+/gAAAP/+/wAAAP///gAAAAD+/wAAAP/+/gAAAP/+/wAAAP/+/gAAAP/+/wAAAP/+/wAAAAD//gAAAP/+/wAAAP/+/gAAAP/+/wAAAP/+/wAAAP/+/gAAAP/+/wAAAP/+/wAAAP/+/gAAAP/+/wAAAP/+/wAAAP/+/gAAAP79/wAAAP/+/wAAAP/+/gAAAP/+/wAAAP/+/wAAAP/+/wAAAP79/gAAAP/+/wAAAP/+/wAAAP/+/wAAAP79/gAAAP/+/wAAAP/9/wAAAP7+/wAAAP/9/wAAAP/+/gAAAP79/wAAAP/9/wAAAP79/wAAAP/9/wAAAP/9/wAAAP79/gAAAP/8/wAAAP78/wAAAP/8/wAAAP77/wAAAP/6/wAAAP75/wAAAAH4Uu+CshkNAAAAAElFTkSuQmCC'
        }   
        /*bindings*/
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        console.log(event); 
    }

    render(){
        return (
            <div>
        {/*    <ColorByWidget  source={source}
                                representation={representation}
                                scalarBar={scalarBar}
                                presets={presets}
                                onChange={this.onChange}
                                hidePointControl
                                useGaussian/>*/}
            </div>
        );
    }
}

export default WidgetColorWrapper;
