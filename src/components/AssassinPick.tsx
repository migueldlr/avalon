import React, { useState } from 'react';
import { Checkbox, Text, Button, Label, Box } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType, Role } from '../types';

import { db } from '../firebase/index';
import { getThisPlayer, getPlayerName } from '../utils';

interface AssassinPickProps {
    gameState: GameStateType;
    gameId: string;
}

const isBad = (role: Role) => {
    return role === 'assassin' || role === 'bad' || role === 'morgana';
};

const AssassinPick = (props: AssassinPickProps) => {
    const { gameState, gameId } = props;
    const [selected, setSelected] = useState<string[]>([]); // uid
    const thisPlayer = getThisPlayer(gameState);

    const goodies = gameState.players.filter(
        (p) => !isBad(p.role) && p.uid !== thisPlayer?.uid,
    );

    const handleSelect = (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    ) => {
        const target = e.target as HTMLInputElement;
        let newSelected = [...selected];
        if (target.checked) {
            newSelected.push(target.name);
        } else {
            newSelected = newSelected.filter((x) => x !== target.name);
        }
        setSelected(newSelected);
    };

    const submitAssassin = () => {
        db.ref(`gameIn/${gameId}/assassinPick`)
            .set(selected)
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
    };

    const hasLovers = gameState.players.some((p) => p.role === 'tristan');

    return (
        <>
            {thisPlayer?.role === 'assassin' && (
                <>
                    <Text>Who do you assassinate?</Text>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {goodies.map((p) => (
                            <Label key={p.name}>
                                <Checkbox name={p.uid} onClick={handleSelect} />
                                {p.name}
                            </Label>
                        ))}
                    </Box>
                    {selected.length === 1 && (
                        <Text>
                            You believe {getPlayerName(gameState, selected[0])}{' '}
                            to be Merlin
                        </Text>
                    )}
                    {selected.length === 2 && hasLovers && (
                        <Text>
                            You believe {getPlayerName(gameState, selected[0])}{' '}
                            and {getPlayerName(gameState, selected[1])} to be
                            Tristan and Iseult
                        </Text>
                    )}
                    <Button
                        disabled={
                            !(
                                selected.length === 1 ||
                                (selected.length === 2 && hasLovers)
                            )
                        }
                        variant={
                            !(
                                selected.length === 1 ||
                                (selected.length === 2 && hasLovers)
                            )
                                ? 'disabled'
                                : 'primary'
                        }
                        onClick={submitAssassin}>
                        Assassinate!
                    </Button>
                </>
            )}
            {thisPlayer?.role !== 'assassin' && (
                <Text>The assassin is about to strike...</Text>
            )}
        </>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(AssassinPick);
