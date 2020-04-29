import React from 'react';
import { Box, Text } from 'theme-ui';
import { GameStateType } from '../types';

interface EndDisplayProps {
    gameState: GameStateType;
}

const EndDisplay = (props: EndDisplayProps) => {
    const { gameState } = props;
    return (
        <Box>
            {gameState.assassinPick && (
                <Text>{gameState.assassinPick} was assassinated</Text>
            )}
            {gameState.finalResult === 'bad' ? (
                <Text>Evil wins!</Text>
            ) : (
                <Text>Good wins!</Text>
            )}
        </Box>
    );
};

export default EndDisplay;
