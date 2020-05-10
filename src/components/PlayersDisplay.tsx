/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Text, Flex } from 'theme-ui';
import { GameStateType } from '../types';
import { isBad, listify, roleDisplay } from '../utils';

interface PlayersDisplayProps {
    gameState: GameStateType;
}

const PlayersDisplay = (props: PlayersDisplayProps) => {
    const { gameState } = props;
    const roles = gameState.players.map((p) => p.role);
    const goodies = roles
        .filter((r) => !isBad(r) && r !== 'good')
        .map((r) => roleDisplay[r] ?? r)
        .sort();
    const knights = roles.filter((r) => r === 'good');
    if (knights.length > 0)
        goodies.push(
            `${knights.length} knight${knights.length > 1 ? 's' : ''}`,
        );

    const baddies = roles
        .filter((r) => isBad(r) && r !== 'bad')
        .map((r) => roleDisplay[r] ?? r)
        .sort();
    const minions = roles.filter((r) => r === 'bad');
    if (minions.length > 0)
        baddies.push(
            `${minions.length} minion${minions.length > 1 ? 's' : ''}`,
        );

    const numGood = roles.filter((r) => !isBad(r)).length;
    const numBad = roles.filter((r) => isBad(r)).length;
    return (
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            <Text variant="legend">In this game:</Text>
            <Text variant="legend">
                🏰 ({numGood} total) {listify(goodies)}
            </Text>
            <Text variant="legend">
                💀 ({numBad} total) {listify(baddies)}
            </Text>
        </Flex>
    );
};

export default PlayersDisplay;
