import {Color, DisplayMode, Engine, Keys, Loader} from "excalibur";
import {Resources} from "./game/resources";
import {GameScene} from "./game/scenes/gamescene";
import {EmptyScene} from "./game/scenes/emptyscene";
import {Ui} from "./ui";

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

// Start the game
game.start(loader).then(() => {
    window["StartGame"]();
});

window["StartGame"] = () => {
    Ui.SetUiOverlayVisibility(true);
    game.add("game", new GameScene());
    void game.goToScene("game");
};

window["GameOver"] = (score: number) => {
    Ui.SetGameOverOverlayVisibility(true);
    Ui.SetUiOverlayVisibility(false);
    game.goToScene("empty").then(() => {
        game.removeScene("game");
    });
};

window["PlayAgain"] = () => {
    Ui.SetGameOverOverlayVisibility(false);
    Ui.SetUiOverlayVisibility(true);
    game.add("game", new GameScene());
    void game.goToScene('game');
};

window["PauseGame"] = () => {
    Ui.SetPauseOverlayVisibility(true);
    Ui.SetUiOverlayVisibility(false);
    game.stop();
};

window["ResumeGame"] = () => {
    Ui.SetPauseOverlayVisibility(false);
    Ui.SetUiOverlayVisibility(true);
    void game.start();
};
