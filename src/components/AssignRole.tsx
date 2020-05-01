import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from 'theme-ui';
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
    percival: 'a loyal servant of Arthur that can identify Merlin 🏰',
    bad: 'an evil minion of Mordred 💀',
    assassin: 'the evil Assassin 💀',
    morgana: 'an evil minion of Mordred that can confuse Percival 💀',
};

const isBad = (role: Role) => {
    return role === 'assassin' || role === 'bad' || role === 'morgana';
};

const AssignRole = (props: AssignRoleProps) => {
    const { gameState, gameId } = props;
    const [canClick, setCanClick] = useState(false);

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

    return (
        <Box>
            {thisPlayer && (
                <>
                    <Text>
                        {thisPlayer.name}, you are {roleText[thisPlayer.role]}
                    </Text>
                    {isBad(thisPlayer.role) && (
                        <Text>
                            The other minions of Mordred: {listify(baddies)}
                        </Text>
                    )}
                    {thisPlayer.role === 'merlin' && (
                        <Text>The minions of Mordred: {listify(baddies)}</Text>
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

export default AssignRole;
