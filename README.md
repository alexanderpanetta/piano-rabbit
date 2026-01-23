# Piano Rabbit

A fun, interactive piano learning game designed for young children (ages 5-7) playing on tablets.

## Features

- **8 Progressive Levels** - From single notes to simple melodies to playing two notes at once
- **Friendly Rabbit Mascot** - Guides children through lessons with encouraging feedback
- **Medal System** - Gold, Silver, and Bronze medals based on performance
- **Touch Optimized** - Large keys designed for small fingers on tablets
- **Audio Feedback** - Real piano sounds using Tone.js
- **Progress Saving** - Automatically saves progress to localStorage

## Levels

1. **Meet the Keys** - Learn C, D, E, F, G
2. **More Notes!** - Add A, B, and high C
3. **Note Patterns** - 2-note sequences
4. **Little Sequences** - 3-note sequences
5. **Mary's Lamb** - Mary Had a Little Lamb
6. **Twinkle Star** - Twinkle Twinkle Little Star
7. **Joyful Music** - Ode to Joy
8. **Two Notes Together** - Introduction to playing diads

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd piano-rabbit
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment to any static hosting service.

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **Tone.js** - Audio generation

## Architecture

The game is designed with an abstraction layer for note input (`noteInputHandler.js`) that allows for future expansion to support real piano audio detection via microphone.

### Key Files

```
src/
├── components/
│   ├── Piano.jsx           # Interactive piano keyboard
│   ├── Rabbit.jsx          # Animated rabbit mascot
│   ├── GameScreen.jsx      # Main gameplay screen
│   ├── LevelSelect.jsx     # Level selection screen
│   └── ...
├── hooks/
│   ├── useAudio.js         # Tone.js audio management
│   ├── useGameState.js     # Game state management
│   └── useProgress.js      # localStorage persistence
├── utils/
│   ├── noteInputHandler.js # Note input abstraction
│   ├── lessonData.js       # All level definitions
│   └── soundEffects.js     # Sound configurations
└── App.jsx                 # Main app component
```

## Keyboard Support (Desktop)

When playing on desktop, you can use the keyboard:

| Key | Note |
|-----|------|
| A | C4 |
| W | C#4 |
| S | D4 |
| E | D#4 |
| D | E4 |
| F | F4 |
| T | F#4 |
| G | G4 |
| Y | G#4 |
| H | A4 |
| U | A#4 |
| J | B4 |
| K | C5 |

## License

MIT
