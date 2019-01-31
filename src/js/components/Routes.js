import React from 'react'
import { Route } from 'react-router-dom'
import { BrowserRouter as Router } from 'react-router-dom';

import Home from './common/Home'
import LoginForm from '../components/forms/LoginForm' 
import NavBar from './common/NavBar'
import SpecialistLobby from './lobbys/SpecialistLobby'
import TechnicianLobby from './lobbys/TechnicianLobby'
import AdminLobby from './lobbys/AdminLobby'
import FlashMessagesList from './common/FlashMessagesList'
import { authenticateSpecialist, authenticateTechnician, authenticateAdmin, loginControl }   from '../utils/authentications'
import AdminViewUsersForm from '../components/forms/admin/AdminViewUsersForm'
import AdminAddUserForm from '../components/forms/admin/AdminAddUserForm'
import SpecialistRemoteRenderPage from './pages/SpecialistRemoteRenderPage'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { ModalContainer }  from './common/Modal';
import LocalRender from '../renders/LocalRender'

export default class Routes extends React.Component {
    render(){
        return (
            <div>
                <LoadingSpinner />
                <Router path="/" component = { Home }>
                    <div>
                        <Route path="/" component = { NavBar } />
                        <Route path="/" component = { FlashMessagesList  } />
                        <Route exact path="/login" component = { loginControl(LoginForm) }/>  
                        <Route exact path="/specialist" component = { authenticateSpecialist(SpecialistLobby) } />
                        <Route exact path="/specialist/render" component = { authenticateSpecialist(SpecialistRemoteRenderPage) } />
                        <Route exact path="/local" component = { LocalRender } />
                        <Route exact path="/technician" component = { authenticateTechnician(TechnicianLobby) } />
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


