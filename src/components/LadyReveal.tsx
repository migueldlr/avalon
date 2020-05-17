import React, { useState, useEffect } from 'react';
import { Checkbox, Text, Button, Label, Box } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType } from '../types';

import { db, auth } from '../firebase/index';
import { getThisPlayer, isBad } from '../utils';

interface LadyRevealProps {
    gameState: GameStateType;
    gameId: string;
}

const LadyReveal = (props: LadyRevealProps) => {
    const { gameState, gameId } = props;
    const thisPlayer = getThisPlayer(gameState);
    const [canClick, setCanClick] = useState(false);
    const [ready, setLocalReady] = useState(false);
    const uid = auth.currentUser?.uid;

    useEffect(() => {
        setTimeout(() => {
            setCanClick(true);
        }, 2000);
    });

    const setReady = async () => {
        await db.ref(`gameIn/${gameId}/ready/${uid}`).set(true);
    };

    const handleClick = () => {
        setReady();
        setCanClick(false);
        setLocalReady(true);
    };

    const selectedPlayer = gameState.players.find(
        (p) =>
            gameState.lady && p.uid === gameState.lady[gameState.currentQuest],
    );

    const roleText = selectedPlayer
        ? isBad(selectedPlayer.role)
            ? '💀 evil'
            : '🏰 good'
        : '';

    return (
        <>
            {gameState.lady &&
                thisPlayer?.uid ===
                    gameState.lady[gameState.currentQuest - 1] && (
                    <>
                        <Text>
                            The Lady of the Lake reveals that{' '}
                            {selectedPlayer?.name} is {roleText}!
                        </Text>
                        {(canClick || ready) && (
                            <Button
                                disabled={ready}
                                variant={ready ? 'disabled' : 'primary'}
                                onClick={handleClick}>
                                Ready!
                            </Button>
                        )}
                    </>
                )}
            {gameState.lady &&
                thisPlayer?.uid !==
                    gameState.lady[gameState.currentQuest - 1] && (
                    <Text>The Lady of the Lake is using her powers...</Text>
                )}
        </>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(LadyReveal);
