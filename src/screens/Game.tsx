import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, Text } from 'theme-ui';
import { AppState } from '../store/index';

import { dbGetGameRef } from '../firebase/game';
import { GameStateType } from '../types';
import AssignRole from '../components/AssignRole';
import PickTeam from '../components/PickTeam';
import VoteTeam from '../components/VoteTeam';
import VoteQuest from '../components/VoteQuest';
import DecisionDisplay from '../components/DecisionDisplay';
import AssassinPick from '../components/AssassinPick';
import GameStateDisplay from '../components/GameStateDisplay';
import EndDisplay from '../components/EndDisplay';
import { updateGame } from '../store/game/actions';
import LadyPick from '../components/LadyPick';
import LadyReveal from '../components/LadyReveal';

interface GameProps {
    gameId: string;
    gameState: GameStateType;
    updateGame: typeof updateGame;
}

const Game = (props: GameProps) => {
    const { gameId, updateGame, gameState } = props;

    useEffect(() => {
        const gameRef = dbGetGameRef(gameId);
        gameRef.on('value', (snap) => {
            const snapVal = snap.val();

            if (snapVal == null) return;
            updateGame(snapVal);
        });
    }, [gameId, updateGame]);
    const { phase } = gameState;
    if (phase === 'start') return <Text>Loading...</Text>;
    const phaseComponent: Record<typeof phase, JSX.Element> = {
        assign: <AssignRole />,
        turn: <PickTeam />,
        voteTeam: <VoteTeam />,
        voteQuest: <VoteQuest />,
        decision: <DecisionDisplay />,
        assassin: <AssassinPick />,
        ladyPick: <LadyPick />,
        ladyReveal: <LadyReveal />,
        end: <EndDisplay />,
    };
    return (
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', p: 1 }}>
            {phase !== 'assign' && phase !== 'decision' && <GameStateDisplay />}
            {phaseComponent[phase]}
        </Flex>
    );
};

export default connect(
    (state: AppState) => ({
        gameId: state.game.gameId ?? '',
        gameState: state.game.gameState,
    }),
    { updateGame },
)(Game);
