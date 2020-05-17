import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType, Role } from '../types';
import { listify, isBad, isBadForMerlin } from '../utils';
import { db, auth } from '../firebase';

interface AssignRoleProps {
    gameState: GameStateType;
    gameId: string;
}

const roleText: Record<Role, string> = {
    good: 'a knight of Arthur 🏰',
    merlin: 'the wise wizard Merlin 🏰',
    percival: 'the brave Percival 🏰',
    bad: 'an evil minion of Mordred 💀',
    assassin: 'the vicious Assassin 💀',
    morgana: 'the sinister Morgana 💀',
    oberon: 'the unknown Oberon 💀',
    mordred: 'the evil ruler Mordred 💀',
    tristan: 'the lovestruck Tristan 🏰',
    iseult: 'the lovestruck Iseult 🏰',
};

const AssignRole = (props: AssignRoleProps) => {
    const { gameState, gameId } = props;
    const [canClick, setCanClick] = useState(false);
    const [first] = useState(Math.random() < 0.5 ? 0 : 1);
    const [waitFor, setWaitFor] = useState<string[]>([]);
    const [ready, setLocalReady] = useState(false);

    const uid = auth.currentUser?.uid;
    useEffect(() => {
        setTimeout(() => {
            setCanClick(true);
        }, 2000);
        db.ref(`gameIn/${gameId}/ready`).on('value', (snap) => {
            const snapVal: Record<string, boolean> = snap.val();

            const voted = Object.keys(snapVal ?? {});

            const waitForNames = gameState.players
                .filter((p) => !voted.includes(p.uid))
                .map((p) => p.name);

            setWaitFor(waitForNames);
        });
    }, [gameId, gameState.players]);

    const setReady = async () => {
        await db.ref(`gameIn/${gameId}/ready/${uid}`).set(true);
    };

    const handleClick = () => {
        setReady();
        setCanClick(false);
        setLocalReady(true);
    };

    const thisPlayer = gameState.players.find((p) => p.uid === uid);

    const baddies = gameState.players
        .filter(
            (p) =>
                isBad(p.role) &&
                p.role !== 'oberon' &&
                p.uid !== thisPlayer?.uid,
        )
        .map((p) => p.name);
    const merlinBaddies = gameState.players
        .filter((p) => isBadForMerlin(p.role) && p.uid !== thisPlayer?.uid)
        .map((p) => p.name);
    const merlinMorgana = gameState.players
        .filter((p) => p.role === 'morgana' || p.role === 'merlin')
        .map((p) => p.name);

    const WaitFor = (
        <>
            {waitFor.length > 0 && (
                <Text variant="disclaimer">
                    Waiting on {listify(waitFor)}
                    ...
                </Text>
            )}
        </>
    );

    return (
        <Box>
            {thisPlayer && (
                <>
                    <Text>
                        {thisPlayer.name}, you are {roleText[thisPlayer.role]}
                    </Text>

                    {
                        // need to check the length in case the only other baddy is oberon
                        isBad(thisPlayer.role) &&
                            thisPlayer.role !== 'oberon' &&
                            baddies.length > 0 && (
                                <Text>
                                    The other minions of Mordred:{' '}
                                    {listify(baddies)}
                                </Text>
                            )
                    }
                    {thisPlayer.role === 'merlin' && (
                        <Text>
                            Your prophetic powers reveal to you the minions of
                            Mordred: {listify(merlinBaddies)}
                        </Text>
                    )}
                    {thisPlayer.role === 'percival' &&
                        merlinMorgana.length > 1 && (
                            <Text>
                                Your holy powers reveal Merlin to be:{' '}
                                {merlinMorgana[0 + first]} or{' '}
                                {merlinMorgana[1 - first]}
                            </Text>
                        )}
                    {thisPlayer.role === 'percival' &&
                        merlinMorgana.length === 1 && (
                            <Text>
                                Your holy powers reveal Merlin to be:{' '}
                                {merlinMorgana[0]}
                            </Text>
                        )}
                    {thisPlayer.role === 'tristan' && (
                        <Text>
                            Your undying love reveals Iseult to be:{' '}
                            {
                                gameState.players.find(
                                    (p) => p.role === 'iseult',
                                )?.name
                            }
                        </Text>
                    )}
                    {thisPlayer.role === 'iseult' && (
                        <Text>
                            Your undying love reveals Tristan to be:{' '}
                            {
                                gameState.players.find(
                                    (p) => p.role === 'tristan',
                                )?.name
                            }
                        </Text>
                    )}
                </>
            )}
            {(canClick || ready) && (
                <Button
                    disabled={ready}
                    variant={ready ? 'disabled' : 'primary'}
                    onClick={handleClick}>
                    Ready!
                </Button>
            )}
            {(canClick || ready) && WaitFor}
        </Box>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(AssignRole);
