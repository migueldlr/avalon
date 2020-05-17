import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { shuffle } from './util';
import { updateGame } from './game';

admin.initializeApp();
const db = admin.database();

const getRoles = (
    n: number,
    percival: boolean,
    morgana: boolean,
    oberon: boolean,
    mordred: boolean,
): string[] => {
    const goodBadMap: Record<number, number[]> = {
        5: [3, 2],
        6: [4, 2],
        7: [4, 3],
        8: [5, 3],
        9: [6, 3],
        10: [6, 4],
    };
    const goodBad = goodBadMap[n];
    // these characters always happen
    const good = new Array(goodBad[0]).fill('good');
    good[0] = 'merlin';
    const bad = new Array(goodBad[1]).fill('bad');
    bad[0] = 'assassin';

    // this is kind of like a hierarchy of assigning people,
    // if they don't fit in the array, they aren't played
    if (percival) {
        const percivalIdx = good.findIndex((str) => str === 'good');
        if (percivalIdx !== -1) good[percivalIdx] = 'percival';
    }
    if (morgana) {
        const morganaIdx = bad.findIndex((str) => str === 'bad');
        if (morganaIdx !== -1) bad[morganaIdx] = 'morgana';
    }
    if (oberon) {
        const oberonIdx = bad.findIndex((str) => str === 'bad');
        if (oberonIdx !== -1) bad[oberonIdx] = 'oberon';
    }
    if (mordred) {
        const mordredIdx = bad.findIndex((str) => str === 'bad');
        if (mordredIdx !== -1) bad[mordredIdx] = 'mordred';
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
    const roles = getRoles(
        numPlayers,
        roomData.opts?.percival ?? false,
        roomData.opts?.morgana ?? false,
        roomData.opts?.oberon ?? false,
        roomData.opts?.mordred ?? false,
    );
    const players = Object.entries(roomData.players).map(([uid, name], i) => ({
        uid,
        name,
        role: roles[i],
    }));

    const gameId = roomId;
    const gameRef = db.ref(`games/${gameId}`);
    const order = shuffle([...Array(numPlayers).keys()]);
    await gameRef
        .set({
            numPlayers: players.length,
            players,
            phase: 'assign',
            order,
            quests: getQuests(numPlayers),
            currentQuest: 0,
            currentTeamVote: 0,
            questResults: [],
            rejects: 0,
            lady: roomData.opts?.lady
                ? [players[order[order.length - 1]].uid]
                : null,
        })
        .catch((err) => {
            throw new functions.https.HttpsError('internal', err);
        });
});
