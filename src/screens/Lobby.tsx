import React from 'react';
import { connect } from 'react-redux';
import { Box, Text, Button } from 'theme-ui';

import { leaveRoom } from '../store/room/actions';
import { dbLeaveRoom } from '../firebase/rooms';
import { AppState } from '../store';

interface LobbyProps {
    roomId: String | null;
    leaveRoom: typeof leaveRoom;
}

const Lobby = (props: LobbyProps) => {
    const { roomId } = props;
    const handleLeaveRoom = async () => {
        if (roomId == null) {
            console.error('Room ID not found');
            return;
        }
        await dbLeaveRoom(roomId);
        props.leaveRoom();
    };
    return (
        <Box>
            <Text>{roomId ?? ''}</Text>
            <Button onClick={handleLeaveRoom}>Leave Room</Button>
        </Box>
    );
};

export default connect((state: AppState) => ({ roomId: state.rooms.roomId }), {
    leaveRoom,
})(Lobby);
