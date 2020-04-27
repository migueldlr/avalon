export interface PlayerType {
    uid: string;
    name: string;
    role: string;
}

export interface GameStateType {
    phase: 'assign' | 'turn' | 'start';
    numPlayers: number;
    order: number[];
    currentTurn: number;
    players: Array<PlayerType>;
}

export interface GameInType {
    ready: { [uid: string]: boolean };
}
