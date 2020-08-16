/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Grid, Flex } from 'theme-ui';

const NumRoles = () => {
    const roledists = [
        [5, 3, 2],
        [6, 4, 2],
        [7, 4, 3],
        [8, 5, 3],
        [9, 6, 3],
        [10, 6, 4],
    ];
    return (
        <Grid gap={0} columns={3}>
            <Flex variant="styles.center">#</Flex>
            <Flex variant="styles.center">🏰</Flex>
            <Flex variant="styles.center">💀</Flex>
            {roledists.map((roledist) =>
                roledist.map((num) => (
                    <Flex variant="styles.center">{num}</Flex>
                )),
            )}
        </Grid>
    );
};

export default NumRoles;
