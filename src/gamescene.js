import { CreatePlatforms, PLATFORM_PATTERNS } from "./platform.js";
import { CreatePlayer } from "./player.js";
import { Resources } from "./resources.js";

export function CreateGameScene() {
    const scene = new ex.Scene();

    const OnDie = () => {
        console.debug('Player died');

        // Zoom in the camera over 1 second
        scene.camera.clearAllStrategies();
        scene.camera.zoomOverTime(2, 1000);

        // Wait 1 second then call GameOver
        setTimeout(() => {
            window.GameOver(0);
        }, 1000);
    };
    const OnWin = () => {
        console.debug('Player won');

        // Position the camera right to rotate properly
        scene.camera.clearAllStrategies();
        scene.camera.pos = new ex.Vector(1200, 200);

        // Rotate the camera 90 degrees over 1 second
        const int = setInterval(() => {
            scene.camera.rotation += (Math.PI / 2) / 90;
            if (scene.camera.rotation >= Math.PI / 2) {
                clearInterval(int);
                scene.camera.rotation = 0;
                scene.clear();
                fillLevel();
            }
        }, 1000 / 90);
    };

    // Lava
    const lava = new ex.Actor({
        name: 'lava',
        pos: new ex.Vector(800, 575),
        width: 1600,
        height: 50,
        color: ex.Color.Red,
        collisionType: ex.CollisionType.Fixed,
        /* spriteSheet: ex.SpriteSheet.fromImageSource({
            image: Resources.lava,
            grid: {
                rows: 1,
                columns: 5
            }
        }), */
    });
    scene.add(lava);

    // Level
    scene.level = 0;
    const fillLevel = () => {
        scene.level++;

        // Player
        const player = CreatePlayer(OnDie, OnWin);
        scene.add(player);
        scene.camera.clearAllStrategies();
        scene.camera.strategy.elasticToActor(player, 0.1, 0.1);
        scene.camera.strategy.limitCameraBounds(new ex.BoundingBox(0, -1000, 1600, 600));

        // Platforms
        for (const p of CreatePlatforms(new ex.Vector(500, 500), "base")) {
            scene.add(p);
        }
        for (const p of CreatePlatforms(new ex.Vector(1000, 500), "base")) {
            scene.add(p);
        }
        for (const p of CreatePlatforms(new ex.Vector(1600, 500), "end")) {
            scene.add(p);
        }
    };
    fillLevel();

    return scene;
};