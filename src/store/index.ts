import { createStore, combineReducers } from 'redux';

import { roomReducer } from './room/reducers';
import { gameReducer } from './game/reducers';

const rootReducer = combineReducers({
    rooms: roomReducer,
    game: gameReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default () => {
    const store = createStore(rootReducer);

    return store;
};
