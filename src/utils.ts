import { auth } from './firebase/index';
import { GameStateType, Role } from './types';

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

// this is merlin's version so it includes oberon
export const isBadForMerlin = (role: Role) => {
    return (
        role === 'assassin' ||
        role === 'bad' ||
        role === 'morgana' ||
        role === 'oberon'
    );
};

// this is the normal one for the other characters besides merlin to use
export const isBad = (role: Role) => {
    return (
        role === 'assassin' ||
        role === 'bad' ||
        role === 'morgana' ||
        role === 'mordred'
    );
};
