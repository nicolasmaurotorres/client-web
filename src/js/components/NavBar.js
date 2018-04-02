import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';


export default class NavBar extends React.Component {
    render(){
        var links = this.props.titles.map(function(link){
                        return <li key={link[1]+link[0]} className="nav-item"><Link className="nav-link" name={link[2]} to={link[1]}>{link[0]}</Link></li>;
                    });
        
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link className="navbar-brand" to="/">Home</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation" >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav mr-auto">
                        {links}
                    </ul>
                </div>
            </nav>
        );
    }
}

NavBar.propTypes = {
    titles: PropTypes.array.isRequired,
  };
