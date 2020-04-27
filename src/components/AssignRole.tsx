import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { GameStateType, Role } from '../types';

interface AssignRoleProps {
    gameState: GameStateType;
    onClick: () => void;
    uid: string;
}

const roleText: Record<Role, JSX.Element> = {
    good: <Text>a loyal servant of Arthur</Text>,
    merlin: <Text>the wise wizard Merlin</Text>,
    bad: <Text>an evil minion of Mordred</Text>,
    assassin: <Text>the evil Assassin</Text>,
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

    const thisPlayer = gameState.players.find((p) => p.uid === uid);

    const baddies = gameState.players
        .filter((p) => isBad(p.role) && p.uid !== thisPlayer?.uid)
        .map((p) => p.name);

    return (
        <Box>
            {thisPlayer && (
                <>
                    <Text>{JSON.stringify(thisPlayer)}</Text>
                    <Text>
                        {thisPlayer.name}, you are {roleText[thisPlayer.role]}
                    </Text>
                    {isBad(thisPlayer.role) && (
                        <Text>
                            The other minions of Mordred are{' '}
                            {JSON.stringify(baddies)}
                        </Text>
                    )}
                    {thisPlayer.role === 'merlin' && (
                        <Text>
                            The minions of Mordred are {JSON.stringify(baddies)}
                        </Text>
                    )}
                </>
            )}
            <Button
                disabled={!canClick}
                variant={!canClick ? 'disabled' : 'primary'}
                onClick={onClick}>
                Ready!
            </Button>
        </Box>
    );
};

export default AssignRole;
