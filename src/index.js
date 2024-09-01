import { Resources } from "./resources.js";
import { Leaderboard } from "./leaderboard.js";
import { CreateGameScene } from "./gamescene.js";

// Resource loader
const loader = new ex.Loader();
for (const res in Resources) {
    loader.addResource(Resources[res]);
}

// Physics
ex.Physics.gravity = ex.vec(0, 800);

// Game engine
const game = new ex.Engine({
    canvasElementId: 'game',
    antialiasing: false,
    fixedUpdateFps: 60,
    backgroundColor: ex.Color.fromHex('#5fcde4'),
    displayMode: ex.DisplayMode.Fixed,
    pointerScope: ex.Input.PointerScope.Document
});

// Empty scene
const emptyScene = new ex.Scene();
game.add("empty", emptyScene);

// Start the game
game.start(loader).then(() => {
    console.debug('Engine started');

    window.StartGame();
    // window.GameOver(128);
});

window.StartGame = () => {
    document.getElementById('start-game').style.display = 'none';

    console.debug('Starting game');
    game.add("game", CreateGameScene());
    game.goToScene("game");
};

window.GameOver = (score) => {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-score').innerText = score;

    console.debug('Game over');
    game.goToScene("empty").then(() => {
        game.removeScene("game");
    });
};

window.PlayAgain = () => {
    document.getElementById('game-over').style.display = 'none';

    console.debug('Restarting game');
    game.add("game", CreateGameScene());
    game.goToScene('game');
};
