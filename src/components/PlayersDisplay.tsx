/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Text, Flex } from 'theme-ui';
import { GameStateType } from '../types';
import { isBad, listify } from '../utils';

interface PlayersDisplayProps {
    gameState: GameStateType;
}

const PlayersDisplay = (props: PlayersDisplayProps) => {
    const { gameState } = props;
    const goodies = gameState.players
        .filter((p) => !isBad(p.role))
        .map((p) => p.role)
        .sort();
    const baddies = gameState.players
        .filter((p) => isBad(p.role))
        .map((p) => p.role)
        .sort();
    return (
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Text variant="legend">In this game:</Text>
            <Text variant="legend">
                🏹 {listify(goodies)} ({goodies.length})
            </Text>
            <Text variant="legend">
                💀 {listify(baddies)} ({baddies.length})
            </Text>
        </Flex>
    );
};

export default PlayersDisplay;
