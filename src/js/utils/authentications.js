import React                from 'react';
import { connect }          from 'react-redux';
import PropTypes            from 'prop-types';
import { addFlashMessage }  from '../actions/flashMessagesActions'

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export function authenticateSpecialist(ComposedComponent){
    class AuthenticateSpecialist extends React.Component {
        componentWillMount(){
            if (!this.props.auth.isAuthenticated || this.props.auth.user.category != 0){ // logued as technician or admin
                this.props.addFlashMessage({
                    type : 'error',
                    text : 'You need to login as specialist to access this page'
                });
                this.context.router.history.push("/login");
            }
        }

        componentWillUpdate(nextProps){
            if (!nextProps.auth.isAuthenticated || this.props.auth.user.category != 0){
                this.context.router.history.push("/login");
            }
        }

        render(){
            return (
                <ComposedComponent { ...this.props } />
            );
        }
    }

    AuthenticateSpecialist.propTypes = {
        auth : PropTypes.object.isRequired,
        addFlashMessage : PropTypes.func.isRequired
    }

    AuthenticateSpecialist.contextTypes = {
        router : PropTypes.object.isRequired
    }

    return connect(mapStateToProps,{ addFlashMessage })(AuthenticateSpecialist);
};

export function authenticateTechnician(ComposedComponent){
    class AuthenticateTechnician extends React.Component {
        componentWillMount(){
            if (!this.props.auth.isAuthenticated || this.props.auth.user.category != 1){ // logued as specialist or admin
                this.props.addFlashMessage({
                    type : 'error',
                    text : 'You need to login as technician to access this page'
                });
                this.context.router.history.push("/login");
            }
        }

        componentWillUpdate(nextProps){
            if (!nextProps.auth.isAuthenticated || this.props.auth.user.category != 1){
                this.context.router.history.push("/login");
            }
        }

        render(){
            return (
                <ComposedComponent { ...this.props } />
            );
        }
    }

    AuthenticateTechnician.propTypes = {
        auth : PropTypes.object.isRequired,
        addFlashMessage : PropTypes.func.isRequired
    }

    AuthenticateTechnician.contextTypes = {
        router : PropTypes.object.isRequired
    }

    return connect(mapStateToProps,{ addFlashMessage })(AuthenticateTechnician);
}

export function authenticateAdmin(ComposedComponent){
    class AuthenticateAdmin extends React.Component {

        componentWillMount(){
            if (!this.props.auth.isAuthenticated || this.props.auth.user.category != 2){ // logued as specialist or admin
                this.props.addFlashMessage({
                    type : 'error',
                    text : 'You need to login as admin to access this page'
                });
                this.context.router.history.push("/login");
            }
        }

        componentWillUpdate(nextProps){
            if (!nextProps.auth.isAuthenticated || this.props.auth.user.category != 2){
                this.context.router.history.push("/login");
            }
        }

        render(){
            return (
                <ComposedComponent { ...this.props } />
            );
        }
    }

    AuthenticateAdmin.propTypes = {
        auth : PropTypes.object.isRequired,
        addFlashMessage : PropTypes.func.isRequired
    }

    AuthenticateAdmin.contextTypes = {
        router : PropTypes.object.isRequired
    }

    return connect(mapStateToProps,{ addFlashMessage })(AuthenticateAdmin);
};

export function loginControl(LoginComponent){
    class LoginControl extends React.Component {
        componentWillMount(){
            if (this.props.auth.isAuthenticated){ // ya esta autenticado, entonces no puede loguear de nuevo
                this.props.addFlashMessage({
                    type:'warning',
                    text:'you are already logged'
                });
                var lobby = "";
                switch (this.props.auth.user.category){
                    case 0: 
                        lobby = "/specialist";
                        break;
                    case 1:
                        lobby = "/technician";
                        break;
                    case 2:
                        lobby = "/admin";
                        break;
                }
                this.context.router.history.push(lobby);
            }
        }
        render(){
            return (
                <LoginComponent {...this.props} />
            );
        }
    }

    LoginControl.propTypes = {
        auth : PropTypes.object.isRequired,
        addFlashMessage : PropTypes.func.isRequired
    }

    LoginControl.contextTypes = {
        router : PropTypes.object.isRequired
    }

    return connect(mapStateToProps,{ addFlashMessage })(LoginControl);
}
