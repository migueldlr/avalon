import React, { useState } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { GameStateType } from '../types';

import { db, auth } from '../firebase/index';

interface VoteQuestProps {
    gameState: GameStateType;
    gameId: string;
}

const VoteQuest = (props: VoteQuestProps) => {
    const { gameState, gameId } = props;
    const uid = auth.currentUser?.uid;
    const questerUids: string[] =
        gameState.proposed[gameState.currentQuest][gameState.currentTeamVote];
    const questers = questerUids.map(
        (u) => gameState.players.find((p) => p.uid === u)?.name,
    );
    const thisPlayer = gameState.players.find((p) => p.uid === uid);

    const [voted, setVoted] = useState<boolean>(false);
    const [vote, setVote] = useState<boolean | null>(null);

    const dbSetVote = (v: boolean) => {
        db.ref(`gameIn/${gameId}/questVote/${uid}`)
            .set(v)
            .catch((err) => {
                console.log(err);
            });
    };

    const handleVote = (v: boolean) => {
        setVote(v);
        setVoted(true);
        dbSetVote(v);
    };
    if (
        gameState.proposed[gameState.currentQuest][
            gameState.currentTeamVote
        ].some((u) => u === uid)
    ) {
        return (
            <Box>
                <Text>
                    You are on a quest with{' '}
                    {questers.filter((n) => n !== thisPlayer?.name)}
                </Text>
                <Text>Do you advance the quest?</Text>
                <Button
                    onClick={() => handleVote(true)}
                    variant={
                        !voted ? 'primary' : vote ? 'selected' : 'disabled'
                    }
                    disabled={voted}>
                    Success!
                </Button>
                <Button
                    onClick={() => handleVote(false)}
                    variant={
                        !voted ? 'primary' : !vote ? 'selected' : 'disabled'
                    }
                    disabled={voted}>
                    Failure...
                </Button>
            </Box>
        );
    }
    return <Box>{JSON.stringify(questers)} are on the quest...</Box>;
};

export default VoteQuest;
