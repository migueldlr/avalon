import React, { useState, useEffect } from 'react';
import { Box, Text } from 'theme-ui';
import { GameStateType } from '../types';

import { db, auth } from '../firebase/index';
import { dbLeaveRoom } from '../firebase/rooms';

interface DecisionDisplayProps {
    gameState: GameStateType;
    gameId: string;
}

const DecisionDisplay = (props: DecisionDisplayProps) => {
    const { gameState, gameId } = props;
    const uid = auth.currentUser?.uid;

    const res = gameState.questVote;
    res.sort();
    res.reverse();
    const displayDecision = res.map((r) => (r ? '🛡️' : '💀'));

    const [displayN, setDisplayN] = useState<number>(0);
    const [displayRes, setDisplayRes] = useState<boolean>(false);
    useEffect(() => {
        if (displayN < res.length)
            setTimeout(() => {
                setDisplayN(displayN + 1);
            }, 2000);
        else if (displayN === res.length)
            setTimeout(() => {
                setDisplayRes(true);
                setTimeout(() => {
                    db.ref(`gameIn/${gameId}/ready/${uid}/`).set(true);
                }, 1000);
            }, 1000);
    });

    return (
        <Box>
            <Text>The mission results have arrived...</Text>
            <Text>{displayDecision.slice(0, displayN)}</Text>
            {displayRes && (
                <Text>
                    {gameState.questResults[gameState.currentQuest]
                        ? 'The mission succeeded!'
                        : 'The mission failed'}
                </Text>
            )}
        </Box>
    );
};

export default DecisionDisplay;
