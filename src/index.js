import { Resources } from "./resources.js";
import { Leaderboard } from "./leaderboard.js";
import { GameScene } from "./gamescene.js";

// Resource loader
const loader = new ex.Loader();
for (res in Resources) {
    loader.addResource(Resources[res]);
}

// Game engine
const game = new ex.Engine({
    canvasElementId: 'game',
    antialiasing: false,
    fixedUpdateFps: 60,
    backgroundColor: ex.Color.White,
    displayMode: ex.DisplayMode.FillContainer,
    pointerScope: ex.Input.PointerScope.Document
});

// Scenes
game.add('game', GameScene);
const emptyscene = new ex.Scene();
game.add('empty', emptyscene);
game.goToScene('empty');

// Physics
ex.Physics.acc = new ex.Vector(0, 800);

// Start the game
game.start(loader).then(() => {
    console.debug('Engine started');
});

window.StartGame = () => {
    document.getElementById('start-game').style.display = 'none';

    console.debug('Starting game');
    game.goToScene('game');
};

window.GameOver = (score) => {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-score').innerText = score;

    console.debug('Game over');
    game.goToScene('empty');
};

window.PlayAgain = () => {
    document.getElementById('game-over').style.display = 'none';

    console.debug('Restarting game');
    game.goToScene('game');
};

// window.StartGame();
// window.GameOver(128);