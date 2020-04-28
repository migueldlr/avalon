import React, { useState } from 'react';
import { Box, Label, Checkbox, Text, Button } from 'theme-ui';
import { GameStateType, Role, PlayerType } from '../types';

import { db, auth } from '../firebase/index';

interface AssassinPickProps {
    gameState: GameStateType;
    gameId: string;
}

const isBad = (role: Role) => {
    return role === 'assassin' || role === 'bad';
};

const AssassinPick = (props: AssassinPickProps) => {
    const { gameState, gameId } = props;
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null); // uid
    const uid = auth.currentUser?.uid;
    const thisPlayer = gameState.players.find((p) => p.uid === uid);

    const goodies = gameState.players.filter(
        (p) => !isBad(p.role) && p.uid !== thisPlayer?.uid,
    );

    const handleSelect = (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>,
    ) => {
        const target = e.target as HTMLInputElement;
        setSelectedPlayer(target.checked ? target.name : null);
    };

    const submitAssassin = () => {
        console.log(selectedPlayer);
        db.ref(`gameIn/${gameId}/assassinPick`)
            .set(selectedPlayer)
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Box>
            {thisPlayer?.role === 'assassin' && (
                <>
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
        </Box>
    );
};

export default AssassinPick;
