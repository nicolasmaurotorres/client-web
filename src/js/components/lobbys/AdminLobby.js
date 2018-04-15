import React    from 'react'
import PropTypes from 'prop-types'

class AdminLobby extends React.Component {
    constructor(props){
        super(props);
        
        /* bindings */
        this._onClick = this._onClick.bind(this);
    }

    _onClick(e){
        var dir = e.target.id;
        this.context.router.history.push("/admin/"+dir);
    }
    
    render(){
        return (
        <div className="jumbotron rows-admin">
            <div className="card text-white bg-info mb-3 row-card-admin" onClick = { this._onClick } id="view">
                <div className="card-header" id="view">View</div>
                <div className="card-body" id="view">
                    <h4 className="card-title" id="view">View users</h4>
                    <p className="card-text" id="view">Show all users of the system</p>
                </div>
            </div>
            <div className="card text-white bg-primary mb-3 row-card-admin" onClick = { this._onClick } id="add">
                <div className="card-header" id="add" >Create</div>
                    <div className="card-body" id="add">
                    <h4 className="card-title" id="add">Create new user</h4>
                    <p className="card-text" id="add">Register new user in the database</p>
                </div>
            </div>
            <div className="card text-white bg-warning mb-3 row-card-admin" onClick = { this._onClick } id="edit" >
                <div className="card-header" id="edit">Edit</div>
                <div className="card-body" id="edit">
                    <h4 className="card-title" id="edit">Edit registered user</h4>
                    <p className="card-text" id="edit">Change the data of registed user</p>
                </div>
            </div>
            <div className="card text-white bg-danger mb-3 row-card-admin" onClick = { this._onClick } id="delete">
                <div className="card-header" id="delete">Delete</div>
                <div className="card-body" id="delete">
                    <h4 className="card-title" id="delete">Delete registered user</h4>
                    <p className="card-text" id="delete">Delete a registed with all the files permanently</p>
                </div>
            </div>
        </div>
        );
    }
}

AdminLobby.contextTypes = {
    router : PropTypes.object.isRequired
}

export default AdminLobby;