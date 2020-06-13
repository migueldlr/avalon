import * as admin from 'firebase-admin';

export const updateGame = (
    gameState: GameStateType,
    gameIn: GameInType,
    dbRef: admin.database.Reference,
    gameId: string,
): Promise<any> | null => {
    const gameRef = dbRef.child(`games/${gameId}`);
    const gameInRef = dbRef.child(`gameIn/${gameId}`);

    if (gameState.phase === 'assign') {
        if (Object.values(gameIn.ready).length === gameState.numPlayers) {
            return gameRef.update({
                phase: 'turn',
                currentTurn: 0,
            });
        }
    } else if (
        gameState.phase === 'turn' &&
        gameIn.proposed[gameState.currentQuest][gameState.currentTeamVote]
    ) {
        return gameRef.update({
            phase: 'voteTeam',
            [`proposed/${gameState.currentQuest}/${gameState.currentTeamVote}`]: gameIn
                .proposed[gameState.currentQuest][gameState.currentTeamVote],
        });
    } else if (
        gameState.phase === 'voteTeam' &&
        Object.values(
            gameIn.teamVote[gameState.currentQuest][gameState.currentTeamVote],
        ).length === gameState.numPlayers
    ) {
        const yeas = Object.values(
            gameIn.teamVote[gameState.currentQuest][gameState.currentTeamVote],
        ).filter((v) => v).length;
        if (yeas > 0.5 * gameState.numPlayers) {
            return gameInRef.update({ questVote: [] }).then(() => {
                return gameRef.update({
                    phase: 'voteQuest',
                    [`teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}`]: gameIn
                        .teamVote[gameState.currentQuest][
                        gameState.currentTeamVote
                    ],
                });
            });
        }
        // five rejections in a row, so bad guys auto-win a round
        if (gameState.rejects >= 4) {
            return Promise.all([
                gameRef.update({
                    phase: 'decision',
                    questVote: 'rejects',
                    questResults: (gameState.questResults ?? []).concat(false),
                    [`teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}`]: gameIn
                        .teamVote[gameState.currentQuest][
                        gameState.currentTeamVote
                    ],
                }),
                gameInRef.update({ ready: [] }),
            ]);
        }
        return Promise.all([
            gameRef.update({
                phase: 'turn',
                currentTurn: (gameState.currentTurn + 1) % gameState.numPlayers,
                currentTeamVote: gameState.currentTeamVote + 1,
                rejects: gameState.rejects + 1,
                [`teamVote/${gameState.currentQuest}/${gameState.currentTeamVote}`]: gameIn
                    .teamVote[gameState.currentQuest][
                    gameState.currentTeamVote
                ],
            }),
        ]);
    } else if (
        gameState.phase === 'voteQuest' &&
        Object.values(gameIn.questVote).length ===
            gameState.quests[gameState.currentQuest]
    ) {
        const reqFails =
            gameState.numPlayers >= 7 && gameState.currentQuest === 3 ? 2 : 1;
        const fails = Object.values(gameIn.questVote).filter((v) => !v).length;
        const oldQuestResults = gameState.questResults ?? [];
        const gameUpdate = {
            phase: 'decision',
            questResults: oldQuestResults.concat(fails < reqFails),
            questVote: Object.values(gameIn.questVote),
        };

        return Promise.all([
            gameRef.update(gameUpdate),
            gameInRef.update({ ready: [] }),
        ]);
    } else if (
        gameState.phase === 'decision' &&
        Object.values(gameIn.ready).length === gameState.numPlayers
    ) {
        // all quests are done
        // bad guys auto-win
        if (gameState.questResults.filter((x) => !x).length >= 3) {
            return gameRef.update({
                phase: 'end',
                finalResult: 'bad',
            });
        }
        // assassin phase
        if (gameState.questResults.filter((x) => x).length >= 3) {
            return gameRef.update({
                phase: 'assassin',
            });
        }
        // if lady of the lake is active
        if (
            gameState.lady &&
            gameState.currentQuest > 0 &&
            gameState.currentQuest < 4
        ) {
            return Promise.all([
                gameRef.update({
                    phase: 'ladyPick',
                }),
                gameInRef.update({ ready: [] }),
            ]);
        }
        // otherwise
        if (gameState.currentQuest <= 3) {
            return gameRef.update({
                phase: 'turn',
                currentTurn: (gameState.currentTurn + 1) % gameState.numPlayers,
                currentQuest: gameState.currentQuest + 1,
                currentTeamVote: 0,
                rejects: 0,
            });
        }
    } else if (
        gameState.phase === 'ladyPick' &&
        gameIn.lady &&
        gameIn.lady.length > gameState.currentQuest
    ) {
        return gameRef.update({
            phase: 'ladyReveal',
            lady: gameState.lady?.concat(gameIn.lady[gameIn.lady.length - 1]),
        });
    } else if (
        gameState.phase === 'ladyReveal' &&
        gameIn.ready[(gameState.lady ?? [])[gameState.currentQuest - 1]]
    ) {
        return Promise.all([
            gameRef.update({
                phase: 'turn',
                currentTurn: (gameState.currentTurn + 1) % gameState.numPlayers,
                currentQuest: gameState.currentQuest + 1,
                currentTeamVote: 0,
                rejects: 0,
            }),
            gameInRef.update({
                questVote: [],
                teamVote: [],
            }),
        ]);
    } else if (gameState.phase === 'assassin' && gameIn.assassinPick) {
        if (
            gameIn.assassinPick.length === 1 &&
            gameIn.assassinPick[0] ===
                gameState.players.find((p) => p.role === 'merlin')?.uid
        ) {
            return gameRef.update({
                phase: 'end',
                assassinPick: gameIn.assassinPick,
                finalResult: 'bad',
            });
        }
        const lovers = gameState.players.filter(
            (p) => p.role === 'tristan' || p.role === 'iseult',
        );
        if (
            gameIn.assassinPick.length === 2 &&
            lovers.every((p) => gameIn.assassinPick.includes(p.uid))
        ) {
            return gameRef.update({
                phase: 'end',
                assassinPick: gameIn.assassinPick,
                finalResult: 'bad',
            });
        }
        return gameRef.update({
            phase: 'end',
            assassinPick: gameIn.assassinPick,
            finalResult: 'good',
        });
    }
    return null;
};
