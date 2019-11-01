import {AUTH_USER} from '../actions/logindUserAction';
const initialState = {
   user : ''
}

export function loginUser(state = initialState , action){
    switch(action.type){
        case AUTH_USER :
            return {
                ...state,
                user :   action.payload.user
            }
        default : 
        return initialState;
    }
}