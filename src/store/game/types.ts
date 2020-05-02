import { GameStateType } from '../../types';

export interface GameState {
    gameId: string | null;
    gameState: GameStateType;
}

export const JOIN_GAME = 'JOIN_GAME';
export const UPDATE_GAME = 'UPDATE_GAME';

interface JoinGameAction {
    type: typeof JOIN_GAME;
    payload: GameState;
}

interface UpdateGameAction {
    type: typeof UPDATE_GAME;
    payload: GameStateType;
}

export type GameActionTypes = JoinGameAction | UpdateGameAction;
