import { JOIN_GAME, UPDATE_GAME } from './types';
import { GameStateType } from '../../types';

export const joinGame = (gameId: string) => ({
    type: JOIN_GAME,
    payload: {
        gameId,
    },
});

export const updateGame = (gameState: GameStateType) => ({
    type: UPDATE_GAME,
    payload: gameState,
});
