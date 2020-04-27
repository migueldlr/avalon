export interface GameState {
    gameId: string | null;
}

export const JOIN_GAME = 'JOIN_GAME';

interface JoinGameAction {
    type: typeof JOIN_GAME;
    payload: GameState;
}

export type GameActionTypes = JoinGameAction;
