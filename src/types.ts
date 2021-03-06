export type Role =
    | 'bad'
    | 'good'
    | 'merlin'
    | 'assassin'
    | 'morgana'
    | 'percival'
    | 'oberon'
    | 'mordred'
    | 'tristan'
    | 'iseult';

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
        | 'end'
        | 'ladyPick'
        | 'ladyReveal';
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
    lady?: string[];
}

interface GameInType {
    ready: { [uid: string]: boolean };
    teamVote: { [uid: string]: boolean }[][];
    questVote: { [uid: string]: boolean };
    continue: { [uid: string]: number };
    lady?: string[];
    proposed: string[][][];
    assassinPick: string;
}
