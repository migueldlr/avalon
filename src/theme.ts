const buttonTransition = 'color 0.2s, background-color 0.2s';

export default {
    breakpoints: ['40em', '52em', '65em', '90em'],
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
    sizes: [1, 2, 4, 16, 24, 40, 64, 104],
    // space: [0, 2, 4, 16, 24, 40, 64, 104, 168, 272, 440, 720, 1152, 1920],
    space: [0, 4, 8, 16, 32, 64, 128, 256],
    colors: {
        modes: {
            dark: {
                text: '#c5c8c6',
                background: '#1e1e1e',
                heading: '#f7d35f',
                primary: '#421640',
                yea: '#5AB046',
                nay: '#ad3737',
                disabled: 'rgba(255,255,255,0.7)',
                button: {
                    primary: '#420c40',
                    disabled: '#6B3F69',
                    hover: '#5C2C5A',
                    selected: '#2B0F2A',
                    alt: '#6B3F69',
                    altbg: 'rgba(0, 0, 0, 0.2)',
                },
                checkbox: '#c5c8c6',
                outline: '#8c8c8c',
                outlinefocused: '#262626',
                // hover
                // selected
                // button:
            },
        },
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
        outlinefocused: '#aeaeae',
        outline: '#262626',
        button: {
            hover: '#8b53bc',
            // selected:
            disabled: '#734F8F',
            alt: '#4a266a',
            altbg: 'transparent',
        },
        disabled: 'rgba(255,255,255,0.7)',
    },
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
        legend: {
            fontSize: 0,
        },
        heading: {
            fontSize: [5, 6, 7],
            color: 'heading',
        },
        fancy: {
            display: 'inline',
            fontFamily: 'heading',
            fontWeight: '700',
            color: 'heading',
        },
        bold: {
            display: 'inline',
            fontWeight: '700',
        },

        sub: {
            fontSize: [4, 5, 6],
            // color: 'heading',
        },
        sub2: {
            fontSize: [3, 4, 5],
            pt: 3,
            // color: 'heading',
        },
        sub3: {
            fontSize: [2, 3, 4],
            pt: 2,
            // color: 'heading',
        },
    },
    styles: {
        root: {
            // uses the theme values provided above
            fontFamily: 'body',
            fontWeight: 'body',
            minHeight: '100vh',
            transition: 'background-color 0.5s ease-in-out',
        },
        center: {
            alignItems: 'center',
            flexDirection: 'column',
        },
    },
    buttons: {
        primary: {
            transition: buttonTransition,
            fontFamily: 'heading',
            '&:hover': {
                bg: 'button.hover',
            },
            '&:focus': {
                bg: 'button.hover',
                outline: 'none',
            },
        },
        alt: {
            transition: buttonTransition,
            fontFamily: 'heading',
            bg: 'button.altbg',
            color: 'button.alt',
            border: 'solid black 1px',
            borderColor: 'button.alt',
            borderWidth: 1,
        },
        disabled: {
            transition: buttonTransition,
            fontFamily: 'heading',
            bg: 'button.disabled',
            color: 'disabled',
        },
        selected: {
            transition: buttonTransition,
            fontFamily: 'heading',
            bg: 'button.selecteds',
        },
    },
    forms: {
        checkboxdisabled: {
            'input:checked ~ &': { color: 'gray.8' },
        },
        checkbox: {
            '&:focus': { outline: 'none' },
            'input:checked ~ &': { color: 'checkbox' },
        },
        input: {
            fontFamily: 'body',
            borderColor: 'outline',
            outline: 'none',
            transition: 'border-color 0.2s',
            '&:focus': {
                borderColor: 'outlineFocused',
            },
        },
    },
};
