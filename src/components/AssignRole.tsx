import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from 'theme-ui';
import { connect } from 'react-redux';

import { AppState } from '../store/index';
import { GameStateType } from '../types';
import { listify } from '../utils';
import { db, auth } from '../firebase';
import RoleDisplay from './RoleDisplay';

interface AssignRoleProps {
    gameState: GameStateType;
    gameId: string;
}

const AssignRole = (props: AssignRoleProps) => {
    const { gameState, gameId } = props;
    const [canClick, setCanClick] = useState(false);
    const [waitFor, setWaitFor] = useState<string[]>([]);
    const [ready, setLocalReady] = useState(false);

    const uid = auth.currentUser?.uid;
    useEffect(() => {
        setTimeout(() => {
            setCanClick(true);
        }, 2000);
        db.ref(`gameIn/${gameId}/ready`).on('value', (snap) => {
            const snapVal: Record<string, boolean> = snap.val();

            const voted = Object.keys(snapVal ?? {});

            const waitForNames = gameState.players
                .filter((p) => !voted.includes(p.uid))
                .map((p) => p.name);

            setWaitFor(waitForNames);
        });
    }, [gameId, gameState.players]);

    const setReady = async () => {
        await db.ref(`gameIn/${gameId}/ready/${uid}`).set(true);
    };

    const handleClick = () => {
        setReady();
        setCanClick(false);
        setLocalReady(true);
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

    return (
        <Box sx={{ textAlign: 'center' }}>
            <RoleDisplay />
            {(canClick || ready) && (
                <Button
                    sx={{ marginTop: 2 }}
                    disabled={ready}
                    variant={ready ? 'disabled' : 'primary'}
                    onClick={handleClick}>
                    Ready!
                </Button>
            )}
            {(canClick || ready) && WaitFor}
        </Box>
    );
};

export default connect((state: AppState) => ({
    gameId: state.game.gameId ?? '',
    gameState: state.game.gameState,
}))(AssignRole);
