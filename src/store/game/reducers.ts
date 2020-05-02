import { JOIN_GAME, UPDATE_GAME, GameState, GameActionTypes } from './types';

const initialState: GameState = {
    gameId: null,
    gameState: {
        phase: 'start',
        numPlayers: 0,
        order: [],
        currentTurn: -1,
        players: [],
        proposed: [],
        currentQuest: -1,
        currentTeamVote: -1,
        quests: [],
        questResults: [],
        questVote: [],
        finalResult: 'good',
        rejects: -1,
        assassinPick: '',
        teamVote: [],
    },
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
        case UPDATE_GAME: {
            const gameState = action.payload;
            return { ...state, gameState };
        }
        default:
            return state;
    }
};
