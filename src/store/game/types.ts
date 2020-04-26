export interface GameState {
    inGame: boolean;
}

export const JOIN_GAME = 'JOIN_GAME';

interface JoinGameAction {
    type: typeof JOIN_GAME;
    payload: GameState;
}

export type GameActionTypes = JoinGameAction;
