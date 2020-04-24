import { createStore, combineReducers } from 'redux';

import { roomReducer } from './room/reducers';

const rootReducer = combineReducers({
    rooms: roomReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default () => {
    const store = createStore(rootReducer);

    return store;
};
