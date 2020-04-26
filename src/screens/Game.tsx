import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Box, Text } from 'theme-ui';
import { AppState } from '../store/index';

import { dbGetGameRef } from '../firebase/game';

interface GameProps {
    gameId: string | null;
}

const Game = (props: GameProps) => {
    const { gameId } = props;
    const [gameState, setGameState] = useState({});

    useEffect(() => {
        if (gameId == null) return;
        const gameRef = dbGetGameRef(gameId);
        gameRef.on('value', (snap) => {
            const snapVal = snap.val();

            if (snapVal == null) return;
            console.log('value changed!');
            setGameState(snapVal);
        });
    }, [gameId]);

    return (
        <Box>
            <Text>Game</Text>
            <Text>{gameId ?? ''}</Text>
            <Text>{JSON.stringify(gameState)}</Text>
        </Box>
    );
};

export default connect((state: AppState) => ({ gameId: state.rooms.roomId }))(
    Game,
);
