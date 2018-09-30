import React from 'react'
import { connect } from 'react-redux'
import { BeatLoader } from 'react-spinners'

class LoadingSpinner extends React.Component {
    render(){
        if (this.props.loading){
            return (
                <div className="centerComponent">
                   <BeatLoader color =  {'#2FA4E7'} loading = { this.props.loading }/>
                </div>
            );
        } else {
            return null;
        }
    }
}

function mapStateToProps(state) {
    return {
        loading : state.spinner.loading
    }
}

export default connect(mapStateToProps,null)(LoadingSpinner);
