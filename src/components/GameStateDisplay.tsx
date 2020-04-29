import React, { useState } from 'react';
import { Box, Text, Flex } from 'theme-ui';
import { GameStateType } from '../types';

interface GameStateDisplayProps {
    gameState: GameStateType;
}

const GameStateDisplay = (props: GameStateDisplayProps) => {
    const { gameState } = props;

    const [hover, setHover] = useState<number | null>(null);
    return (
        <Box>
            <Flex>
                <Flex sx={{ flexDirection: 'row', alignItems: 'center' }}>
                    {gameState.quests.map((x, i) => {
                        const res = (gameState.questResults ?? [])[i];
                        const dispnum =
                            i === 3 && gameState.numPlayers >= 7 ? `${x}*` : x;
                        const disp =
                            res == null || hover === i
                                ? dispnum
                                : res
                                ? '🛡️'
                                : '💀';
                        return (
                            <Box
                                key={i}
                                sx={{
                                    width: 6,
                                    height: 6,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    border: 'black solid 1px',
                                    fontWeight:
                                        i === gameState.currentQuest
                                            ? '700'
                                            : '300',
                                    marginRight: i === 4 ? 0 : 3,
                                }}
                                onMouseEnter={() => setHover(i)}
                                onMouseLeave={() => setHover(null)}>
                                <Text
                                    sx={{
                                        width: '100%',
                                        textAlign: 'center',
                                        fontSize: 4,
                                    }}>
                                    {disp}
                                </Text>
                            </Box>
                        );
                    })}
                </Flex>
                <Flex id="orderDisplay" ml={2} sx={{ flexDirection: 'column' }}>
                    {gameState.order.map((x, i) => {
                        return (
                            <Text
                                key={gameState.players[x].name}
                                sx={{
                                    fontWeight:
                                        gameState.currentTurn === i &&
                                        gameState.phase !== 'assassin' &&
                                        gameState.phase !== 'end'
                                            ? '700'
                                            : '400',
                                }}>
                                {gameState.players[x].name}
                                {gameState.phase === 'end' &&
                                    ` - ${gameState.players[x].role}`}
                            </Text>
                        );
                    })}
                </Flex>
            </Flex>
            {/* <Text>{JSON.stringify(gameState)}</Text> */}
        </Box>
    );
};

export default GameStateDisplay;
