import { legacy_createStore as createStore, combineReducers } from 'redux'

import { boardReducer } from './reducers/board.reducer'
import { userReducer } from './reducers/user.reducer'
import { reviewReducer } from './reducers/review.reducer'
import { systemReducer } from './reducers/system.reducer'

const rootReducer = combineReducers({
    boardModule: boardReducer,
    userModule: userReducer,
    systemModule: systemReducer,
    reviewModule: reviewReducer, //not needed
})


const middleware = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : undefined
export const store = createStore(rootReducer, middleware)
