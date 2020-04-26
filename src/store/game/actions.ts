import { JOIN_GAME } from './types';

export const joinGame = (gameId: string) => ({
    type: JOIN_GAME,
    payload: {
        gameId,
    },
});
