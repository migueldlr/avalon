import React, { useState } from 'react';
import { Box, Text, Button, Checkbox, Label } from 'theme-ui';
import { GameStateType } from '../types';
import { db, auth } from '../firebase/index';

interface PickTeamProps {
    gameState: GameStateType;
    gameId: string;
}

const PickTeam = (props: PickTeamProps) => {
    const { gameState, gameId } = props;
    const uid = auth.currentUser?.uid;
    const [selected, setSelected] = useState<string[]>([]);
    const submitTeam = async (players: string[]) => {
        await db
            .ref(
                `gameIn/${gameId}/proposed/${gameState.currentQuest}/${gameState.currentTeamVote}`,
            )
            .set(players);
    };
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
    const handleSubmit = () => {
        submitTeam(selected);
    };

    if (gameState.players[gameState.order[gameState.currentTurn]].uid === uid) {
        return (
            <>
                <Text>Who will go on this quest?</Text>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {gameState.order.map((i) => {
                        const p = gameState.players[i];
                        return (
                            <Label key={p.uid}>
                                <Checkbox name={p.uid} onClick={handleSelect} />
                                {p.name}
                            </Label>
                        );
                    })}
                </Box>
                <Button
                    disabled={
                        selected.length !==
                        gameState.quests[gameState.currentQuest]
                    }
                    variant={
                        selected.length !==
                        gameState.quests[gameState.currentQuest]
                            ? 'disabled'
                            : 'primary'
                    }
                    onClick={handleSubmit}>
                    Onward!
                </Button>
            </>
        );
    }
    return (
        <>
            <Text>
                {gameState.players[gameState.order[gameState.currentTurn]].name}{' '}
                is forming a questing team
            </Text>
        </>
    );
};

export default PickTeam;
