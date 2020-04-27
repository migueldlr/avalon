import React from 'react';
import { Box, Text, Button, Checkbox, Label } from 'theme-ui';
import { GameStateType } from '../types';

interface VoteTeamProps {
    gameState: GameStateType;
}

const VoteTeam = (props: VoteTeamProps) => {
    const { gameState } = props;
    const proposer = gameState.players[gameState.currentTurn].name;
    const proposedUids: string[] = JSON.parse(gameState.proposed);
    const proposed = proposedUids.map(
        (u) => gameState.players.find((p) => p.uid === u)?.name,
    );
    return (
        <Box>
            <Text>
                {proposer} has proposed the following team:{' '}
                {JSON.stringify(proposed)}
            </Text>
            <Text>What say you?</Text>
            <Button>Yea!</Button>
            <Button>Nay!</Button>
        </Box>
    );
};

export default VoteTeam;
