import {createStore, applyMiddleware, compose} from 'redux'
import {createLogger} from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'

const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
    middleware.push(createLogger());
}
const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(...middleware),
    // other store enhancers if any
);
const store = createStore(reducer, enhancer);

export default store