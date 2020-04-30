import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Box, Button, Input, Text, Heading, Link, Image } from 'theme-ui';
import { dbCreateRoom, dbJoinRoom, RoomResponse } from '../firebase/rooms';
import { joinRoom } from '../store/room/actions';

import githubIcon from '../img/github.png';

interface HomeProps {
    joinRoom: typeof joinRoom;
}

const Home = (props: HomeProps) => {
    const [roomIdInput, setRoomIdInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [message, setMessage] = useState('');

    const handleCreate = async () => {
        const roomId = await dbCreateRoom(nameInput);
        if (roomId == null) return;
        props.joinRoom(roomId);
    };
    const handleJoin = async () => {
        const joined = await dbJoinRoom(nameInput, roomIdInput);
        switch (joined) {
            case RoomResponse.OK:
                props.joinRoom(roomIdInput);
                break;
            case RoomResponse.ROOM_NOT_FOUND:
                setMessage('Room not found!');
                break;
            case RoomResponse.NAME_TAKEN:
                setMessage('Name taken!');
                break;
            case RoomResponse.OTHER:
                setMessage('Something unexpected happened... oops!');
                break;
        }
    };

    return (
        <>
            <Heading sx={{ textAlign: 'center' }}>
                The Resistance: Avalon
            </Heading>
            <Box sx={{ textAlign: 'center' }}>
                <Input
                    sx={{ mb: '1em' }}
                    onChange={(e) => setNameInput(e.target.value)}
                    value={nameInput}
                    placeholder="Your Name"
                />
                <Button
                    onClick={handleCreate}
                    sx={{ width: '100%', mb: '1em' }}
                    disabled={nameInput === ''}
                    variant={nameInput === '' ? 'disabled' : 'primary'}>
                    Create Room
                </Button>
                <Input
                    sx={{ width: '100%' }}
                    onChange={(e) => setRoomIdInput(e.target.value)}
                    value={roomIdInput}
                    placeholder="Room Code"
                />
                <Button
                    onClick={handleJoin}
                    sx={{ width: '100%' }}
                    variant={
                        roomIdInput === '' || nameInput === ''
                            ? 'disabled'
                            : 'primary'
                    }
                    disabled={roomIdInput === '' || nameInput === ''}>
                    Join Room
                </Button>
                <Text sx={{ height: '1em' }}>{message}</Text>
            </Box>
            <Box sx={{ mt: '45vh', position: 'absolute', textAlign: 'center' }}>
                <Text variant="disclaimer">
                    Based on Don Eskridge's{' '}
                    <Text sx={{ fontStyle: 'italic', display: 'inline' }}>
                        The Resistance
                    </Text>
                    .
                </Text>
                <Text variant="disclaimer">
                    Made by Miguel de los Reyes and Seth Hollandsworth.
                </Text>
                <Link href="https://github.com/migueldlr/avalon">
                    <Image
                        src={githubIcon}
                        alt="Link to GitHub page"
                        sx={{ width: '20px', height: '20px', mt: 2 }}
                    />
                </Link>
            </Box>
        </>
    );
};

export default connect(null, { joinRoom })(Home);
