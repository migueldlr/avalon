/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { GameStateType, PlayerType } from '../types';
import { Box, Flex, Text, Grid } from 'theme-ui';

import PlayersDisplay from './PlayersDisplay';

interface VotingResultsProps {
    gameState: GameStateType;
}

const PlayerDisplay = (props: {
    order: number[];
    currentTurn: number;
    phase: string;
    players: PlayerType[];
}) => {
    const { order, currentTurn, phase, players } = props;
    return (
        <Box
            sx={{
                flexDirection: 'column',
                display: 'flex',
                flexShrink: 0,
            }}>
            <Flex>&nbsp;</Flex>
            {order.map((i, idx) => {
                return (
                    <Flex
                        key={i}
                        sx={{
                            height: 4,
                            display: '',
                            alignItems: 'center',
                            fontWeight:
                                currentTurn === idx &&
                                phase !== 'assassin' &&
                                phase !== 'end'
                                    ? '700'
                                    : '400',
                        }}>
                        {players[i].name}
                    </Flex>
                );
            })}
        </Box>
    );
};

const MissionLegend = () => {
    return (
        <Grid
            gap={2}
            sx={{
                mt: 2,
                gridTemplateColumns: 'repeat(8, auto)',
                alignItems: 'center',
            }}>
            <Box
                sx={{
                    height: 3,
                    width: 4,
                    border: 'black solid 2px',
                    borderColor: 'text',
                }}
            />
            <Text variant="legend">quest leader</Text>
            <Box sx={{ bg: 'yea', height: 3, width: 4 }} />
            <Text variant="legend">yea</Text>
            <Box sx={{ bg: 'nay', height: 3, width: 4 }} />
            <Text variant="legend">nay</Text>
            <Text variant="legend">🏹</Text>
            <Text variant="legend">on quest</Text>
        </Grid>
    );
};

const LadyDisplay = ({ lady }: { lady: string[] }) => {
    return (
        <Flex mt={2} sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text variant="legend">The Lady of the Lake 🧝‍♀️</Text>
            <Text variant="legend">{lady.join('→')}</Text>
        </Flex>
    );
};

const MissionVote = (props: {
    votes: { [uid: string]: boolean }[];
    questers: string[][];
    players: PlayerType[];
    order: number[];
    missionNum: number;
    leaderStart: number;
    questResults: boolean[];
}) => {
    const {
        votes,
        questers,
        players,
        order,
        missionNum,
        leaderStart,
        questResults,
    } = props;
    const numPlayers = players.length;
    let leader = leaderStart;
    return (
        <Flex sx={{ flexShrink: 0, ml: 2 }}>
            <Grid
                columns={votes.length + 1}
                gap={0}
                sx={{
                    gridTemplateColumns: ['auto auto', 'none'],
                    minWidth: 'max-content',
                }}>
                <Grid gap={0}>
                    <Box
                        sx={{
                            gridColumnStart: 1,
                            gridColumnEnd: votes.length + 1,
                            textAlign: 'center',
                        }}>
                        Quest {missionNum + 1}{' '}
                        {questResults[missionNum] == null
                            ? ''
                            : questResults[missionNum]
                            ? '🏰'
                            : '💀'}
                    </Box>

                    {votes.map((v, j) => {
                        const ret = (
                            <Box key={j} id={`col${leader}`}>
                                {order.map((i, l) => {
                                    const u = players[i].uid;
                                    const display = questers[j].includes(u)
                                        ? '🏹'
                                        : '';
                                    return (
                                        <Text
                                            key={i}
                                            sx={{
                                                height: 4,
                                                minWidth: 4,
                                                bg: v[u] ? 'yea' : 'nay',
                                                textAlign: 'center',
                                                border:
                                                    leader % numPlayers === l
                                                        ? 'black solid 2px'
                                                        : 'transparent solid 2px',
                                                borderColor:
                                                    leader % numPlayers === l
                                                        ? 'text'
                                                        : '',
                                                fontSize: [0, 1],
                                            }}>
                                            {display}
                                        </Text>
                                    );
                                })}
                            </Box>
                        );
                        leader++;
                        return ret;
                    })}
                </Grid>
            </Grid>
        </Flex>
    );
};

const VotingResults = (props: VotingResultsProps) => {
    const { gameState } = props;
    let leader = 0;
    return (
        <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <Flex>
                <PlayerDisplay
                    order={gameState.order}
                    currentTurn={gameState.currentTurn}
                    phase={gameState.phase}
                    players={gameState.players}
                />{' '}
                <Flex sx={{ overflow: 'auto' }}>
                    {gameState.teamVote &&
                        gameState.teamVote.map((votes, i) => {
                            leader += votes.length;
                            return (
                                <MissionVote
                                    key={i}
                                    votes={votes}
                                    questers={gameState.proposed[i]}
                                    players={gameState.players}
                                    order={gameState.order}
                                    missionNum={i}
                                    leaderStart={leader - votes.length}
                                    questResults={gameState.questResults ?? []}
                                />
                            );
                        })}
                </Flex>
            </Flex>
            <Box>
                <MissionLegend />
                <PlayersDisplay gameState={gameState} />
                {gameState.lady && (
                    <LadyDisplay
                        lady={gameState.lady.map(
                            (u) =>
                                gameState.players.find((p) => p.uid === u)
                                    ?.name ?? '',
                        )}
                    />
                )}
            </Box>
        </Flex>
    );
};

export default VotingResults;
