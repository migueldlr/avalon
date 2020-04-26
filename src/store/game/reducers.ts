import { JOIN_GAME, GameState, GameActionTypes } from './types';

const initialState: GameState = {
    gameId: null,
};

export const gameReducer = (
    state = initialState,
    action: GameActionTypes,
): GameState => {
    switch (action.type) {
        case JOIN_GAME: {
            const { gameId } = action.payload;
            return { ...state, gameId };
        }
        default:
            return state;
    }
};
