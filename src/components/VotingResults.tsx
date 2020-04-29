import React from 'react';
import { GameStateType, PlayerType } from '../types';
import { Box, Flex, Text, Grid } from 'theme-ui';

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
        <Flex>
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
                    Quest {missionNum + 1}{' '}
                    {questResults[missionNum] ?? '' ? '🏰' : '💀'}
                </Box>

                {votes.map((v, j) => {
                    const ret = (
                        <Box
                            key={j}
                            id={`col${leader}`}
                            sx={{
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
                                        }}>
                                        {questers[j].includes(u) ? '🏹' : ''}
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
        <Flex sx={{ justifyContent: 'center' }}>
            <PlayerDisplay
                order={gameState.order}
                currentTurn={gameState.currentTurn}
                phase={gameState.phase}
                players={gameState.players}
            />
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
    );
};

export default VotingResults;
