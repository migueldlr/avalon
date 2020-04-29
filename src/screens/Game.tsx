import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, Text } from 'theme-ui';
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
import GameStateDisplay from '../components/GameStateDisplay';
import EndDisplay from '../components/EndDisplay';

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
        rejects: -1,
        assassinPick: '',
        teamVote: [],
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
        <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            {gameState.phase !== 'start' &&
                gameState.phase !== 'assign' &&
                gameState.phase !== 'decision' && (
                    <GameStateDisplay gameState={gameState} />
                )}
            {gameState.phase === 'assign' && (
                <AssignRole
                    uid={uid ?? ''}
                    gameState={gameState}
                    onClick={setReady}
                />
            )}
            {gameState.phase === 'turn' && (
                <PickTeam gameState={gameState} submitTeam={setProposedTeam} />
            )}
            {gameState.phase === 'voteTeam' && (
                <VoteTeam gameState={gameState} gameId={gameId} />
            )}
            {gameState.phase === 'voteQuest' && (
                <VoteQuest gameState={gameState} gameId={gameId} />
            )}
            {gameState.phase === 'decision' && (
                <DecisionDisplay gameState={gameState} gameId={gameId} />
            )}
            {gameState.phase === 'assassin' && (
                <AssassinPick gameState={gameState} gameId={gameId} />
            )}
            {gameState.phase === 'end' && <EndDisplay gameState={gameState} />}
            <Text></Text>
        </Flex>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
}))(Game);
