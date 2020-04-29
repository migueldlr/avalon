import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex } from 'theme-ui';
import { AppState } from '../store/index';

import { dbGetGameRef } from '../firebase/game';
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

    return (
        <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            {gameState.phase !== 'start' &&
                gameState.phase !== 'assign' &&
                gameState.phase !== 'decision' && (
                    <GameStateDisplay gameState={gameState} />
                )}
            {gameState.phase === 'assign' && (
                <AssignRole gameState={gameState} gameId={gameId} />
            )}
            {gameState.phase === 'turn' && (
                <PickTeam gameState={gameState} gameId={gameId} />
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
        </Flex>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
}))(Game);
