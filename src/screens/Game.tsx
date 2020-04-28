import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text } from 'theme-ui';
import { AppState } from '../store/index';

import { dbGetGameRef } from '../firebase/game';
import { db, auth } from '../firebase/index';
import { GameStateType } from '../types';
import AssignRole from '../components/AssignRole';
import PickTeam from '../components/PickTeam';
import VoteTeam from '../components/VoteTeam';
import VoteQuest from '../components/VoteQuest';
import DecisionDisplay from '../components/DecisionDisplay';
import AssassinPick from '../components/AssassinPick';

interface GameProps {
    gameId: string;
}

const Game = (props: GameProps) => {
    const { gameId } = props;
    const uid = auth.currentUser?.uid;
    const [gameState, setGameState] = useState<GameStateType>({
        phase: 'start',
        numPlayers: 0,
        order: [],
        currentTurn: -1,
        players: [],
        proposed: [],
        currentQuest: -1,
        currentTeamVote: -1,
        quests: [],
        questResults: [],
        questVote: [],
        finalResult: 'good',
    });

    useEffect(() => {
        const gameRef = dbGetGameRef(gameId);
        gameRef.on('value', (snap) => {
            const snapVal = snap.val();

            if (snapVal == null) return;
            setGameState(snapVal);
        });
    }, [gameId]);

    const setReady = async () => {
        await db.ref(`gameIn/${gameId}/ready/${uid}`).set(true);
    };

    const setProposedTeam = async (players: string[]) => {
        await db
            .ref(
                `gameIn/${gameId}/proposed/${gameState.currentQuest}/${gameState.currentTeamVote}`,
            )
            .set(players);
    };

    console.log(gameState);

    return (
        <Box>
            <Text>Game</Text>
            {/* <Text>{gameId ?? ''}</Text>
            <Text>{JSON.stringify(gameState)}</Text> */}
            {gameState.phase === 'assign' && (
                <AssignRole
                    uid={uid ?? ''}
                    gameState={gameState}
                    onClick={setReady}
                />
            )}
            {gameState.phase === 'turn' &&
                gameState.players[gameState.currentTurn].uid === uid && (
                    <PickTeam
                        gameState={gameState}
                        submitTeam={setProposedTeam}
                    />
                )}
            {gameState.phase === 'voteTeam' && (
                <VoteTeam gameState={gameState} gameId={gameId} />
            )}
            {gameState.phase === 'voteQuest' &&
                gameState.proposed[gameState.currentQuest][
                    gameState.currentTeamVote
                ].some((u) => u === uid) && (
                    <VoteQuest gameState={gameState} gameId={gameId} />
                )}
            {gameState.phase === 'decision' && (
                <DecisionDisplay gameState={gameState} gameId={gameId} />
            )}
            {gameState.phase === 'assassin' && (
                <AssassinPick gameState={gameState} gameId={gameId} />
            )}
            {gameState.phase === 'end' &&
                (gameState.finalResult === 'bad' ? (
                    <Text>Evil wins!</Text>
                ) : (
                    <Text>Good wins!</Text>
                ))}
            <Text></Text>
        </Box>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
}))(Game);
