import { JOIN_ROOM, LEAVE_ROOM, RoomState, RoomActionTypes } from './types';

const initialState: RoomState = {
    roomId: null,
};

export const roomReducer = (
    state = initialState,
    action: RoomActionTypes,
): RoomState => {
    switch (action.type) {
        case JOIN_ROOM: {
            const { roomId } = action.payload;
            return { ...state, roomId };
        }
        case LEAVE_ROOM: {
            return { ...state, roomId: null };
        }
        default:
            return state;
    }
};
