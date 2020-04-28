import React, { useState } from 'react';
import { Box, Text, Button, Checkbox, Label } from 'theme-ui';
import { GameStateType } from '../types';

interface PickTeamProps {
    gameState: GameStateType;
    submitTeam: (x: string[]) => void;
}

const PickTeam = (props: PickTeamProps) => {
    const { gameState, submitTeam } = props;
    const [selected, setSelected] = useState<string[]>([]);
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
    console.log(selected);
    return (
        <Box>
            <Text>Who will go on this quest?</Text>
            {gameState.players.map((p) => (
                <Label key={p.uid}>
                    <Checkbox name={p.uid} onClick={handleSelect} />
                    {p.name}
                </Label>
            ))}
            <Button
                disabled={
                    selected.length !== gameState.quests[gameState.currentQuest]
                }
                variant={
                    selected.length !== gameState.quests[gameState.currentQuest]
                        ? 'disabled'
                        : 'primary'
                }
                onClick={handleSubmit}>
                Onward!
            </Button>
        </Box>
    );
};

export default PickTeam;
