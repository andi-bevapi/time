import axios from 'axios';
import StorageManager from '../../helpers/StorageManager' ;
axios.defaults.baseURL = process.env.REACT_APP_API_GATEWAY_ENDPOINT;

export const AUTH_USER = 'AUTH_USER';

export const saveUser = (payload) => {
    return {
            type : AUTH_USER ,
            payload
    }
}

export const authenticate = (data) => dispatch =>{
    const userCredentials = {
        employeeCode : data.employeeCode,
        password     : data.password,
        rememberMe   : data.rememberMe
    }
    axios.post('/authenticate', userCredentials).then(result => {
        const {token, ...rest} = result.data;

        axios.defaults.headers.common['Authorization'] = `Bearer ${
            token
        }`;

        if(token){
            const authUser = userCredentials.rememberMe ? StorageManager.set('token',token) : StorageManager.setToSession('token',token);
            if(authUser){
                dispatch(saveUser(rest));
                window.location = '/app';
            }
        }
    });
}
export const getAuthedUser = () => dispatch =>{
    const token = StorageManager.get('token');
    if(token){
        axios.get('/users/self', { headers: { 'Authorization' : `Bearer ${token}`}}).then(result =>{
            console.log(result.data);
            dispatch(saveUser(result.data));
        }).catch(err => {
            console.log(err);
            throw err;
        });
    } else {
        window.location = '/login';
    }
}

export const logout = () => dispatch =>{
      StorageManager.clearAll();
      window.location = '/login';
}