/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import { Box, Text } from 'theme-ui';
import RoleDisplay from './RoleDisplay';

interface Props {}

const RoleViewer = (props: Props) => {
    const [show, setShow] = useState(false);

    return (
        <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Text
                onClick={() => setShow(!show)}
                sx={{ cursor: 'pointer' }}
                variant="legend">
                🔮
            </Text>
            {show ? <RoleDisplay inLegend /> : null}
        </Box>
    );
};

export default RoleViewer;
