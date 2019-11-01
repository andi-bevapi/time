import React from 'react';
import { Redirect, Route } from 'react-router-dom';
// Helpers
import StorageManager from './StorageManager';

class AuthRoute {
	constructor() {
		this.authed = !!StorageManager.get('token');
	}

	/**
     * @description Update auth status base on token presence
     * @private
     * @static
     * @memberof AuthRoute
     */
	_setAuthStatus() {
		this.authed = !!StorageManager.get('token');
	}

    /**
     * @description Shows a page only if auth is present, protects routes
     * @memberof AuthRoute
     */
    showIfAuthed = ({ component: Component, ...rest }) => {
    	this._setAuthStatus();
    	return (
    		<Route
				{...rest}
				
    			render={props => {
    				return this.authed ? <Component {...props} /> : <Redirect to={rest.redirectPath || '/login'} />;
    			}}
    		/>
    	);
    };

    /**
     * @description Shows a page only if not authed, useful for login etc..
     * @memberof AuthRoute
     */
    showIfNotAuthed = ({ component: Component, ...rest }) => {
    	this._setAuthStatus();

    	return (
    		<Route
    			{...rest}
    			render={props => {
    				return !this.authed ? <Component {...props} /> : <Redirect to={rest.redirectPath || '/'}/>;
    			}}
    		/>
    	);
    };
}

export default new AuthRoute();