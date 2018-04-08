import React from 'react'
import { Route , IndexRoute } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './Home'
import LoginPage from './LoginPage' 
import NavBar from './NavBar'
import DoctorLobby from './DoctorLobby'
import PlademaLobby from './PlademaLobby'
import NotImplementedYet from './NotImplementedYet'
import FlashMessagesList from './FlashMessagesList'

export default class Routes extends React.Component {
    render(){
        return (
            <div>
                <Router path="/" component = { Home }>
                    <div>
                        <Route path="/" component = { NavBar } />
                        <Route path="/" component = { FlashMessagesList  } />
                        <Route exact path="/login" component = { LoginPage }/>  
                        <Route exact path="/doctor" component = { DoctorLobby } />
                        <Route exact path="/pladema" component = { PlademaLobby } />
                        <Route exact path="/admin" component = { NotImplementedYet } />
                    </div>
                </Router>
            </div>
        );
    }
}


