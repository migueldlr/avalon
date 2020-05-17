interface RoomState {
    opts: { [opt: string]: boolean };
    players: RoomPlayer;
}

interface RoomPlayer {
    [uid: string]: string;
}

interface PlayerType {
    uid: string;
    name: string;
    role: string;
}

interface GameStateType {
    phase:
        | 'assign'
        | 'turn'
        | 'voteTeam'
        | 'voteQuest'
        | 'decision'
        | 'end'
        | 'assassin'
        | 'ladyPick'
        | 'ladyReveal';
    numPlayers: number;
    order: number[];
    currentTurn: number;
    currentQuest: number;
    currentTeamVote: number;
    questResults: boolean[];
    questVote: boolean[];
    quests: number[];
    players: Array<PlayerType>;
    finalResult: 'good' | 'bad';
    rejects: number;
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
