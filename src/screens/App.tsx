import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex } from 'theme-ui';

import { auth } from '../firebase/index';
import { establishPresence } from '../firebase/presence';

import { AppState } from '../store/index';

import Home from './Home';
import Lobby from './Lobby';

interface AppProps {
    roomId?: String;
}

const App: React.FC<AppProps> = ({ roomId }) => {
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
            });
    }, []);

    return (
        <Flex
            sx={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}>
            {roomId ? <Lobby /> : <Home />}
        </Flex>
    );
};

export default connect(
    (state: AppState) => ({ roomId: state.rooms.roomId }),
    null,
)(App);
