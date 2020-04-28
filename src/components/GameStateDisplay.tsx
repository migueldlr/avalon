import React from 'react';
import { Box, Text, Flex } from 'theme-ui';
import { GameStateType } from '../types';

interface GameStateDisplayProps {
    gameState: GameStateType;
}

const GameStateDisplay = (props: GameStateDisplayProps) => {
    const { gameState } = props;
    return (
        <Box>
            <Box>
                {gameState.quests.map((x, i) => {
                    const res = (gameState.questResults ?? [])[i];
                    const dispnum =
                        i === 3 && gameState.numPlayers >= 7 ? `${x}*` : x;
                    const disp = res == null ? dispnum : res ? '🛡️' : '💀';
                    return <Text key={i}>{disp}</Text>;
                })}
                <Flex id="orderDisplay" sx={{ flexDirection: 'column' }}>
                    {gameState.order.map((x, i) => {
                        return (
                            <Text
                                key={gameState.players[x].name}
                                sx={{
                                    fontWeight:
                                        gameState.currentTurn === i
                                            ? '700'
                                            : '400',
                                }}>
                                {gameState.players[x].name}
                            </Text>
                        );
                    })}
                </Flex>
            </Box>
            <Text>{JSON.stringify(gameState)}</Text>
        </Box>
    );
};

export default GameStateDisplay;
