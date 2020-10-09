import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import combinedReducers from './reducers'

const composeFunc = process.env.NODE_ENV === 'development' ? composeWithDevTools : compose
const composedEnhancer = composeFunc(applyMiddleware(thunk))
export default createStore(combinedReducers, composedEnhancer)
