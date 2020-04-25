import { customAlphabet } from 'nanoid';
import { auth, db } from './index';

export const dbCreateRoom = async () => {
    const uid = auth.currentUser?.uid;
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);
    const roomId = nanoid();
    const roomRef = db.ref(`rooms/${roomId}/${uid}`);
    try {
        await roomRef
            .onDisconnect()
            .remove()
            .then(() => {
                roomRef.set({ host: true });
            });
        return roomId;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const dbJoinRoom = async (roomId: String): Promise<boolean> => {
    const uid = auth.currentUser?.uid;
    const roomRef = db.ref(`rooms/${roomId}/${uid}`);
    try {
        const exists = (await db.ref(`rooms/${roomId}`).once('value')).val();
        if (exists == null) return false;
        await roomRef
            .onDisconnect()
            .remove()
            .then(() => {
                roomRef.set({ host: false });
            });
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const dbLeaveRoom = async (roomId: String) => {
    const uid = auth.currentUser?.uid;
    const roomRef = db.ref(`rooms/${roomId}/${uid}`);
    try {
        await roomRef.set(null);
        return roomId;
    } catch (err) {
        throw err;
    }
};
