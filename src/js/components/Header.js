import React    from 'react'

export default class Header extends React.Component {
    handleChange(e){
        const value = e.target.value;
        this.props.changeTitle(value);
    }
    render(){
        return (
            <div>
                <Title title = {this.props.title}/>
                <input onChange={this.handleChange.bind(this)}/>
            </div>
        );
    }
}
