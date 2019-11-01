import React from 'react';
import {BrowserRouter as Router ,Switch ,Redirect} from 'react-router-dom';
import Login from '../containers/Login/';
import App from '../containers/App/';
import AuthRoute from '../helpers/AuthRoute';

const appRoutes = ()=>{
    return (
        <Router>
            <Switch>
			    <Redirect from="/" exact to="/app" />
                <AuthRoute.showIfNotAuthed path='/login' exact  redirectPath="/" component={()=> <Login/> } />
                <AuthRoute.showIfAuthed path='/app' exact redirectPath="/login" component={ ()=> <App/> } />
            </Switch>
        </Router>
    );
}

export default appRoutes ;