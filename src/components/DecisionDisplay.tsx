import React, { useState, useEffect } from 'react';
import { Text } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType } from '../types';

import { db, auth } from '../firebase/index';

interface DecisionDisplayProps {
    gameState: GameStateType;
    gameId: string;
}

const DecisionDisplay = (props: DecisionDisplayProps) => {
    const { gameState, gameId } = props;
    const uid = auth.currentUser?.uid;

    let res = [];
    let displayDecision: string[] = [];

    if (Array.isArray(gameState.questVote)) {
        res = gameState.questVote;
        res.sort();
        res.reverse();
        displayDecision = res.map((r) => (r ? '🏰' : '💀'));
    }

    const [displayN, setDisplayN] = useState<number>(0);
    const [displayRes, setDisplayRes] = useState<boolean>(false);
    useEffect(() => {
        if (Array.isArray(gameState.questVote)) {
            if (displayN < res.length)
                setTimeout(() => {
                    setDisplayN(displayN + 1);
                }, 2000);
            else if (displayN === res.length)
                setTimeout(() => {
                    setDisplayRes(true);
                    setTimeout(() => {
                        db.ref(`gameIn/${gameId}/ready/${uid}/`).set(true);
                    }, 500);
                }, 1000);
        } else {
            setDisplayRes(true);
            setTimeout(() => {
                setTimeout(() => {
                    db.ref(`gameIn/${gameId}/ready/${uid}/`).set(true);
                }, 1000);
            });
        }
    }, [gameState.questVote, displayN, res.length, gameId, uid]);

    return (
        <>
            {Array.isArray(gameState.questVote) && (
                <>
                    <Text>The quest results have arrived...</Text>
                    <Text>{displayDecision.slice(0, displayN)}</Text>
                </>
            )}
            {!Array.isArray(gameState.questVote) && (
                <Text>Five rejections in a row</Text>
            )}
            {displayRes && (
                <Text>
                    {gameState.questResults[gameState.currentQuest]
                        ? 'The quest succeeded!'
                        : 'The quest failed'}
                </Text>
            )}
        </>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(DecisionDisplay);
