export type Role =
    | 'bad'
    | 'good'
    | 'merlin'
    | 'assassin'
    | 'morgana'
    | 'percival'
    | 'oberon'
    | 'mordred';

export interface PlayerType {
    uid: string;
    name: string;
    role: Role;
}

export interface RoomState {
    opts: { [opt: string]: boolean };
    players: RoomPlayer;
}

export interface RoomPlayer {
    [uid: string]: string;
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
    questVote: boolean[] | string;
    quests: number[];
    players: Array<PlayerType>;
    proposed: string[][][];
    teamVote: { [uid: string]: boolean }[][];
    finalResult: 'good' | 'bad';
    rejects: number;
    assassinPick: string;
}

interface GameInType {
    ready: { [uid: string]: boolean };
    teamVote: { [uid: string]: boolean }[][];
    questVote: { [uid: string]: boolean };
    continue: { [uid: string]: number };
    proposed: string[][][];
    assassinPick: string;
}
