import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text, Button, Flex, Checkbox, Label, Grid } from 'theme-ui';

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
    const [canStart, setCanStart] = useState(true);
    const [percival, setPercival] = useState<boolean>(false);
    const [morgana, setMorgana] = useState<boolean>(false);
    const [oberon, setOberon] = useState<boolean>(false);
    const [mordred, setMordred] = useState<boolean>(false);
    const [lady, setLady] = useState<boolean>(false);
    const [lovers, setLovers] = useState<boolean>(false);
    const [userList, setUserList] = useState<Array<string>>([]);
    const [warningMessage, setWarningMessage] = useState('');
    useEffect(() => {
        const numPlayers = userList.length;
        const good = Number(percival) + Number(lovers) * 2;
        const evil = Number(morgana) + Number(mordred) + Number(oberon);
        if (numPlayers < 5) {
            setWarningMessage('Need at least five players to start the game');
            setCanStart(false);
            return;
        }
        if (numPlayers > 10) {
            setWarningMessage('Cannot have more than ten players in a game');
            setCanStart(false);
            return;
        }
        if ((numPlayers < 7 && evil > 1) || (numPlayers < 10 && evil > 2)) {
            setWarningMessage('Too many evil roles');
            setCanStart(false);
            return;
        }
        if (numPlayers < 6 && good > 1) {
            setWarningMessage('Too many good roles');
            setCanStart(false);
            return;
        }
        if (!percival && morgana) {
            setWarningMessage(
                'Morgana will have no effect if Percival is not in the game',
            );
            return;
        }
        if (lady && numPlayers < 7) {
            setWarningMessage(
                'Lady of the Lake is recommended for games with 7 or more players',
            );
            return;
        }
        setWarningMessage('');
        setCanStart(true);
    }, [percival, morgana, oberon, mordred, lady, lovers, userList.length]);

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
            if (opts.percival != null) setPercival(opts.percival);
            if (opts.morgana != null) setMorgana(opts.morgana);
            if (opts.oberon != null) setOberon(opts.oberon);
            if (opts.mordred != null) setMordred(opts.mordred);
            if (opts.lady != null) setLady(opts.lady);
            if (opts.lovers != null) setLovers(opts.lovers);
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
        await dbCreateGame(roomId.toLowerCase());
    };

    const toggle = (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>,
        opt: string,
    ) => {
        setWarningMessage('');
        const target = e.target as HTMLInputElement;
        db.ref(`rooms/${roomId}/opts/${opt}`)
            .set(target.checked)
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
    };

    const isHost = host.uid === uid;
    return (
        <Box>
            <Grid sx={{ gridTemplateColumns: ['200px', '150px 200px'] }}>
                <Box sx={{ pr: 2 }}>
                    <Button
                        onClick={() => {
                            navigator.clipboard.writeText(roomId);
                        }}
                        sx={{ fontFamily: 'body', textTransform: 'uppercase' }}>
                        {roomId}
                    </Button>
                    <Flex sx={{ flexDirection: 'column', my: 2 }}>
                        {userList.map((uname) => (
                            <Text key={uname}>
                                {host.name === uname ? '👑' : ''}
                                {uname}
                            </Text>
                        ))}
                    </Flex>
                    {isHost && (
                        <Flex sx={{ flexDirection: 'row' }}>
                            <Button
                                onClick={handleCreateGame}
                                disabled={!canStart}
                                variant={canStart ? 'primary' : 'disabled'}>
                                Start Game
                            </Button>
                        </Flex>
                    )}
                    <Button onClick={handleLeaveRoom}>Leave Room</Button>
                </Box>
                <Box sx={{ height: '150px' }}>
                    <Label>
                        <Checkbox
                            checked={true}
                            variant="checkboxdisabled"
                            disabled
                        />
                        Merlin 🏰
                    </Label>
                    <Label>
                        <Checkbox
                            checked={true}
                            variant="checkboxdisabled"
                            disabled
                        />
                        Assassin 💀
                    </Label>
                    <Label>
                        <Checkbox
                            onClick={(e) => {
                                if (isHost) toggle(e, 'percival');
                            }}
                            onChange={() => {}}
                            variant={isHost ? undefined : 'checkboxdisabled'}
                            disabled={isHost ? false : true}
                            checked={percival}
                        />
                        Percival 🏰
                    </Label>
                    <Label>
                        <Checkbox
                            onClick={(e) => {
                                if (isHost) toggle(e, 'morgana');
                            }}
                            onChange={() => {}}
                            variant={isHost ? undefined : 'checkboxdisabled'}
                            disabled={isHost ? false : true}
                            checked={morgana}
                        />
                        Morgana 💀
                    </Label>
                    <Label>
                        <Checkbox
                            onClick={(e) => {
                                if (isHost) toggle(e, 'oberon');
                            }}
                            onChange={() => {}}
                            variant={isHost ? undefined : 'checkboxdisabled'}
                            disabled={isHost ? false : true}
                            checked={oberon}
                        />
                        Oberon 💀
                    </Label>
                    <Label>
                        <Checkbox
                            onClick={(e) => {
                                if (isHost) toggle(e, 'mordred');
                            }}
                            onChange={() => {}}
                            variant={isHost ? undefined : 'checkboxdisabled'}
                            disabled={isHost ? false : true}
                            checked={mordred}
                        />
                        Mordred 💀
                    </Label>
                    <Label>
                        <Checkbox
                            onClick={(e) => {
                                if (isHost) toggle(e, 'lovers');
                            }}
                            onChange={() => {}}
                            variant={isHost ? undefined : 'checkboxdisabled'}
                            disabled={isHost ? false : true}
                            checked={lovers}
                            mr={3}
                        />
                        Tristan + Iseult 🏰
                    </Label>
                    <Label>
                        <Checkbox
                            onClick={(e) => {
                                if (isHost) toggle(e, 'lady');
                            }}
                            onChange={() => {}}
                            variant={isHost ? undefined : 'checkboxdisabled'}
                            disabled={isHost ? false : true}
                            checked={lady}
                            mr={3}
                        />
                        Lady of the Lake 🧝‍♀️
                    </Label>
                    <Text variant="disclaimer" sx={{ fontSize: '14px', mt: 2 }}>
                        {warningMessage}
                    </Text>
                </Box>
            </Grid>
        </Box>
    );
};

export default connect((state: AppState) => ({ roomId: state.rooms.roomId }), {
    leaveRoom,
    joinGame,
})(Lobby);
