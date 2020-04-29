import React from 'react';
import { Text } from 'theme-ui';
import { GameStateType } from '../types';

interface EndDisplayProps {
    gameState: GameStateType;
}

const EndDisplay = (props: EndDisplayProps) => {
    const { gameState } = props;
    return (
        <>
            {gameState.assassinPick && (
                <Text>{gameState.assassinPick} was assassinated</Text>
            )}
            {gameState.finalResult === 'bad' ? (
                <Text>Evil wins!</Text>
            ) : (
                <Text>Good wins!</Text>
            )}
        </>
    );
};

export default EndDisplay;
