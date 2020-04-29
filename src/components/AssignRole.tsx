import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { GameStateType, Role } from '../types';
import { listify } from '../utils';

interface AssignRoleProps {
    gameState: GameStateType;
    onClick: () => void;
    uid: string;
}

const roleText: Record<Role, string> = {
    good: 'a loyal servant of Arthur 🏰',
    merlin: 'the wise wizard Merlin 🏰',
    bad: 'an evil minion of Mordred 💀',
    assassin: 'the evil Assassin 💀',
};

const isBad = (role: Role) => {
    return role === 'assassin' || role === 'bad';
};

const AssignRole = (props: AssignRoleProps) => {
    const { gameState, onClick, uid } = props;
    const [canClick, setCanClick] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setCanClick(true);
        }, 2000);
    }, []);

    const handleClick = () => {
        onClick();
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
