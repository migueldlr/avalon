import React from 'react';
import { connect } from 'react-redux';
import { Box, Text } from 'theme-ui';
import { AppState } from '../store/index';

interface GameProps {
    gameId: string | null;
}

const Game = (props: GameProps) => {
    const { gameId } = props;
    return (
        <Box>
            <Text>Game</Text>
            <Text>{gameId ?? ''}</Text>
        </Box>
    );
};

export default connect((state: AppState) => ({ gameId: state.rooms.roomId }))(
    Game,
);
