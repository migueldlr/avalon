import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    Box,
    Button,
    Input,
    Text,
    Heading,
    Link,
    Image,
    Flex,
    useColorMode,
} from 'theme-ui';
import { dbCreateRoom, dbJoinRoom, RoomResponse } from '../firebase/rooms';
import { joinRoom } from '../store/room/actions';
import { ReactComponent as SunIcon } from '../img/brightness.svg';

import githubIcon from '../img/github.png';
import githubIconLight from '../img/githublight.png';
import { navigate } from '@reach/router';

interface HomeProps {
    joinRoom: typeof joinRoom;
}

const Home = (props: HomeProps) => {
    const [roomIdInput, setRoomIdInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [message, setMessage] = useState('');
    const [colorMode, setColorMode] = useColorMode();
    const [egg, setEgg] = useState(false);

    const handleCreate = async () => {
        const roomId = await dbCreateRoom(nameInput);
        if (roomId == null) return;
        props.joinRoom(roomId.toLowerCase());
    };
    const handleJoin = async () => {
        const joined = await dbJoinRoom(nameInput, roomIdInput.toLowerCase());
        switch (joined) {
            case RoomResponse.OK:
                props.joinRoom(roomIdInput.toLowerCase());
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
                {egg ? 'Hey Tribe, Miguel Here' : 'The Resistance: Avalon'}
            </Heading>
            <Flex sx={{ textAlign: 'center', flexDirection: 'column' }}>
                <Input
                    sx={{
                        mb: '0.5em',
                        borderColor: nameInput !== '' ? '' : 'outlinefocused',
                    }}
                    onChange={(e) => setNameInput(e.target.value)}
                    value={nameInput}
                    placeholder="Your Name"
                />
                <Input
                    sx={{
                        borderColor: roomIdInput !== '' ? '' : 'outlinefocused',
                        mb: '0.5em',
                    }}
                    onChange={(e) =>
                        setRoomIdInput(e.target.value.toUpperCase())
                    }
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
                <Text sx={{ mb: '0.5em' }}>{message}</Text>
                <Button
                    onClick={handleCreate}
                    sx={{ width: '100%', mb: '0.5em' }}
                    disabled={nameInput === ''}
                    variant={nameInput === '' ? 'disabled' : 'primary'}>
                    Create Room
                </Button>
                <Button
                    sx={{ width: '100%' }}
                    variant="alt"
                    onClick={() => navigate('howto')}>
                    How To Play
                </Button>
            </Flex>
            <Box sx={{ mt: '90vh', position: 'absolute', textAlign: 'center' }}>
                <Text variant="disclaimer">
                    Based on Don Eskridge's{' '}
                    <Text sx={{ fontStyle: 'italic', display: 'inline' }}>
                        The Resistance
                    </Text>
                    .
                </Text>
                <Text variant="disclaimer">
                    Made by Miguel <span onClick={() => setEgg(!egg)}>de</span>{' '}
                    los Reyes and Seth Hollandsworth.
                </Text>
                <Flex
                    sx={{
                        mt: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Link href="https://github.com/migueldlr/avalon">
                        <Image
                            src={
                                colorMode === 'default'
                                    ? githubIcon
                                    : githubIconLight
                            }
                            alt="Link to GitHub page"
                            sx={{ width: '20px', height: '20px', mr: 2 }}
                        />
                    </Link>
                    <Box sx={{ cursor: 'pointer' }}>
                        <SunIcon
                            fill={colorMode === 'default' ? 'black' : 'white'}
                            onClick={(e) => {
                                setColorMode(
                                    colorMode === 'default'
                                        ? 'dark'
                                        : 'default',
                                );
                            }}
                            width="20px"
                            height="20px"
                        />
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default connect(null, { joinRoom })(Home);
