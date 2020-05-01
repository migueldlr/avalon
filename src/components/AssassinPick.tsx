import React, { useState } from 'react';
import { Checkbox, Text, Button, Label, Box } from 'theme-ui';
import { GameStateType, Role } from '../types';

import { db } from '../firebase/index';
import { getThisPlayer } from '../utils';

interface AssassinPickProps {
    gameState: GameStateType;
    gameId: string;
}

const isBad = (role: Role) => {
    return role === 'assassin' || role === 'bad' || role === 'morgana';
};

const AssassinPick = (props: AssassinPickProps) => {
    const { gameState, gameId } = props;
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null); // uid
    const thisPlayer = getThisPlayer(gameState);

    const goodies = gameState.players.filter(
        (p) => !isBad(p.role) && p.uid !== thisPlayer?.uid
    );

    const handleSelect = (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>
    ) => {
        const target = e.target as HTMLInputElement;
        setSelectedPlayer(target.checked ? target.name : null);
    };

    const submitAssassin = () => {
        db.ref(`gameIn/${gameId}/assassinPick`)
            .set(selectedPlayer)
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
    };

    return (
        <>
            {thisPlayer?.role === 'assassin' && (
                <>
                    <Text>Who is Merlin?</Text>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {goodies.map((p) => (
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
                        onClick={submitAssassin}>
                        Assassinate!
                    </Button>
                </>
            )}
            {thisPlayer?.role !== 'assassin' && (
                <Text>The assassin is deciding...</Text>
            )}
        </>
    );
};

export default AssassinPick;
