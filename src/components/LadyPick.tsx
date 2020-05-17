import React, { useState } from 'react';
import { Checkbox, Text, Button, Label, Box } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType, Role } from '../types';

import { db } from '../firebase/index';
import { getThisPlayer } from '../utils';

interface LadyPickProps {
    gameState: GameStateType;
    gameId: string;
}

const LadyPick = (props: LadyPickProps) => {
    const { gameState, gameId } = props;
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null); // uid
    const thisPlayer = getThisPlayer(gameState);

    const handleSelect = (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    ) => {
        const target = e.target as HTMLInputElement;
        setSelectedPlayer(target.checked ? target.name : null);
    };

    const submitLady = () => {
        db.ref(`gameIn/${gameId}/lady`)
            .child(`${gameState.currentQuest}`)
            .set(selectedPlayer)
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
    };

    return (
        <>
            {gameState.lady &&
                thisPlayer?.uid ===
                    gameState.lady[gameState.currentQuest - 1] && (
                    <>
                        <Text>
                            The Lady of the Lake will grant you with the
                            knowledge of one player's allegiance. Who do you
                            wish to reveal?
                        </Text>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {gameState.players
                                .filter((p) => p.uid !== thisPlayer.uid)
                                .filter((p) => !gameState.lady?.includes(p.uid))
                                .map((p) => (
                                    <Label key={p.name}>
                                        <Checkbox
                                            name={p.uid}
                                            onClick={handleSelect}
                                            onChange={() => {}}
                                            checked={selectedPlayer === p.uid}
                                        />
                                        {p.name}
                                    </Label>
                                ))}
                        </Box>
                        <Button
                            disabled={selectedPlayer == null}
                            variant={
                                selectedPlayer == null ? 'disabled' : 'primary'
                            }
                            onClick={submitLady}>
                            Reveal!
                        </Button>
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
}))(LadyPick);
