import {Color, DisplayMode, Engine, Keys, Loader} from "excalibur";
import {Resources} from "./game/resources";
import {GameScene} from "./game/scenes/gamescene";
import {EmptyScene} from "./game/scenes/emptyscene";
import {Ui} from "./ui";
import {Leaderboard} from "./api/leaderboard";

// Resource loader
const loader = new Loader();
Object.values(Resources.image).forEach(loader.addResource.bind(loader));
Object.values(Resources.music).forEach(loader.addResource.bind(loader));

// Game engine
const game = new Engine({
    canvasElementId: 'game',
    fixedUpdateFps: 60,
    backgroundColor: Color.fromHex("#202020"),
    displayMode: DisplayMode.Fixed,
    pixelArt: true,
});

// Scenes
game.add("empty", new EmptyScene());

// Listen to global events
game.input.keyboard.on('down', (evt: any) => {
    // Escape to pause the game
    if (evt.key === Keys.Escape) {
        window["PauseGame"]();
    }

    // P to toggle debug mode
    if (evt.key === Keys.P) {
        game.toggleDebug();
    }
});

// game.input.pointers.primary.on('wheel', (evt: any) => {
//     // Zoom in/out
//     if (evt.deltaY > 0) {
//         game.currentScene.camera.zoom *= 0.9;
//     } else {
//         game.currentScene.camera.zoom *= 1.1;
//     }
// });

// Start the game
game.start(loader).then(() => window["StartGame"]());

window["StartGame"] = () => {
    window["UpdateLeaderboard"]();
    Ui.SetUiOverlayVisibility(true);
    game.add("game", new GameScene());
    void game.goToScene("game");
};

window["GameOver"] = (score: number) => {
    Ui.SetUiOverlayVisibility(false);
    Ui.SetGameOverOverlayVisibility(true);
    Ui.SetLeaderboardOverlayVisibility(true);
    game.goToScene("empty").then(() => {
        game.removeScene("game");
    });
};

window["PlayAgain"] = () => {
    Ui.SetGameOverOverlayVisibility(false);
    Ui.SetLeaderboardOverlayVisibility(false);
    window["StartGame"]();
};

window["PauseGame"] = () => {
    Ui.SetUiOverlayVisibility(false);
    Ui.SetPauseOverlayVisibility(true);
    Ui.SetLeaderboardOverlayVisibility(true);
    game.stop();
};

window["ResumeGame"] = () => {
    Ui.SetPauseOverlayVisibility(false);
    Ui.SetLeaderboardOverlayVisibility(false);
    Ui.SetUiOverlayVisibility(true);
    void game.start();
};

window["UpdateLeaderboard"] = () => {
    Ui.UpdateLeaderboard([]);
    Leaderboard.GetLeaderboard()
        .then((board) => {
            Ui.UpdateLeaderboard(board.items);
        });
    Ui.UpdateHighScore('-', '-');
    Leaderboard.GetHighScore()
        .then((res) => {
            Ui.UpdateHighScore(res.score, res.rank);
        });
};
