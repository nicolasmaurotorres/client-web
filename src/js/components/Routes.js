import React from 'react'
import { Route } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './common/Home'
import LoginPage from './pages/LoginPage' 
import NavBar from './common/NavBar'
import DoctorLobby from './lobbys/DoctorLobby'
import PlademaLobby from './lobbys/PlademaLobby'
import AdminLobby from './lobbys/AdminLobby'
import FlashMessagesList from './common/FlashMessagesList'
import { authenticateDoctor, authenticatePladema, authenticateAdmin, loginControl }   from '../utils/authentications'
import AdminViewUsersForm from '../components/forms/AdminViewUsersForm'
import AdminAddUserForm from '../components/forms/AdminAddUserForm'
import DoctorRemoteRenderPage from './pages/DoctorRemoteRenderPage'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { ModalContainer }  from './common/Modal';

export default class Routes extends React.Component {
    render(){
        return (
            <div>
                <LoadingSpinner />
                <Router path="/" component = { Home }>
                    <div>
                        <Route path="/" component = { NavBar } />
                        <Route path="/" component = { FlashMessagesList  } />
                        <Route exact path="/login" component = { loginControl(LoginPage) }/>  
                        <Route exact path="/doctor" component = { authenticateDoctor(DoctorLobby) } />
                        <Route exact path="/doctor/render" component = { authenticateDoctor(DoctorRemoteRenderPage) } />
                        <Route exact path="/pladema" component = { authenticatePladema(PlademaLobby) } />
                        <Route exact path="/admin" component = { authenticateAdmin(AdminLobby) } />
                        <Route exact path="/admin/view" component = { authenticateAdmin(AdminViewUsersForm) } />
                        <Route exact path="/admin/add" component = { authenticateAdmin(AdminAddUserForm) } />
                    </div>
                </Router>
                <ModalContainer />
            </div>
        );
    }
}


