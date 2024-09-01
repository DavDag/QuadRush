import { CreatePlatform, PLATFORM_PATTERNS } from "./platform.js";
import { CreatePlayer } from "./player.js";

export function CreateGameScene() {
    const scene = new ex.Scene();

    const lava = new ex.Actor({
        name: 'lava',
        pos: new ex.Vector(400, 575),
        width: 1600,
        height: 50,
        color: ex.Color.Red,
        collisionType: ex.CollisionType.Fixed,
    });

    scene.add(lava);

    const player = CreatePlayer();
    scene.add(player);
    scene.camera.clearAllStrategies();
    scene.camera.strategy.elasticToActor(player, 0.1, 0.1);
    scene.camera.strategy.limitCameraBounds(new ex.BoundingBox(0, 0, 1600, 600));

    scene.level = 0;
    const fillLevel = () => {
        const p1 = CreatePlatform(PLATFORM_PATTERNS.base);
        p1.pos = new ex.Vector(400, 500);
        const p2 = CreatePlatform(PLATFORM_PATTERNS.base);
        p2.pos = new ex.Vector(600, 500);
        scene.add(p1);
        scene.add(p2);
    };

    fillLevel();

    return scene;
};