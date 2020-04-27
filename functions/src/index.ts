import * as functions from 'firebase-functions';

import admin = require('firebase-admin');

admin.initializeApp();
const db = admin.database();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//     response.send('Hello from Firebase!');
// });

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//     // Grab the text parameter.
//     const original = req.query.text;
//     // Push the new message into the Realtime Database using the Firebase Admin SDK.
//     const snapshot = await admin
//         .database()
//         .ref('/messages')
//         .push({ original: original });
//     // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
//     res.redirect(303, snapshot.ref.toString());
// });

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
    const roles = good.concat(bad);
    // Fisher-Yates shuffle https://stackoverflow.com/a/12646864
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    return roles;
};

export const updateGame = functions.database
    .ref(`/gameIn/{gameId}`)
    .onWrite((change, context) => {
        const gameId: string = context.params.gameId;
        const gameIn = change.after.val();
        const gameRef = db.ref(`games/${gameId}`);
        return gameRef.once('value', (gameSnap) => {
            const gameState = gameSnap.val();
            if (gameState.phase === 'assign') {
                console.log(
                    `${Object.values(gameIn.ready).length} ${
                        gameState.numPlayers
                    }`,
                );
                if (
                    Object.values(gameIn.ready).length === gameState.numPlayers
                ) {
                    return gameRef.child('phase').set('turn');
                }
            }
            return () => null;
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
        })
        .catch((err) => {
            throw new functions.https.HttpsError('internal', err);
        });
});
