import { functions } from './index';
import { db } from './index';

export const dbCreateGame = async (roomId: string): Promise<string | null> => {
    try {
        const res = await functions.httpsCallable('createGame')({ roomId });
        const { gameId } = res.data;
        return gameId;
    } catch (err) {
        console.log(err);
        return null;
    }
};

export const dbGetGameRef = (gameId: string) => {
    return db.ref(`games/${gameId}`);
};
