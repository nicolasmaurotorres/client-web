import React    from 'react'
import LocalRender from '../renders/LocalRender';

export default class PlademaLobby extends React.Component {
    constructor(){
        super();
        this.state = {
            selectedFile : false,
            file : null
        };
    }

    render(){
        return (
                <LocalRender />
        );
    }
}
