export interface RoomState {
    roomId: string | null;
}

export const JOIN_ROOM = 'JOIN_ROOM';
export const LEAVE_ROOM = 'LEAVE_ROOM';

interface JoinRoomAction {
    type: typeof JOIN_ROOM;
    payload: RoomState;
}

interface LeaveRoomAction {
    type: typeof LEAVE_ROOM;
    payload: {};
}

export type RoomActionTypes = JoinRoomAction | LeaveRoomAction;
