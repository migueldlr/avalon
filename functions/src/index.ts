import * as functions from 'firebase-functions';
import { shuffle } from './util';

import admin = require('firebase-admin');

admin.initializeApp();
const db = admin.database();

const getRoles = (n: number): string[] => {
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

interface PlayerType {
    uid: string;
    name: string;
    role: string;
}

interface GameStateType {
    phase: 'assign' | 'turn' | 'voteTeam' | 'voteQuest';
    numPlayers: number;
    order: number[];
    currentTurn: number;
    currentQuest: number;
    questResults: boolean[];
    questVote: boolean[];
    quests: number[];
    players: Array<PlayerType>;
}

interface GameInType {
    ready: { [uid: string]: boolean };
    teamVote: { [uid: string]: boolean };
    questVote: { [uid: string]: boolean };
    proposed: string[];
}

const updateGame = (
    gameState: GameStateType,
    gameIn: GameInType,
    gameRef: admin.database.Reference,
): Promise<any> | null => {
    if (gameState.phase === 'assign') {
        console.log(
            `${Object.values(gameIn.ready).length} ${gameState.numPlayers}`,
        );
        if (Object.values(gameIn.ready).length === gameState.numPlayers) {
            return gameRef.update({
                phase: 'turn',
                currentTurn: 0,
            });
        }
    } else if (gameState.phase === 'turn' && gameIn.proposed) {
        return gameRef.update({
            phase: 'voteTeam',
            proposed: gameIn.proposed,
        });
    } else if (
        gameState.phase === 'voteTeam' &&
        Object.values(gameIn.teamVote).length === gameState.numPlayers
    ) {
        const yeas = Object.values(gameIn.teamVote).filter((v) => v).length;
        if (yeas > 0.5 * gameState.numPlayers) {
            return gameRef.update({
                phase: 'voteQuest',
            });
        }
        return gameRef.update({
            phase: 'turn',
            currentTurn: (gameState.currentTurn + 1) % gameState.numPlayers,
        });
    } else if (
        gameState.phase === 'voteQuest' &&
        Object.values(gameIn.questVote).length ===
            gameState.quests[gameState.currentQuest]
    ) {
        const reqFails =
            gameState.numPlayers >= 7 && gameState.currentQuest === 3 ? 2 : 1;
        const fails = Object.values(gameIn.questVote).filter((v) => !v).length;
        const oldQuestResults = gameState.questResults ?? [];
        if (fails >= reqFails) {
            return gameRef.update({
                phase: 'decision',
                questResults: oldQuestResults.concat(false),
                questVote: Object.values(gameIn.questVote),
            });
        }
        return gameRef.update({
            phase: 'decision',
            questResults: oldQuestResults.concat(true),
            questVote: Object.values(gameIn.questVote),
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
            return updateGame(gameState, gameIn, gameRef);
        });
    });

export const createGame = functions.https.onCall(async (data, context) => {
    const roomId = data.roomId;
    const roomData: { [k: string]: { name: string } } = (
        await db.ref(`rooms/${roomId}`).once('value')
    ).val();
    const numPlayers = Object.entries(roomData).length;
    if (numPlayers > 11 || numPlayers < 5)
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Number of players must be between 5 and 10',
        );
    const roles = getRoles(numPlayers);
    const players = Object.entries(roomData).map(([k, u], i) => ({
        uid: k,
        name: u.name,
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
            questResults: [],
        })
        .catch((err) => {
            throw new functions.https.HttpsError('internal', err);
        });
});
