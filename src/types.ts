export type Role = 'bad' | 'good' | 'merlin' | 'assassin';

export interface PlayerType {
    uid: string;
    name: string;
    role: Role;
}

export interface GameStateType {
    phase: 'assign' | 'turn' | 'voteTeam' | 'voteQuest' | 'start';
    numPlayers: number;
    order: number[];
    currentTurn: number;
    currentQuest: number;
    questResults: boolean[];
    questVote: boolean[];
    quests: number[];
    players: Array<PlayerType>;
    proposed: string[];
}

export interface GameInType {
    ready: { [uid: string]: boolean };
    teamVote: { [uid: string]: boolean };
}
