import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Box, Flex, Button, Input } from 'theme-ui';
import { dbCreateRoom, dbJoinRoom } from '../firebase/rooms';
import { joinRoom } from '../store/room/actions';

interface HomeProps {
    joinRoom: typeof joinRoom;
}

const Home = (props: HomeProps) => {
    const [roomIdInput, setRoomIdInput] = useState('');

    const handleCreate = async () => {
        const roomId = await dbCreateRoom();
        if (roomId == null) return;
        props.joinRoom(roomId);
    };
    const handleJoin = async () => {
        if (roomIdInput.length === 0) return;
        const joined = await dbJoinRoom(roomIdInput);
        if (joined) props.joinRoom(roomIdInput);
    };

    return (
        <Box sx={{ textAlign: 'right' }}>
            <Button onClick={handleCreate}>Create Room</Button>
            <Flex>
                <Input
                    sx={{ width: 'inherit' }}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    value={roomIdInput}
                />
                <Button onClick={handleJoin}>Join Room</Button>
            </Flex>
            {/* <Text>Please center</Text> */}
        </Box>
    );
};

export default connect(null, { joinRoom })(Home);
