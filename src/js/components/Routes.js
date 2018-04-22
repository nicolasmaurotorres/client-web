import React from 'react'
import { Route , IndexRoute } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './common/Home'
import LoginPage from './pages/LoginPage' 
import NavBar from './common/NavBar'
import DoctorLobby from './lobbys/DoctorLobby'
import PlademaLobby from './lobbys/PlademaLobby'
import AdminPage from './pages/AdminLobbyPage'
import FlashMessagesList from './FlashMessagesList'
import { authenticateDoctor, authenticatePladema, authenticateAdmin, loginControl }   from '../utils/authentications'
import AdminViewUsersPage from './pages/AdminViewUsersPage'
import AdminEditUserPage from './pages/AdminEditUserPage'
import AdminAddUserPage from './pages/AdminAddUserPage'

export default class Routes extends React.Component {
    render(){
        return (
            <div>
                <Router path="/" component = { Home }>
                    <div>
                        <Route path="/" component = { NavBar } />
                        <Route path="/" component = { FlashMessagesList  } />
                        <Route exact path="/login" component = { loginControl(LoginPage) }/>  
                        <Route exact path="/doctor" component = { authenticateDoctor(DoctorLobby) } />
                        <Route exact path="/pladema" component = { authenticatePladema(PlademaLobby) } />
                        <Route exact path="/admin" component = { authenticateAdmin(AdminPage) } />
                        <Route exact path="/admin/view" component = { authenticateAdmin(AdminViewUsersPage) } />
                        <Route exact path="/admin/add" component = { authenticateAdmin(AdminAddUserPage) } />
                        <Route exact path="/admin/edit" component = { authenticateAdmin(AdminEditUserPage) } />
                    </div>
                </Router>
            </div>
        );
    }
}


