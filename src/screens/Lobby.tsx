import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text, Button, Flex, Checkbox, Label } from 'theme-ui';

import { leaveRoom } from '../store/room/actions';
import { joinGame } from '../store/game/actions';
import { dbLeaveRoom, dbGetRoomRef } from '../firebase/rooms';
import { AppState } from '../store';
import { dbCreateGame, dbGetGameRef } from '../firebase/game';
import { auth, db } from '../firebase/index';
import { RoomPlayer } from '../types';

interface LobbyProps {
    roomId: string | null;
    leaveRoom: typeof leaveRoom;
    joinGame: typeof joinGame;
}

const Lobby = (props: LobbyProps) => {
    const { roomId, joinGame } = props;
    const uid = auth.currentUser?.uid;
    const [host, setHost] = useState<{ name: string; uid: string }>({
        name: '',
        uid: '',
    });
    const [percivalMorgana, setPercivalMorgana] = useState<boolean>(false);
    const [userList, setUserList] = useState<Array<string>>([]);

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
        roomRef.child('players').on('value', (snap) => {
            const playerState: RoomPlayer = snap.val();

            // firestore will update before redux sometimes so we don't want to try to read from playerState yet
            if (playerState == null) return;

            const players: [string, string][] = Object.entries(playerState);

            setUserList(players.map((u) => u[1]));
        });

        roomRef.child('host').on('value', (snap) => {
            const hostUid = snap.val();
            roomRef
                .child('players')
                .child(hostUid)
                .once('value', (snap2) => {
                    const name = snap2.val();
                    setHost({ uid: hostUid, name });
                });
        });
        roomRef.child('opts').on('value', (snap) => {
            const opts = snap.val();
            if (opts == null) return;
            if (opts.percivalMorgana != null)
                setPercivalMorgana(opts.percivalMorgana);
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

        const gameId = await dbCreateGame(roomId);
        if (gameId == null) return;
        props.joinGame(gameId);
    };

    const togglePM = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const target = e.target as HTMLInputElement;
        db.ref(`rooms/${roomId}/opts/percivalMorgana`)
            .set(target.checked)
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
    };
    const isHost = host.uid === uid;
    return (
        <Box>
            <Flex>
                <Box sx={{ pr: 2 }}>
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
                            <Button onClick={handleCreateGame}>
                                Start Game
                            </Button>
                        </Flex>
                    )}
                    <Button onClick={handleLeaveRoom}>Leave Room</Button>
                </Box>
                <Box>
                    <Label>
                        <Checkbox
                            onClick={(e) => {
                                if (isHost) togglePM(e);
                            }}
                            onChange={() => {}}
                            checked={percivalMorgana}
                        />
                        Percival and Morgana
                    </Label>
                </Box>
            </Flex>
        </Box>
    );
};

export default connect((state: AppState) => ({ roomId: state.rooms.roomId }), {
    leaveRoom,
    joinGame,
})(Lobby);
