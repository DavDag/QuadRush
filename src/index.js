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
    fixedUpdateFps: 60,
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
    document.getElementById('ui-overlay').style.display = 'flex';

    // console.debug('Starting game');
    game.add("game", CreateGameScene());
    game.goToScene("game");
};

window.GameOver = (score) => {
    document.getElementById('game-over').style.display = 'flex';
    document.getElementById('ui-overlay').style.display = 'none';
    document.getElementById('game-over-score').innerText = score;

    // console.debug('Game over');
    game.goToScene("empty").then(() => {
        game.removeScene("game");
    });
};

window.PlayAgain = () => {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('ui-overlay').style.display = 'flex';

    // console.debug('Restarting game');
    game.add("game", CreateGameScene());
    game.goToScene('game');
};

window.PauseGame = () => {
    document.getElementById('pause-overlay').style.display = 'flex';
    document.getElementById('ui-overlay').style.display = 'none';

    // console.debug('Pausing game');
    game.stop();
};

window.ResumeGame = () => {
    document.getElementById('pause-overlay').style.display = 'none';
    document.getElementById('ui-overlay').style.display = 'flex';

    // console.debug('Resuming game');
    game.start();
};

window.UpdateTimeLimitUI = (timelimit) => {
    // Format time as MM:SS:MS
    const minutes = Math.floor(timelimit / 60);
    const seconds = Math.floor(timelimit % 60);
    const milliseconds = Math.floor((timelimit % 1) * 100);

    // Update time display
    document.getElementById('timelimit').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
};

window.UpdateTimerUI = (time, close) => {
    // Format time as MM:SS:MS
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);

    // Update time display
    document.getElementById('time').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;

    // Add 'close' class if time is close to limit
    document.getElementById('time').classList.toggle('close', close);
};

window.UpdateScoreUI = (score) => {
    document.getElementById('score').innerText = score;
};

window.UpdateHighscoreUI = (score, rank) => {
    document.getElementById('high-score').innerText = score;
    document.getElementById('rank').innerText = rank;
};

// Listen to ESC key
game.input.keyboard.on('down', (evt) => {
    if (evt.key === ex.Input.Keys.Escape) {
        window.PauseGame();
    }
});
