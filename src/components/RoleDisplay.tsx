import React, { useState } from 'react';
import { Box, Text } from 'theme-ui';
import { GameStateType } from '../types';
import {
    isBad,
    isBadForMerlin,
    getThisPlayer,
    roleText,
    listify,
} from '../utils';
import { connect } from 'react-redux';
import { AppState } from '../store';

interface Props {
    gameState: GameStateType;
    inLegend?: boolean;
}

const RoleDisplay = (props: Props) => {
    const { gameState, inLegend } = props;
    const thisPlayer = getThisPlayer(gameState);
    const [first] = useState(Math.random() < 0.5 ? 0 : 1);

    const baddies = gameState.players
        .filter(
            (p) =>
                isBad(p.role) &&
                p.role !== 'oberon' &&
                p.uid !== thisPlayer?.uid,
        )
        .map((p) => p.name);
    const merlinBaddies = gameState.players
        .filter((p) => isBadForMerlin(p.role) && p.uid !== thisPlayer?.uid)
        .map((p) => p.name);
    const merlinMorgana = gameState.players
        .filter((p) => p.role === 'morgana' || p.role === 'merlin')
        .map((p) => p.name);
    const RoleText = ({ children }: { children: React.ReactNode }) => {
        return (
            <Text variant={inLegend ? 'legend' : 'primary'}>{children}</Text>
        );
    };
    return (
        <Box sx={{ width: '100%' }}>
            {thisPlayer && (
                <>
                    <RoleText>
                        {thisPlayer.name}, you are {roleText[thisPlayer.role]}
                    </RoleText>

                    {
                        // need to check the length in case the only other baddy is oberon
                        isBad(thisPlayer.role) &&
                            thisPlayer.role !== 'oberon' &&
                            baddies.length > 0 && (
                                <RoleText>
                                    The other minions of Mordred:{' '}
                                    {listify(baddies)}
                                </RoleText>
                            )
                    }
                    {thisPlayer.role === 'merlin' && (
                        <RoleText>
                            Your prophetic powers reveal to you the minions of
                            Mordred: {listify(merlinBaddies)}
                        </RoleText>
                    )}
                    {thisPlayer.role === 'percival' &&
                        merlinMorgana.length > 1 && (
                            <RoleText>
                                Your holy powers reveal Merlin to be:{' '}
                                {merlinMorgana[0 + first]} or{' '}
                                {merlinMorgana[1 - first]}
                            </RoleText>
                        )}
                    {thisPlayer.role === 'percival' &&
                        merlinMorgana.length === 1 && (
                            <RoleText>
                                Your holy powers reveal Merlin to be:{' '}
                                {merlinMorgana[0]}
                            </RoleText>
                        )}
                    {thisPlayer.role === 'tristan' && (
                        <RoleText>
                            Your undying love reveals Iseult to be:{' '}
                            {
                                gameState.players.find(
                                    (p) => p.role === 'iseult',
                                )?.name
                            }
                        </RoleText>
                    )}
                    {thisPlayer.role === 'iseult' && (
                        <RoleText>
                            Your undying love reveals Tristan to be:{' '}
                            {
                                gameState.players.find(
                                    (p) => p.role === 'tristan',
                                )?.name
                            }
                        </RoleText>
                    )}
                </>
            )}
        </Box>
    );
};

export default connect((state: AppState) => ({
    gameState: state.game.gameState,
}))(RoleDisplay);
