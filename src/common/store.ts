import {persistReducer} from 'redux-persist';
import {combineReducers, createStore} from 'redux';
import credentialsReducer, {RESET} from './reducers/credentialsReducer';
import userAccountReducer from './reducers/userAccountReducer';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const appReducer = combineReducers({
    // Add reducers here
    credentialsReducer: credentialsReducer,
    userAccountReducer: userAccountReducer,
});

const rootReducer = (state: any, action: any) => {
    if (action.type === RESET) {
        console.log('🔥 resetting redux store');
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
        // whitelist reducers here -- to persist
        'credentialsReducer',
        'userAccountReducer',
    ],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const configurePersistedStore = createStore(persistedReducer);

export default configurePersistedStore;
