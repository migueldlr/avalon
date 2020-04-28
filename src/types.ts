export type Role = 'bad' | 'good' | 'merlin' | 'assassin';

export interface PlayerType {
    uid: string;
    name: string;
    role: Role;
}

export interface GameStateType {
    phase:
        | 'assign'
        | 'turn'
        | 'voteTeam'
        | 'voteQuest'
        | 'start'
        | 'decision'
        | 'assassin'
        | 'end';
    numPlayers: number;
    order: number[];
    currentTurn: number;
    currentQuest: number;
    currentTeamVote: number;
    questResults: boolean[];
    questVote: boolean[];
    quests: number[];
    players: Array<PlayerType>;
    proposed: string[][][];
    finalResult: 'good' | 'bad';
}

export interface GameInType {
    ready: { [uid: string]: boolean };
    teamVote: { [uid: string]: boolean }[];
}
