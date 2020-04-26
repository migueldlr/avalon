import React from 'react';
import { connect } from 'react-redux';
import { Box, Button, Input, Text } from 'theme-ui';
import { AppState } from '../store/index';

interface GameProps {
    gameId: string | null;
}

const Game = (props: GameProps) => {
    const { gameId } = props;
    return (
        <Box>
            <Text>{gameId ?? ''}</Text>
        </Box>
    );
};

export default connect((state: AppState) => ({ gameId: state.game.gameId }))(
    Game,
);
