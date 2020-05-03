import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType, Role } from '../types';
import { listify } from '../utils';
import { db, auth } from '../firebase';

interface AssignRoleProps {
    gameState: GameStateType;
    gameId: string;
}

const roleText: Record<Role, string> = {
    good: 'a loyal servant of Arthur 🏰',
    merlin: 'the wise wizard Merlin 🏰',
    percival: 'the brave Percival 🏰',
    bad: 'an evil minion of Mordred 💀',
    assassin: 'the vicious Assassin 💀',
    morgana: 'the sinister Morgana 💀',
    oberon: 'the unknown Oberon 💀',
    mordred: 'the evil ruler Mordred 💀',
};

// this is merlin's version so it includes oberon
const isBadForMerlin = (role: Role) => {
    return (
        role === 'assassin' ||
        role === 'bad' ||
        role === 'morgana' ||
        role === 'oberon'
    );
};

// this is the normal one for the other characters besides merlin to use
const isBad = (role: Role) => {
    return (
        role === 'assassin' ||
        role === 'bad' ||
        role === 'morgana' ||
        role === 'mordred'
    );
};

const AssignRole = (props: AssignRoleProps) => {
    const { gameState, gameId } = props;
    const [canClick, setCanClick] = useState(false);
    const [first] = useState(Math.random() < 0.5 ? 0 : 1);

    const uid = auth.currentUser?.uid;
    useEffect(() => {
        setTimeout(() => {
            setCanClick(true);
        }, 2000);
    }, []);

    const setReady = async () => {
        await db.ref(`gameIn/${gameId}/ready/${uid}`).set(true);
    };

    const handleClick = () => {
        setReady();
        setCanClick(false);
    };

    const thisPlayer = gameState.players.find((p) => p.uid === uid);

    const baddies = gameState.players
        .filter((p) => isBad(p.role) && p.uid !== thisPlayer?.uid)
        .map((p) => p.name);
    const merlinBaddies = gameState.players
        .filter((p) => isBadForMerlin(p.role) && p.uid !== thisPlayer?.uid)
        .map((p) => p.name);
    const merlinMorgana = gameState.players
        .filter((p) => p.role === 'morgana' || p.role === 'merlin')
        .map((p) => p.name);

    return (
        <Box>
            {thisPlayer && (
                <>
                    <Text>
                        {thisPlayer.name}, you are {roleText[thisPlayer.role]}
                    </Text>

                    {
                        // need to check the length in case the only other baddy is oberon
                        isBad(thisPlayer.role) && baddies.length > 0 && (
                            <Text>
                                The other minions of Mordred: {listify(baddies)}
                            </Text>
                        )
                    }
                    {thisPlayer.role === 'merlin' && (
                        <Text>
                            Your prophetic powers reveal to you the minions of
                            Mordred: {listify(merlinBaddies)}
                        </Text>
                    )}
                    {thisPlayer.role === 'percival' && (
                        <Text>
                            Your holy powers reveal Merlin to be:{' '}
                            {merlinMorgana[0 + first]} or{' '}
                            {merlinMorgana[1 - first]}
                        </Text>
                    )}
                </>
            )}
            {canClick && (
                <Button
                    disabled={!canClick}
                    variant={!canClick ? 'disabled' : 'primary'}
                    onClick={handleClick}>
                    Ready!
                </Button>
            )}
        </Box>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(AssignRole);
