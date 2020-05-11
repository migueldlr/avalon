import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType, PlayerType } from '../types';

import { db, auth } from '../firebase/index';
import { listify } from '../utils';

interface VoteQuestProps {
    gameState: GameStateType;
    gameId: string;
}

const VoteQuest = (props: VoteQuestProps) => {
    const { gameState, gameId } = props;
    const uid = auth.currentUser?.uid;
    const questerUids: string[] =
        gameState.proposed[gameState.currentQuest][gameState.currentTeamVote];
    const questers = questerUids
        .map((u) => gameState.players.find((p) => p.uid === u)?.name ?? '')
        .filter((x) => x !== '');
    const thisPlayer = gameState.players.find((p) => p.uid === uid);

    const [voted, setVoted] = useState<boolean>(false);
    const [vote, setVote] = useState<boolean | null>(null);
    const [waitFor, setWaitFor] = useState<string[]>([]);
    useEffect(() => {
        db.ref(`gameIn/${gameId}/questVote`).on('value', (snap) => {
            const snapVal: Record<string, boolean> = snap.val();

            const voted = Object.keys(snapVal ?? {});

            const waitForUids = gameState.proposed[gameState.currentQuest][
                gameState.currentTeamVote
            ].filter((p) => !voted.includes(p));

            const waitForPlayers = waitForUids
                .map((u) => gameState.players.find((p) => p.uid === u))
                .filter((p) => p != null) as PlayerType[];

            const waitFor = waitForPlayers.map((p) => p.name);

            setWaitFor(waitFor);
        });
    }, [
        gameId,
        gameState.currentQuest,
        gameState.currentTeamVote,
        gameState.players,
        gameState.proposed,
    ]);

    const dbSetVote = (v: boolean) => {
        db.ref(`gameIn/${gameId}/questVote/${uid}`)
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

    const WaitFor = (
        <>
            {waitFor.length > 0 && (
                <Text variant="disclaimer">
                    Waiting on {listify(waitFor)}
                    ...
                </Text>
            )}
        </>
    );

    if (
        gameState.proposed[gameState.currentQuest][
            gameState.currentTeamVote
        ].some((u) => u === uid)
    ) {
        return (
            <>
                <Text>
                    You are on a quest with{' '}
                    {listify(questers.filter((n) => n !== thisPlayer?.name))}
                </Text>
                <Text>Do you advance the quest?</Text>
                <Box>
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
                {WaitFor}
            </>
        );
    }
    return (
        <>
            <Text>{listify(questers)} are on the quest...</Text>
            {WaitFor}
        </>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(VoteQuest);
