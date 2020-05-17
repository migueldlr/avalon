import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase/index';
import { Box, Text, Button } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
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
    const [waitFor, setWaitFor] = useState<string[]>([]);
    useEffect(() => {
        db.ref(
            `gameIn/${gameId}/teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}`,
        ).on('value', (snap) => {
            const snapVal: Record<string, boolean> = snap.val();

            const voted = Object.keys(snapVal ?? {});

            const waitFor = gameState.players
                .filter((p) => !voted.includes(p.uid))
                .map((p) => p.name);

            setWaitFor(waitFor);
        });
    }, [
        gameId,
        gameState.currentQuest,
        gameState.currentTeamVote,
        gameState.players,
    ]);

    const dbSetVote = (v: boolean) => {
        db.ref(
            `gameIn/${gameId}/teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}/${uid}`,
        )
            .set(v)
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });
    };

    const handleVote = (v: boolean) => {
        setVote(v);
        setVoted(true);
        dbSetVote(v);
    };

    return (
        <>
            <Text sx={{ textAlign: 'center' }}>
                {proposer} has proposed the following team: {listify(proposed)}
            </Text>
            <Text>What say you?</Text>
            <Box>
                <Button
                    onClick={() => handleVote(true)}
                    variant={
                        !voted ? 'primary' : vote ? 'selected' : 'disabled'
                    }
                    disabled={voted}>
                    Yea!
                </Button>
                <Button
                    onClick={() => handleVote(false)}
                    variant={
                        !voted ? 'primary' : !vote ? 'selected' : 'disabled'
                    }
                    disabled={voted}>
                    Nay!
                </Button>
            </Box>
            {waitFor.length > 0 && (
                <Text variant="disclaimer">
                    Waiting on {listify(waitFor)}...
                </Text>
            )}
        </>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(VoteTeam);
