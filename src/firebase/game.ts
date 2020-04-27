import { functions } from './index';
import { db, auth } from './index';
import { GameStateType } from '../types';

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

export const dbGetGameInRef = (gameId: string) => {
    return db.ref(`gameIn/${gameId}`);
};

export const dbRejoinGame = async () => {
    const uid = auth.currentUser?.uid;
    const allGamesRef = db.ref(`games`);
    try {
        const allGames = (await allGamesRef.once('value')).val();
        if (allGames == null) return null;
        const games: [string, GameStateType][] = Object.entries(allGames);
        console.log(uid);
        console.log(games);
        for (let i = 0; i < games.length; i++) {
            const [gameId, game] = games[i];
            console.log(game.players.map((x) => x.uid));
            if (game.players.some((x) => x.uid === uid)) {
                return gameId;
            }
        }
        return null;
    } catch (err) {
        throw err;
    }
};
