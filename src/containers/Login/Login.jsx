import React from 'react';

//Styles
import 'bootstrap/dist/css/bootstrap.css';
import './assets/styles/Login.css';

//Components
import LoginForm from '../../components/LoginForm/';
// Images
import WhiteLogo from '../../general/assets/images/logo-white.png';
import LoginBg from '../../general/assets/images/login-bg.jpg';

import {connect} from 'react-redux';

//actions
import {authenticate} from '../../store/actions/logindUserAction';
 
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {

		}

		
	}
	
	handleSubmitlogin = (data)=>{
		this.props.authenticate(data);
	}

    render(){
        return(
            <section className="section section-2 section-login">
    			<div className="container">
    				<div className="row">
    					<div className="single-page single-pageimage cover-image"
    						style={{'backgroundImage' : `url('${LoginBg}')` }}
    					>
    						<div className="row">
    							<div className="col-lg-6 col-xl-6">
    								<div className="mt-xl-5">
    									<div
    										className="bg-transparent carouselTestimonial1 p-4 mx-auto mt-xl-5 mb-3 w-600">
    										<div
    											id="carouselTestimonial"
    											className="carousel carousel-testimonial slide"
    											data-ride="carousel"
    										>
    											<ol className="carousel-indicators carousel-indicators1">
    												<li data-target="#carouselTestimonial" data-slide-to="0"
    													className="active"/>
    											</ol>
    											<div className="carousel-inner">
    												<div className="carousel-item text-center active">
    													<h4 className="m-0 pt-2 text-white">
    													<img src={WhiteLogo} className="mb-2  mt-lg-0 w-90" alt="logo"/>
    													</h4>
    												</div>
    											</div>
    										</div>
    									</div>
    								</div>
    							</div>
    							<div className="col-lg-6 col-xl-6">
    								<div className="login-sec">
    									<div className=" text-center card mb-0">
    										<LoginForm  handleSubmitlogin={this.handleSubmitlogin}/>
    									</div>
    								</div>
    							</div>
    						</div>
    					</div>
    				</div>
    			</div>
    		</section>
        )
    }
}

// const mapStateToProps = (state)=>{
// 	return { 
// 		login_user : state.loginUser
// 	 }
// }

const mapActionToProps = (dispatch) => {
	return  {
		authenticate: (data) => dispatch(authenticate(data))
	}
}

export default connect (null , mapActionToProps)(Login);