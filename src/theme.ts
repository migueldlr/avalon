export default {
    breakpoints: ['40em', '52em', '64em'],
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
    sizes: [1, 2, 4, 16, 24, 40, 64, 104],
    colors: {
        blue: '#07c',
        lightgray: '#f6f6ff',
        background: 'white',
        primary: '#4a266a',
        gray: {
            4: '#f0f0f0',
            6: '#bfbfbf',
            7: '#8c8c8c',
            8: '#595959',
        },
        yea: '#52c41a',
        nay: '#ffccc7',
    },
    space: [0, 4, 8, 16, 32, 64, 128, 256],
    fonts: {
        body: 'Merriweather, serif',
        heading: 'Cinzel Decorative , serif',
        monospace: 'Menlo, monospace',
    },
    fontWeights: {
        body: 400,
        heading: 700,
        bold: 700,
    },
    lineHeights: {
        body: 1.5,
        heading: 1.25,
    },
    text: {
        fontFamily: 'body',
        fontSize: [4, 3, 2],
        disclaimer: {
            color: 'gray.8',
            fontSize: '10px',
        },
        heading: {
            fontSize: [5, 6, 7],
        },
    },
    styles: {
        root: {
            // uses the theme values provided above
            fontFamily: 'body',
            fontWeight: 'body',
            minHeight: '100vh',
        },
    },
    buttons: {
        primary: {
            fontFamily: 'heading',
            transition: 'color 1s',
            '&:hover': {
                bg: '#8b53bc',
            },
        },
        disabled: {
            fontFamily: 'heading',
            bg: '#dca8ff',
        },
        copy: {
            fontFamily: 'body',
            bg: '#8c44d4',
        },
        selected: {
            fontFamily: 'heading',
            bg: '#2c154a',
        },
    },
    forms: {
        input: {
            fontFamily: 'body',
        },
    },
};
