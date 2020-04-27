export type Role = 'bad' | 'good' | 'merlin' | 'assassin';

export interface PlayerType {
    uid: string;
    name: string;
    role: Role;
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
