import React from 'react';
import { Text, Flex, Grid } from 'theme-ui';
import { GameStateType } from '../types';

interface EndDisplayProps {
    gameState: GameStateType;
}

const EndDisplay = (props: EndDisplayProps) => {
    const { gameState } = props;
    return (
        <>
            {gameState.assassinPick && (
                <Text>
                    The assassin killed{' '}
                    {
                        gameState.players.find(
                            (p) => p.uid === gameState.assassinPick,
                        )?.name
                    }
                </Text>
            )}
            {gameState.finalResult === 'bad' ? (
                <Text>Evil wins!</Text>
            ) : (
                <Text>Good wins!</Text>
            )}
            <Grid columns={2}>
                <Flex sx={{ flexDirection: 'column' }}>
                    {gameState.order.map((i, idx) => {
                        return <Flex key={i}>{gameState.players[i].name}</Flex>;
                    })}
                </Flex>
                <Flex sx={{ flexDirection: 'column' }}>
                    {gameState.order.map((i, idx) => {
                        return <Flex key={i}>{gameState.players[i].role}</Flex>;
                    })}
                </Flex>
            </Grid>
        </>
    );
};

export default EndDisplay;
