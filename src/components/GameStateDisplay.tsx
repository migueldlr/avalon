import React, { useState } from 'react';
import { Box, Text, Flex } from 'theme-ui';
import { GameStateType } from '../types';
import VotingResults from './VotingResults';

interface GameStateDisplayProps {
    gameState: GameStateType;
}

const GameStateDisplay = (props: GameStateDisplayProps) => {
    const { gameState } = props;

    const [hover, setHover] = useState<number | null>(null);
    return (
        <Flex
            id="GameStateDisplay"
            sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <VotingResults gameState={gameState} />
            <Flex
                sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 2,
                }}>
                {gameState.quests.map((x, i) => {
                    const res = (gameState.questResults ?? [])[i];
                    const dispnum =
                        i === 3 && gameState.numPlayers >= 7 ? `${x}*` : x;
                    const disp =
                        res == null || hover === i
                            ? dispnum
                            : res
                            ? '🏰'
                            : '💀';
                    return (
                        <Box
                            key={i}
                            sx={{
                                width: [5, 6],
                                height: [5, 6],
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                border: 'black solid 1px',
                                borderColor: 'text',
                                fontWeight:
                                    i === gameState.currentQuest
                                        ? '700'
                                        : '300',
                                mr: i === 4 ? 0 : [1, 3],
                            }}
                            onMouseEnter={() => setHover(i)}
                            onMouseLeave={() => setHover(null)}>
                            <Text
                                sx={{
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: [4, 5],
                                    fontFamily: 'heading',
                                }}>
                                {disp}
                            </Text>
                        </Box>
                    );
                })}
            </Flex>
            {/* <Flex id="orderDisplay" ml={2} sx={{ flexDirection: 'column' }}>
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
                </Flex> */}

            {/* <Text>{JSON.stringify(gameState)}</Text> */}
        </Flex>
    );
};

export default GameStateDisplay;
