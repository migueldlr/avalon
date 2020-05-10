import { customAlphabet } from 'nanoid';
import { auth, db } from './index';

export enum RoomResponse {
    OK,
    ROOM_NOT_FOUND,
    NAME_TAKEN,
    OTHER,
}

export const dbCreateRoom = async (name: string) => {
    const uid = auth.currentUser?.uid;
    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 4);
    const roomId = nanoid();
    const roomRef = db.ref(`rooms/${roomId}/players/${uid}`);
    try {
        await roomRef
            .onDisconnect()
            .remove()
            .then(() => {
                roomRef.set(name);
                db.ref(`rooms/${roomId}/host`).set(uid);
            });
        return roomId;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return null;
    }
};

export const dbJoinRoom = async (
    name: string,
    roomId: string,
): Promise<RoomResponse> => {
    const uid = auth.currentUser?.uid;
    const roomRef = db.ref(`rooms/${roomId}/players/${uid}`);
    console.log(`rooms/${roomId}/players/${uid}`);
    try {
        const roomSnap: Array<{ name: string }> | null = (
            await db.ref(`rooms/${roomId}`).once('value')
        ).val();

        if (roomSnap == null) return RoomResponse.ROOM_NOT_FOUND;
        if (Object.values(roomSnap).some((u) => u.name === name))
            return RoomResponse.NAME_TAKEN;

        await roomRef
            .onDisconnect()
            .remove()
            .then(() => {
                roomRef.set(name);
            });

        return RoomResponse.OK;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return RoomResponse.OTHER;
    }
};

export const dbGetRoomRef = (roomId: string) => {
    return db.ref(`rooms/${roomId}`);
};

export const dbLeaveRoom = async (roomId: string) => {
    const uid = auth.currentUser?.uid;
    const roomRef = db.ref(`rooms/${roomId}/${uid}`);
    try {
        await roomRef.set(null);
        return roomId;
    } catch (err) {
        throw err;
    }
};
