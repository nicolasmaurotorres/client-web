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
        var titlesNavBarNotLogued = [["Login","/login","login"]];
        var titlesNavBarDoctor = [["Add","/doctor/add"],["Edit","/doctor/edit"],["Delete","/doctor/delete"],["View","/doctor/view"]];
        var titlesNavBarPladema = [["Add","/pladema/add"],["Edit","/pladema/edit"],["Delete","/pladema/delete"],["Download","/pladema/download/file"]];
        var titlesNavBarAdmin = [["Add","/admin/add"],["Edit","/admin/edit"],["Delete","/admin/delete"]];
        return (
            <div>
                <Router path="/" component={Home}>
                <div>
                    <Route exact path="/" render={() => <NavBar titles={ titlesNavBarNotLogued } /> } />
                    <Route exact path="/" render={() => <Home /> } />
                    <Route path="/" render={() => <FlashMessagesList /> } />
                    <Route exact path="/login" render={ () => <NavBar titles={ titlesNavBarNotLogued } />} />
                    <Route exact path="/login" render={() => <LoginPage  />}/>  
                    <Route exact path="/doctor" render={ () => <NavBar titles={ titlesNavBarDoctor } />} />
                    <Route exact path="/doctor" render={ () => <DoctorLobby /> } />
                    <Route exact path="/pladema" render={ () => <NavBar titles={ titlesNavBarPladema } />} />
                    <Route exact path="/pladema" render={ () => <PlademaLobby />} />
                    <Route path="/admin" render={ () => <NavBar titles={ titlesNavBarAdmin } />} />
                    <Route path="/admin" render={ () => <NotImplementedYet />} />
                </div>
                </Router>
            </div>
        );
    }
}


