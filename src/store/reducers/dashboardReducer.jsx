import {SHOW_POSTS} from '../actions/dashboardAction' ;

const initialState = {
      posts : [],
      locations : [],
      schedules : []
}

export function showPosts(state = initialState , action){
    switch(action.type){
        case SHOW_POSTS :
            return {
                ...state,
                ...action.payload
            }
        default :
        return state
    }
}