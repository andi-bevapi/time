import axios from 'axios';
import StorageManager from '../../helpers/StorageManager' ;
import moment from 'moment';

axios.defaults.baseURL = process.env.REACT_APP_API_GATEWAY_ENDPOINT;

export const SHOW_POSTS = 'SHOW_POSTS';




export const showPosts = (payload) => {
    return  {
        type : SHOW_POSTS,
        payload
    }
}

export const getPosts  =  () => dispatch  => {
    const token = StorageManager.get('token');
    if(token){
    axios.get('/dashboard',{ headers: { 'Authorization' : `Bearer ${token}`}}).then(result => {
        console.log(result);
        
        dispatch(showPosts(result.data));

    }).catch(err => {
        console.log(err);
        throw err ;
    });

        
    }
}