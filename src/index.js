import { Resources } from "./resources.js";
import { Leaderboard } from "./leaderboard.js";
import { CreateGameScene } from "./gamescene.js";

// Global settings
window.volume = 0.5;

// Resource loader
const loader = new ex.Loader();
for (const res in Resources) {
    loader.addResource(Resources[res]);
}

// Game engine
const game = new ex.Engine({
    canvasElementId: 'game',
    antialiasing: false,
    fixedUpdateFps: 30,
    backgroundColor: ex.Color.fromHex('#5fcde4'),
    displayMode: ex.DisplayMode.Fixed,
    pointerScope: ex.Input.PointerScope.Document,
    physics: {
        // gravity: ex.vec(0, 800),
    },
});

// Empty scene
const emptyScene = new ex.Scene();
game.add("empty", emptyScene);

// Start the game
game.start(loader).then(() => {
    // console.debug('Engine started');

    window.StartGame();
    // window.GameOver(128);
});

// Global functions

window.StartGame = () => {
    // console.debug('Starting game');
    game.add("game", CreateGameScene());
    game.goToScene("game");
};

window.GameOver = (score) => {
    document.getElementById('game-over').style.display = 'flex';
    document.getElementById('game-over-score').innerText = score;

    // console.debug('Game over');
    game.goToScene("empty").then(() => {
        game.removeScene("game");
    });
};

window.PlayAgain = () => {
    document.getElementById('game-over').style.display = 'none';

    // console.debug('Restarting game');
    game.add("game", CreateGameScene());
    game.goToScene('game');
};

// Listen to ESC key
game.input.keyboard.on('down', (evt) => {
    if (evt.key === ex.Input.Keys.Escape) {
        window.PauseGame();
    }
});

window.PauseGame = () => {
    document.getElementById('pause-overlay').style.display = 'flex';

    // console.debug('Pausing game');
    game.stop();
};

window.ResumeGame = () => {
    document.getElementById('pause-overlay').style.display = 'none';

    // console.debug('Resuming game');
    game.start();
};
