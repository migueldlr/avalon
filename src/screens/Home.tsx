import React from 'react';
import { connect } from 'react-redux';
import { Box, Flex, Button, Input } from 'theme-ui';
import { createRoom } from '../firebase/rooms';
import { joinRoom } from '../store/room/actions';

interface HomeProps {
    joinRoom: typeof joinRoom;
}

const Home = (props: HomeProps) => {
    const handleCreate = async () => {
        const roomId = await createRoom();
        if (roomId == null) return;
        props.joinRoom(roomId);
    };
    return (
        <Box sx={{ textAlign: 'right' }}>
            <Button onClick={handleCreate}>Create Room</Button>
            <Flex>
                <Input sx={{ width: 'inherit' }} />
                <Button>Join Room</Button>
            </Flex>
            {/* <Text>Please center</Text> */}
        </Box>
    );
};

export default connect(null, { joinRoom })(Home);
