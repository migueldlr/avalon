import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text, Button } from 'theme-ui';
import { AppState } from '../store/index';

import { dbGetGameRef } from '../firebase/game';
import { db, auth } from '../firebase/index';

interface GameProps {
    gameId: string;
}

interface GameState {
    phase: 'assign' | 'start';
}

const Game = (props: GameProps) => {
    const { gameId } = props;
    const uid = auth.currentUser?.uid;
    const [gameState, setGameState] = useState<GameState>({ phase: 'start' });

    useEffect(() => {
        const gameRef = dbGetGameRef(gameId);
        gameRef.on('value', (snap) => {
            const snapVal = snap.val();

            if (snapVal == null) return;
            console.log('value changed!');
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
            {gameState.phase === 'assign' ? (
                <Button onClick={setReady}>Ready!</Button>
            ) : (
                ''
            )}
        </Box>
    );
};

export default connect((state: AppState) => ({
    gameId: state.rooms.roomId ?? '',
}))(Game);
