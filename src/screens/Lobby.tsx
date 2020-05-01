import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text, Button, Flex, Checkbox, Label } from 'theme-ui';

import { leaveRoom } from '../store/room/actions';
import { joinGame } from '../store/game/actions';
import { dbLeaveRoom, dbGetRoomRef } from '../firebase/rooms';
import { AppState } from '../store';
import { dbCreateGame, dbGetGameRef } from '../firebase/game';
import { auth } from '../firebase/index';
import { db } from '../firebase/index';

interface LobbyProps {
    roomId: string | null;
    leaveRoom: typeof leaveRoom;
    joinGame: typeof joinGame;
}

const Lobby = (props: LobbyProps) => {
    const { roomId, joinGame } = props;
    const uid = auth.currentUser?.uid;
    const [userList, setUserList] = useState<Array<string>>([]);
    const [host, setHost] = useState<{ name: string; uid: string }>({
        name: '',
        uid: '',
    });
    const [percivalMorgana, setPercivalMorgana] = useState<boolean>(false);

    useEffect(() => {
        if (roomId == null) return;
        // IIFE to register listener for game start
        ((gameId: string) => {
            const gameRef = dbGetGameRef(gameId);
            gameRef.on('value', (snap) => {
                const snapVal = snap.val();

                if (snapVal == null) return;
                joinGame(gameId);
            });
        })(roomId);

        const roomRef = dbGetRoomRef(roomId);
        roomRef.on('value', (snap) => {
            const snapVal = snap.val();

            // firestore will update before redux sometimes so we don't want to try to read from snapVal yet
            if (snapVal == null) return;

            const data: Array<{ name: string }> = Object.values(snapVal);
            setUserList(data.map((u) => u.name));
        });
        roomRef.once('value').then(function (dataSnapshot) {
            const val: {
                [uid: string]: { host: boolean; name: string };
            } = dataSnapshot.val(); // get the data at this ref
            const hostIndex = Object.values(val).findIndex((e) => e.host);
            const hostObj = Object.entries(val)[hostIndex];
            setHost({ uid: hostObj[0], name: hostObj[1].name });
        });
    }, [roomId, joinGame]);
    if (roomId == null)
        return (
            <Box>
                <Text>Not connected to a room!</Text>
            </Box>
        );

    const handleLeaveRoom = async () => {
        if (roomId == null) {
            // eslint-disable-next-line no-console
            console.error('Room ID not found');
            return;
        }
        props.leaveRoom();
        await dbLeaveRoom(roomId);
    };

    const handleCreateGame = async () => {
        // TODO: make the users in the room go one field inward so they all have a unique key and this reference won't clog that
        db.ref(`rooms/${roomId}/includePercivalMorgana`)
            .set(percivalMorgana)
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
        const gameId = await dbCreateGame(roomId);
        if (gameId == null) return;
        props.joinGame(gameId);
    };

    const handleSelect = (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    ) => {
        const target = e.target as HTMLInputElement;
        setPercivalMorgana(target.checked);
    };

    const isHost = host.uid === uid;
    return (
        <Box>
            <Button
                onClick={() => {
                    navigator.clipboard.writeText(roomId);
                }}
                sx={{ fontFamily: 'body' }}>
                {roomId}
            </Button>
            <Flex sx={{ flexDirection: 'column' }}>
                {userList.map((uname) => (
                    <Text key={uname}>
                        {host.name === uname ? '👑' : ''}
                        {uname}
                    </Text>
                ))}
            </Flex>
            {isHost && (
                <Flex sx={{ flexDirection: 'row' }}>
                    <Button onClick={handleCreateGame}>Start Game</Button>

                    <Box>
                        <Label key="Add Percival and Morgana?">
                            <Checkbox
                                name="Add Percival and Morgana?"
                                onClick={handleSelect}
                            />
                            {'Add Percival and Morgana?'}
                        </Label>
                    </Box>
                </Flex>
            )}
            <Button onClick={handleLeaveRoom}>Leave Room</Button>
        </Box>
    );
};

export default connect((state: AppState) => ({ roomId: state.rooms.roomId }), {
    leaveRoom,
    joinGame,
})(Lobby);
