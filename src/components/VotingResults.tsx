import React from 'react';
import { GameStateType, PlayerType } from '../types';
import { Box, Flex, Text, Grid } from 'theme-ui';

interface VotingResultsProps {
    gameState: GameStateType;
}

const MissionVote = (props: {
    votes: { [uid: string]: boolean }[];
    questers: string[][];
    players: PlayerType[];
    order: number[];
    missionNum: number;
    leaderStart: number;
    phase: string;
    currentTurn: number;
}) => {
    const {
        votes,
        questers,
        players,
        order,
        missionNum,
        leaderStart,
        phase,
        currentTurn,
    } = props;
    const numPlayers = players.length;
    let leader = leaderStart;
    return (
        <Flex>
            {missionNum === 0 && (
                <Flex sx={{ flexDirection: 'column' }}>
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
                </Flex>
            )}
            <Grid
                columns={votes.length + 1}
                gap={0}
                sx={{
                    gridTemplateColumns: 'none',
                    minWidth: 7,
                }}>
                <Box
                    sx={{
                        gridColumnStart: 1,
                        gridColumnEnd: votes.length + 1,
                        textAlign: 'center',
                    }}>
                    Mission {missionNum + 1}
                </Box>

                {votes.map((v, j) => {
                    const ret = (
                        <Box
                            key={j}
                            id={`col${leader}`}
                            sx={{
                                // borderLeft:
                                //     j === 0 && missionNum !== 0
                                //         ? 'black solid 1px'
                                //         : '',
                                // borderRight:
                                //     j === votes.length - 1 &&
                                //     missionNum !== currentTurn
                                //         ? 'black solid 1px'
                                //         : '',
                                marginLeft: j === 0 && missionNum !== 0 ? 1 : 0,
                            }}>
                            {order.map((i, l) => {
                                const u = players[i].uid;
                                return (
                                    // eslint-disable-next-line jsx-a11y/accessible-emoji
                                    <Text
                                        key={i}
                                        sx={{
                                            height: 4,
                                            bg: v[u] ? 'yea' : 'nay',
                                            textAlign: 'center',
                                            border:
                                                leader % numPlayers === l
                                                    ? 'black solid 2px'
                                                    : 'transparent solid 2px',
                                            pt:
                                                leader % numPlayers === l
                                                    ? '-2px'
                                                    : '',
                                            color: questers[j].includes(u)
                                                ? 'inherit'
                                                : 'rgba(0,0,0,0)',
                                        }}>
                                        🏹
                                    </Text>
                                );
                            })}
                        </Box>
                    );
                    leader++;
                    return ret;
                })}
            </Grid>
        </Flex>
    );
};

const VotingResults = (props: VotingResultsProps) => {
    const { gameState } = props;
    let leader = 0;
    return (
        <Flex>
            {gameState.teamVote.map((votes, i) => {
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
                        phase={gameState.phase}
                        currentTurn={gameState.currentTurn}
                    />
                );
            })}
        </Flex>
    );
};

export default VotingResults;
