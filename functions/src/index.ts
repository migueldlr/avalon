import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shuffle } from './util';

admin.initializeApp();
const db = admin.database();

const getRoles = (n: number, percivalMorgana: boolean): string[] => {
    const goodBadMap: Record<number, number[]> = {
        5: [3, 2],
        6: [4, 2],
        7: [4, 3],
        8: [5, 3],
        9: [6, 3],
        10: [6, 4],
    };
    const goodBad = goodBadMap[n];
    const good = new Array(goodBad[0]).fill('good');
    good[0] = 'merlin';
    const bad = new Array(goodBad[1]).fill('bad');
    bad[0] = 'assassin';
    if (percivalMorgana) {
        good[1] = 'percival';
        bad[1] = 'morgana';
    }
    const roles = shuffle(good.concat(bad));
    return roles;
};

const getQuests = (n: number): number[] => {
    const numToGameMap: Record<number, number[]> = {
        5: [2, 3, 2, 3, 3],
        6: [2, 3, 4, 3, 4],
        7: [2, 3, 3, 4, 4],
        8: [3, 4, 4, 5, 5],
        9: [3, 4, 4, 5, 5],
        10: [3, 4, 4, 5, 5],
    };
    return numToGameMap[n];
};

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
        | 'assassin';
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
}

interface GameInType {
    ready: { [uid: string]: boolean };
    teamVote: { [uid: string]: boolean }[][];
    questVote: { [uid: string]: boolean };
    continue: { [uid: string]: number };
    proposed: string[][][];
    assassinPick: string;
}

const updateGame = (
    gameState: GameStateType,
    gameIn: GameInType,
    dbRef: admin.database.Reference,
    gameId: string,
): Promise<any> | null => {
    console.log('hot reloading!');
    const gameRef = dbRef.child(`games/${gameId}`);
    const gameInRef = dbRef.child(`gameIn/${gameId}`);

    if (gameState.phase === 'assign') {
        if (Object.values(gameIn.ready).length === gameState.numPlayers) {
            console.log(0);
            return gameRef.update({
                phase: 'turn',
                currentTurn: 0,
            });
        }
    } else if (
        gameState.phase === 'turn' &&
        gameIn.proposed[gameState.currentQuest][gameState.currentTeamVote]
    ) {
        console.log(1);
        return gameRef.update({
            phase: 'voteTeam',
            [`proposed/${gameState.currentQuest}/${gameState.currentTeamVote}`]: gameIn
                .proposed[gameState.currentQuest][gameState.currentTeamVote],
        });
    } else if (
        gameState.phase === 'voteTeam' &&
        Object.values(
            gameIn.teamVote[gameState.currentQuest][gameState.currentTeamVote],
        ).length === gameState.numPlayers
    ) {
        console.log(2);

        const yeas = Object.values(
            gameIn.teamVote[gameState.currentQuest][gameState.currentTeamVote],
        ).filter((v) => v).length;
        if (yeas > 0.5 * gameState.numPlayers) {
            return gameInRef.update({ questVote: [] }).then(() => {
                return gameRef.update({
                    phase: 'voteQuest',
                    [`teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}`]: gameIn
                        .teamVote[gameState.currentQuest][
                        gameState.currentTeamVote
                    ],
                });
            });
        }
        // five rejections in a row, so bad guys auto-win a round
        if (gameState.rejects >= 4) {
            return Promise.all([
                gameRef.update({
                    phase: 'decision',
                    questVote: 'rejects',
                    questResults: (gameState.questResults ?? []).concat(false),
                    [`teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}`]: gameIn
                        .teamVote[gameState.currentQuest][
                        gameState.currentTeamVote
                    ],
                }),
                gameInRef.update({ ready: [] }),
            ]);
        }
        return Promise.all([
            gameRef.update({
                phase: 'turn',
                currentTurn: (gameState.currentTurn + 1) % gameState.numPlayers,
                currentTeamVote: gameState.currentTeamVote + 1,
                rejects: gameState.rejects + 1,
                [`teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}`]: gameIn
                    .teamVote[gameState.currentQuest][
                    gameState.currentTeamVote
                ],
            }),
        ]);
    } else if (
        gameState.phase === 'voteQuest' &&
        Object.values(gameIn.questVote).length ===
            gameState.quests[gameState.currentQuest]
    ) {
        console.log(3);

        const reqFails =
            gameState.numPlayers >= 7 && gameState.currentQuest === 3 ? 2 : 1;
        const fails = Object.values(gameIn.questVote).filter((v) => !v).length;
        const oldQuestResults = gameState.questResults ?? [];
        const gameUpdate = {
            phase: 'decision',
            questResults: oldQuestResults.concat(fails < reqFails),
            questVote: Object.values(gameIn.questVote),
        };

        return Promise.all([
            gameRef.update(gameUpdate),
            gameInRef.update({ ready: [] }),
        ]);
    } else if (
        gameState.phase === 'decision' &&
        Object.values(gameIn.ready).length === gameState.numPlayers
    ) {
        console.log(4);

        console.log('happens');
        // all quests are done
        // bad guys auto-win
        if (gameState.questResults.filter((x) => !x).length >= 3) {
            return gameRef.update({
                phase: 'end',
                finalResult: 'bad',
            });
        }
        // assassin phase
        if (gameState.questResults.filter((x) => x).length >= 3) {
            return gameRef.update({
                phase: 'assassin',
            });
        }
        if (gameState.currentQuest <= 3) {
            return gameRef.update({
                phase: 'turn',
                currentTurn: (gameState.currentTurn + 1) % gameState.numPlayers,
                currentQuest: gameState.currentQuest + 1,
                currentTeamVote: 0,
                rejects: 0,
            });
        }
    } else if (gameState.phase === 'assassin' && gameIn.assassinPick) {
        if (
            gameIn.assassinPick ===
            gameState.players.find((p) => p.role === 'merlin')?.name
        ) {
            return gameRef.update({
                phase: 'end',
                assassinPick: gameIn.assassinPick,
                finalResult: 'bad',
            });
        }
        return gameRef.update({
            phase: 'end',
            assassinPick: gameIn.assassinPick,
            finalResult: 'good',
        });
    }
    return null;
};

export const updateGameListener = functions.database
    .ref(`/gameIn/{gameId}`)
    .onWrite((change, context) => {
        const gameId: string = context.params.gameId;
        const gameIn = change.after.val();
        const gameRef = db.ref(`games/${gameId}`);
        return gameRef.once('value', (gameSnap) => {
            const gameState = gameSnap.val();
            return updateGame(gameState, gameIn, db.ref(), gameId);
        });
    });

export const createGame = functions.https.onCall(async (data, context) => {
    const roomId = data.roomId;

    const roomData: RoomState = (
        await db.ref(`rooms/${roomId}`).once('value')
    ).val();

    const numPlayers = Object.entries(roomData.players).length;
    if (numPlayers > 10 || numPlayers < 5)
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Number of players must be between 5 and 10',
        );
    const roles = getRoles(numPlayers, roomData.opts.percivalMorgana ?? false);
    const players = Object.entries(roomData.players).map(([uid, name], i) => ({
        uid,
        name,
        role: roles[i],
    }));

    const gameId = roomId;
    const gameRef = db.ref(`games/${gameId}`);
    await gameRef
        .set({
            numPlayers: players.length,
            players,
            phase: 'assign',
            order: shuffle([...Array(numPlayers).keys()]),
            quests: getQuests(numPlayers),
            currentQuest: 0,
            currentTeamVote: 0,
            questResults: [],
            rejects: 0,
        })
        .catch((err) => {
            throw new functions.https.HttpsError('internal', err);
        });
});
