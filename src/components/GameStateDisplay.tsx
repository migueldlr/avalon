import React, { useState } from 'react';
import { Box, Text, Flex } from 'theme-ui';
import { connect } from 'react-redux';
import { AppState } from '../store/index';
import { GameStateType } from '../types';
import VotingResults from './VotingResults';
import RoleViewer from './RoleViewer';

interface GameStateDisplayProps {
    gameState: GameStateType;
}

const QuestResults = (props: { gameState: GameStateType }) => {
    const { gameState } = props;

    const [hover, setHover] = useState<number | null>(null);
    return (
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
                    res == null || hover === i ? dispnum : res ? '🏰' : '💀';
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
                                i === gameState.currentQuest ? '700' : '300',
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
    );
};

const GameStateDisplay = (props: GameStateDisplayProps) => {
    const { gameState } = props;
    return (
        <Flex
            id="GameStateDisplay"
            sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <VotingResults gameState={gameState} />
            <RoleViewer />
            <QuestResults gameState={gameState} />
        </Flex>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(GameStateDisplay);
