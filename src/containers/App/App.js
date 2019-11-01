import React from 'react';
import { Switch, Route } from "react-router-dom";
import {connect} from 'react-redux';
import {getAuthedUser , logout} from '../../store/actions/logindUserAction';
import axios from 'axios';

//Containers
import Navbar from '../../components/Blocks/Navbar';
import Stream from '../../containers/Stream/';

axios.defaults.baseURL = process.env.REACT_APP_API_GATEWAY_ENDPOINT;

class App extends React.Component {

    async componentDidMount(){
        if(this.props.user === ''){
            await this.props.getAuthedUser();
        }
    }

	render() {
		return(
			<div>
				<div id="app" className="page">
					<div className="main-wrapper page-main">
                        <Navbar  logoutUser={this.props.logout}/>
                        <Switch>
                            <Route path='/app/' component={Stream} />
                        </Switch>
                    </div>
                </div>    
			</div>
		);
	}
}

const mapStateToProps = (state) =>{
    return {
        user : state.loginUser.user
    }
}

const mapActionToProps = (dispatch)=>{
    return {
        getAuthedUser: () => dispatch(getAuthedUser()),
        logout : () => dispatch(logout())
    }
}

export default connect(mapStateToProps,mapActionToProps) (App);