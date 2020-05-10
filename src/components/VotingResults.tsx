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
    novotes: boolean;
}) => {
    const { order, currentTurn, phase, players, novotes } = props;
    return (
        <Box
            sx={{
                flexDirection: 'column',
                display: [novotes ? 'flex' : 'none', 'flex'],
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

const MissionVote = (props: {
    votes: { [uid: string]: boolean }[];
    questers: string[][];
    players: PlayerType[];
    order: number[];
    missionNum: number;
    leaderStart: number;
    questResults: boolean[];
    currentTurn: number;
    phase: string;
}) => {
    const {
        votes,
        questers,
        players,
        order,
        missionNum,
        leaderStart,
        questResults,
        currentTurn,
        phase,
    } = props;
    const numPlayers = players.length;
    let leader = leaderStart;
    return (
        <Flex>
            <Grid
                columns={votes.length + 1}
                gap={0}
                sx={{
                    gridTemplateColumns: ['auto auto', 'none'],
                    minWidth: 'max-content',
                }}>
                <Box
                    sx={{ flexDirection: 'column', display: ['flex', 'none'] }}>
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
        <Grid
            // columns={[1, gameState.currentTurn + 2]}
            gap={2}
            sx={{
                gridTemplateColumns: [
                    `1`,
                    `repeat(${
                        gameState.currentQuest +
                        2 +
                        (gameState.phase === 'voteQuest' ? 1 : 0)
                    }, auto)`,
                ],
            }}>
            <PlayerDisplay
                order={gameState.order}
                currentTurn={gameState.currentTurn}
                phase={gameState.phase}
                players={gameState.players}
                novotes={!gameState.teamVote}
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
                            currentTurn={gameState.currentTurn}
                            phase={gameState.phase}
                        />
                    );
                })}
        </Grid>
    );
};

export default VotingResults;
