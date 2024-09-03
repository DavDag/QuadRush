import {Color, DisplayMode, Engine, Keys, Loader, Scene} from "excalibur";
import {Resources} from "./resources";
import {CreateGameScene} from "./gamescene";

// Global settings
window["volume"] = 0.5;

// Resource loader
const loader = new Loader();
for (const res in Resources) {
    loader.addResource(Resources[res]);
}

// Game engine
const game = new Engine({
    canvasElementId: 'game',
    antialiasing: false,
    fixedUpdateFps: 60,
    backgroundColor: Color.fromHex('#5fcde4'),
    displayMode: DisplayMode.Fixed,
});

// Empty scene
const emptyScene = new Scene();
game.add("empty", emptyScene);

// Start the game
game.start(loader).then(() => {
    // console.debug('Engine started');

    window["StartGame"]();
    // window.GameOver(128);
});

// Global functions

window["StartGame"] = () => {
    document.getElementById('ui-overlay').style.display = 'flex';

    // console.debug('Starting game');
    game.add("game", CreateGameScene());
    void game.goToScene("game");
};

window["GameOver"] = (score: number) => {
    document.getElementById('game-over').style.display = 'flex';
    document.getElementById('ui-overlay').style.display = 'none';
    document.getElementById('game-over-score').innerText = score.toString();

    // console.debug('Game over');
    game.goToScene("empty").then(() => {
        game.removeScene("game");
    });
};

window["PlayAgain"] = () => {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('ui-overlay').style.display = 'flex';

    // console.debug('Restarting game');
    game.add("game", CreateGameScene());
    void game.goToScene('game');
};

window["PauseGame"] = () => {
    document.getElementById('pause-overlay').style.display = 'flex';
    document.getElementById('ui-overlay').style.display = 'none';

    // console.debug('Pausing game');
    game.stop();
};

window["ResumeGame"] = () => {
    document.getElementById('pause-overlay').style.display = 'none';
    document.getElementById('ui-overlay').style.display = 'flex';

    // console.debug('Resuming game');
    void game.start();
};

window["UpdateTimeLimitUI"] = (timelimit: number) => {
    // Format time as MM:SS:MS
    const minutes = Math.floor(timelimit / 60);
    const seconds = Math.floor(timelimit % 60);
    const milliseconds = Math.floor((timelimit % 1) * 100);

    // Update time display
    document.getElementById('timelimit').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
};

window["UpdateTimerUI"] = (time: number, close: boolean) => {
    // Format time as MM:SS:MS
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);

    // Update time display
    document.getElementById('time').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;

    // Add 'close' class if time is close to limit
    document.getElementById('time').classList.toggle('close', close);
};

window["UpdateScoreUI"] = (score: number) => {
    document.getElementById('score').innerText = score.toString();
};

window["UpdateHighscoreUI"] = (score: number, rank: number) => {
    document.getElementById('high-score').innerText = score.toString();
    document.getElementById('rank').innerText = rank.toString();
};

// Listen to ESC key
game.input.keyboard.on('down', (evt: any) => {
    if (evt.key === Keys.Escape) {
        window["PauseGame"]();
    }
});
