import React, { useState } from 'react';
import { db, auth } from '../firebase/index';
import { Box, Text, Button } from 'theme-ui';
import { GameStateType } from '../types';
import { listify } from '../utils';

interface VoteTeamProps {
    gameState: GameStateType;
    gameId: string;
}

const VoteTeam = (props: VoteTeamProps) => {
    const { gameState, gameId } = props;
    const uid = auth.currentUser?.uid;
    const proposer =
        gameState.players[gameState.order[gameState.currentTurn]].name;
    const proposedUids: string[] =
        gameState.proposed[gameState.currentQuest][gameState.currentTeamVote];
    const proposed = proposedUids
        .map((u) => gameState.players.find((p) => p.uid === u)?.name ?? '')
        .filter((x) => x !== '');

    const [voted, setVoted] = useState<boolean>(false);
    const [vote, setVote] = useState<boolean | null>(null);

    const dbSetVote = (v: boolean) => {
        db.ref(
            `gameIn/${gameId}/teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}/${uid}`,
        )
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

    return (
        <Box>
            <Text>
                {proposer} has proposed the following team: {listify(proposed)}
            </Text>
            <Text>What say you?</Text>
            <Button
                onClick={() => handleVote(true)}
                variant={!voted ? 'primary' : vote ? 'selected' : 'disabled'}
                disabled={voted}>
                Yea!
            </Button>
            <Button
                onClick={() => handleVote(false)}
                variant={!voted ? 'primary' : !vote ? 'selected' : 'disabled'}
                disabled={voted}>
                Nay!
            </Button>
        </Box>
    );
};

export default VoteTeam;
