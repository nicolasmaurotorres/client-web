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
        <div className="jumbotron rows-admin fullscreen">
            <div className="centered">
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
            </div>
        </div>
        );
    }
}

AdminLobby.contextTypes = {
    router : PropTypes.object.isRequired
}

export default AdminLobby;