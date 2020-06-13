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

export const getPlayerName = (gameState: GameStateType, uid: string) => {
    return gameState.players.find((p) => p.uid === uid)?.name ?? '';
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
        role === 'mordred' ||
        role === 'oberon'
    );
};

export const roleDisplay: Record<Role, string> = {
    bad: 'minion',
    good: 'knight',
    merlin: 'Merlin',
    assassin: 'Assassin',
    morgana: 'Morgana',
    percival: 'Percival',
    oberon: 'Oberon',
    mordred: 'Mordred',
    tristan: 'Tristan',
    iseult: 'Iseult',
};

export const roleText: Record<Role, string> = {
    good: 'a knight of Arthur 🏰',
    merlin: 'the wise wizard Merlin 🏰',
    percival: 'the brave Percival 🏰',
    bad: 'an evil minion of Mordred 💀',
    assassin: 'the vicious Assassin 💀',
    morgana: 'the sinister Morgana 💀',
    oberon: 'the unknown Oberon 💀',
    mordred: 'the evil ruler Mordred 💀',
    tristan: 'the lovestruck Tristan 🏰',
    iseult: 'the lovestruck Iseult 🏰',
};
