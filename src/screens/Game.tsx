import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text } from 'theme-ui';
import { AppState } from '../store/index';

import { dbGetGameRef } from '../firebase/game';
import { db, auth } from '../firebase/index';
import { GameStateType } from '../types';
import AssignRole from '../components/AssignRole';

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

    return (
        <Box>
            <Text>Game</Text>
            <Text>{gameId ?? ''}</Text>
            <Text>{JSON.stringify(gameState)}</Text>
            {gameState.phase === 'assign' && (
                <AssignRole
                    uid={uid ?? ''}
                    gameState={gameState}
                    onClick={setReady}
                />
            )}
            {gameState.phase === 'turn' &&
            gameState.players[gameState.currentTurn].uid === uid ? (
                <Text>It's your turn!</Text>
            ) : (
                ''
            )}
            <Text></Text>
        </Box>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
}))(Game);
