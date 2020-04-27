import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text, Button } from 'theme-ui';
import { AppState } from '../store/index';

import { dbGetGameRef } from '../firebase/game';
import { db, auth } from '../firebase/index';
import { GameStateType } from '../types';

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
        console.log(gameId);
        const gameRef = dbGetGameRef(gameId);
        gameRef.on('value', (snap) => {
            const snapVal = snap.val();
            console.log(JSON.stringify(snapVal));

            if (snapVal == null) return;
            console.log('value changed!');
            setGameState(snapVal);
        });
    }, [gameId]);

    const setReady = async () => {
        await db.ref(`gameIn/${gameId}/ready/${uid}`).set(true);
    };

    console.log(gameState);

    return (
        <Box>
            <Text>Game</Text>
            <Text>{gameId ?? ''}</Text>
            <Text>{JSON.stringify(gameState)}</Text>
            {gameState.phase === 'assign' ? (
                <Button onClick={setReady}>Ready!</Button>
            ) : (
                ''
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
