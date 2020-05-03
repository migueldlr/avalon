/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Button, Text, Flex, Heading, Divider } from 'theme-ui';
import { RouteComponentProps, navigate } from '@reach/router';

interface Props {}

const HowTo = (props: Props & RouteComponentProps) => {
    return (
        <Flex
            sx={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                // alignItems: 'center',
                minHeight: '100vh',
                py: [2, 3, 4, 5],
                px: ['4px', '40px', '168px', null, '440px'],
            }}>
            <Heading>The Resistance: Avalon</Heading>
            <Heading variant="sub">A Beginner's Guide</Heading>
            <Divider />
            <Text sx={{ mt: 3 }}>
                <Text variant="fancy">The Resistance: Avalon</Text> (also
                referred to as <Text variant="fancy">Avalon</Text>) is a social
                deduction game for 5-10 players.
            </Text>
            <Heading variant="sub2">Players</Heading>
            <Text>
                Each player has a main allegiance: they are either a defender of
                🏰 good or an agent of 💀 evil. Each player may also have a
                specific role, which affects gameplay in various ways. Before
                the game begins, players are given their allegiance and role. In
                addition, all evil players are given the names (but not roles)
                of the other evil players.
            </Text>
            <Text sx={{ mt: 3 }}>
                The 🏰 good roles are:
                <ul style={{ margin: '1em 0' }}>
                    <li>Merlin - knows which players are evil</li>
                    <li>Percival - knows the identity of Merlin</li>
                </ul>
                The 💀 evil roles are:
                <ul style={{ margin: '1em 0', marginBottom: 0 }}>
                    <li>
                        Assassin - attempts to assassinate Merlin at the end of
                        the game
                    </li>
                    <li>Morgana - appears to Percival as Merlin</li>
                    <li>Oberon - not revealed to other evil players</li>
                    <li>Mordred - not revealed to Merlin</li>
                </ul>
            </Text>
            <Heading variant="sub2">Gameplay</Heading>
            <Text>
                A single game consists of five sequential quests. Each quest
                requires a specific number of players, dependent on the number
                of players in a game. On a player's turn, they are the quest
                leader and they nominate the appropriate number of players to go
                on the current quest. All players then{' '}
                <Text variant="bold">publicly</Text> vote "yea" or "nay". If a
                majority (>50%) of players vote "yea", the quest proposal is
                accepted and the nominated players go on the quest. If a quest
                proposal is rejected, it is the next player's turn to be quest
                leader. If five quest proposals are rejected in a row, 💀 evil
                wins a quest automatically.
            </Text>
            <Text sx={{ mt: 3 }}>
                Once on a quest, players <Text variant="bold">secretly</Text>{' '}
                vote "success" or "failure". After all players have voted, the
                quest results are revealed - if any player voted "failure", the
                entire quest fails and 💀 evil wins the quest. (The fourth quest
                requires two players to fail in games with seven or more
                players.) If all players voted "success", 🏰 good wins the
                quest.
            </Text>
            <Text sx={{ mt: 3 }}>
                If the agents of 💀 evil win three quests, the game ends and 💀
                evil wins. If the defenders of 🏰 good win three quests, they
                have not yet won - the Assassin has a chance to discuss with
                other evil players and guess which good player is Merlin. If the
                Assassin guesses correctly, Merlin is assassinated and 💀 evil
                wins. If the Assassin guesses incorrectly, Merlin is unharmed
                and 🏰 good wins.
            </Text>
            <Heading variant="sub2">Notes</Heading>
            <Text>
                <Text variant="fancy">Avalon</Text> is a social deduction game.
                It is best played when all players can discuss, deduce and
                deceieve openly. Players are allowed to make any claim at any
                point in the game as it is said publicly.
            </Text>
            <Text sx={{ mt: 3 }}>
                This site does not support an in-game chat, so when playing
                remotely, leverage a video conferencing tool to communicate with
                other players.
            </Text>
            <Button
                sx={{ width: 'fit-content', mt: 3 }}
                variant="alt"
                onClick={() => navigate('/')}>
                ⬅
            </Button>
        </Flex>
    );
};

export default HowTo;
