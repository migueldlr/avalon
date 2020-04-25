import { JOIN_ROOM, LEAVE_ROOM } from './types';

export const joinRoom = (roomId: string) => ({
    type: JOIN_ROOM,
    payload: {
        roomId,
    },
});

export const leaveRoom = () => ({
    type: LEAVE_ROOM,
    payload: {},
});
