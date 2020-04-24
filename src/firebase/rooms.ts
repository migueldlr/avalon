import { customAlphabet } from 'nanoid';
import { auth, db } from './index';

// eslint-disable-next-line import/prefer-default-export
export const createRoom = async () => {
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

export const deleteRoom = async (roomId: String) => {
    const uid = auth.currentUser?.uid;
    const roomRef = db.ref(`rooms/${roomId}/${uid}`);
    try {
        await roomRef.set(null);
        return roomId;
    } catch (err) {
        throw err;
    }
};
