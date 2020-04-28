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
    },
    space: [0, 4, 8, 16, 32, 64, 128, 256],
    fonts: {
        body: 'Roboto, sans-serif',
        heading: 'Nunito',
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
            transition: 'color 1s',
            '&:hover': {
                bg: '#8b53bc',
            },
        },
        disabled: {
            bg: '#dca8ff',
        },
        copy: {
            bg: '#8c44d4',
        },
        selected: {
            bg: '#2c154a',
        },
    },
};
