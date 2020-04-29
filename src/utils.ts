import { auth } from './firebase/index';
import { GameStateType } from './types';

export const listify = (l: string[]) => {
    if (l.length === 1) return l[0];
    if (l.length === 2) return l.join(' and ');
    const first = l.slice(0, -1).join(', ');
    return `${first}, and ${l[l.length - 1]}`;
};

export const getThisPlayer = (gameState: GameStateType) => {
    const uid = auth.currentUser?.uid;
    return gameState.players.find((p) => p.uid === uid);
};
