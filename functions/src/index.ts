import * as functions from 'firebase-functions';
import { customAlphabet } from 'nanoid';

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
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin
        .database()
        .ref('/messages')
        .push({ original: original });
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
});

export const createGame = functions.https.onCall(async (data, context) => {
    const roomId = data.roomId;
    const roomData: { [k: string]: { name: string } } = (
        await db.ref(`rooms/${roomId}`).once('value')
    ).val();
    const players = Object.entries(roomData).map(([k, u]) => ({
        uid: k,
        name: u.name,
    }));

    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
    const gameId = nanoid();
    const gameRef = db.ref(`games/${gameId}`);
    await gameRef
        .set({
            players,
        })
        .catch((err) => {
            throw new functions.https.HttpsError('unknown', err);
        });
    players.forEach((player) => {});

    return { gameId };
});
