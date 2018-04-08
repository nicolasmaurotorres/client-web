import React                from 'react';
import { connect }          from 'react-redux';
import PropTypes            from 'prop-types';
import { addFlashMessage }  from '../actions/flashMessages'

function mapStateToProps(state){
    return {
        auth: state.auth
    };
}

export function authenticateDoctor(ComposedComponent){
    class AuthenticateDoctor extends React.Component {
        componentWillMount(){
            if (!this.props.auth.isAuthenticated || this.props.auth.user.category != 0){ // logued as pladema or admin
                this.props.addFlashMessage({
                    type : 'error',
                    text : 'You need to login as doctor to access this page'
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

    AuthenticateDoctor.propTypes = {
        auth : PropTypes.object.isRequired,
        addFlashMessage : PropTypes.func.isRequired
    }

    AuthenticateDoctor.contextTypes = {
        router : PropTypes.object.isRequired
    }

    return connect(mapStateToProps,{ addFlashMessage })(AuthenticateDoctor);
};

export function authenticatePladema(ComposedComponent){
    class AuthenticatePladema extends React.Component {
        componentWillMount(){
            if (!this.props.auth.isAuthenticated || this.props.auth.user.category != 1){ // logued as doctor or admin
                this.props.addFlashMessage({
                    type : 'error',
                    text : 'You need to login as pladema to access this page'
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

    AuthenticatePladema.propTypes = {
        auth : PropTypes.object.isRequired,
        addFlashMessage : PropTypes.func.isRequired
    }

    AuthenticatePladema.contextTypes = {
        router : PropTypes.object.isRequired
    }

    return connect(mapStateToProps,{ addFlashMessage })(AuthenticatePladema);
}

export function authenticateAdmin(ComposedComponent){
    class AuthenticateAdmin extends React.Component {

        componentWillMount(){
            if (!this.props.auth.isAuthenticated || this.props.auth.user.category != 2){ // logued as doctor or admin
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