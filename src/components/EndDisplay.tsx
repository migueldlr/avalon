import React from 'react';
import { Text, Flex, Grid } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType } from '../types';
import { listify } from '../utils';

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
                    {listify(
                        gameState.players
                            .filter((p) =>
                                gameState.assassinPick.includes(p.uid),
                            )
                            .map((p) => p.name),
                    )}
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

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(EndDisplay);
