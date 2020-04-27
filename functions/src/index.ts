import * as functions from 'firebase-functions';
import { shuffle } from './util';

import admin = require('firebase-admin');

admin.initializeApp();
const db = admin.database();

const getRoles = (n: number): string[] => {
    const goodBadMap: { [k: number]: number[] } = {
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

interface PlayerType {
    uid: string;
    name: string;
    role: string;
}

interface GameStateType {
    phase: 'assign' | 'turn';
    numPlayers: number;
    order: number[];
    currentTurn: number;
    players: Array<PlayerType>;
}

interface GameInType {
    ready: { [uid: string]: boolean };
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
        })
        .catch((err) => {
            throw new functions.https.HttpsError('internal', err);
        });
});
