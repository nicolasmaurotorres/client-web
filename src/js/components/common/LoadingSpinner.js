import React from 'react'
import { connect } from 'react-redux'
class LoadingSpinner extends React.Component {
    render(){
        if (this.props.loading){
            return (
                <div>
                  <h1>HOLA soy un LOADINSPINNER</h1>
                </div>
            );
        } else {
            return null;
        }
    }
}

function mapStateToProps(state) {
    return {
        auth : state.auth,
        table : state.table,
        loading : state.loading
    }
}

function mapDispatchToProps(dispatch) {
    return {
      dispatch,
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(LoadingSpinner);
