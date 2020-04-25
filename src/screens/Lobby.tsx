import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text, Button, Flex } from 'theme-ui';

import { leaveRoom } from '../store/room/actions';
import { dbLeaveRoom, dbGetRoomRef } from '../firebase/rooms';
import { AppState } from '../store';

interface LobbyProps {
    roomId: string | null;
    leaveRoom: typeof leaveRoom;
}

const Lobby = (props: LobbyProps) => {
    const { roomId } = props;
    const [userList, setUserList] = useState<Array<string>>([]);
    useEffect(() => {
        if (roomId == null) return;
        const roomRef = dbGetRoomRef(roomId);
        roomRef.on('value', (snap) => {
            const snapVal = snap.val();

            // firestore will update before redux sometimes so we don't want to try to read from snapVal yet
            if (snapVal == null) return;

            const data: Array<{ name: string }> = Object.values(snapVal);
            setUserList(data.map((u) => u.name));
        });
    }, [roomId]);
    if (roomId == null)
        return (
            <Box>
                <Text>Not connected to a room!</Text>
            </Box>
        );

    const handleLeaveRoom = async () => {
        if (roomId == null) {
            console.error('Room ID not found');
            return;
        }
        props.leaveRoom();
        await dbLeaveRoom(roomId);
    };
    return (
        <Box>
            <Button
                onClick={() => {
                    navigator.clipboard.writeText(roomId);
                }}
                variant="copy">
                {roomId}
            </Button>
            <Flex sx={{ flexDirection: 'column' }}>
                {userList.map((uname) => (
                    <Text key={uname}>{uname}</Text>
                ))}
            </Flex>
            <Button onClick={handleLeaveRoom}>Leave Room</Button>
        </Box>
    );
};

export default connect((state: AppState) => ({ roomId: state.rooms.roomId }), {
    leaveRoom,
})(Lobby);
