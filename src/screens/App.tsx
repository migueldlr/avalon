import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex } from 'theme-ui';

import { auth } from '../firebase/index';
import { establishPresence } from '../firebase/presence';
import { joinGame } from '../store/game/actions';

import { AppState } from '../store/index';

import Home from './Home';
import Lobby from './Lobby';
import Game from './Game';
import { dbRejoinGame } from '../firebase/game';

interface AppProps {
    roomId: string | null;
    inGame?: boolean;
    joinGame: typeof joinGame;
}

const App: React.FC<AppProps> = ({ roomId, inGame, joinGame }) => {
    useEffect(() => {
        auth.signInAnonymously()
            .catch((error: { code: any; message: any }) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
                console.log(`${errorCode} ${errorMessage}`);
            })
            .finally(() => {
                establishPresence();
                // const allUserStatus = db.ref(`/status/`);
                // allUserStatus.on('value', (snapshot) => {
                //     console.log(snapshot.val());
                // });
                (async () => {
                    const rejoinGameId = await dbRejoinGame();
                    if (rejoinGameId) {
                        joinGame(rejoinGameId);
                    }
                })();
            });
    }, [joinGame]);
    console.log(`App.tsx gameId: `);

    return (
        <Flex
            sx={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}>
            {inGame ? <Game /> : roomId ? <Lobby /> : <Home />}
        </Flex>
    );
};

export default connect(
    (state: AppState) => ({
        roomId: state.rooms.roomId,
        inGame: state.game.gameId != null,
    }),
    { joinGame },
)(App);
