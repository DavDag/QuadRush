import { CreatePlatforms, PLATFORM_PATTERNS } from "./platform.js";
import { CreatePlayer } from "./player.js";
import { Resources } from "./resources.js";

const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;
const LEVEL_LENGTH = 2800;
const PLATFORM_HEIGHT = WINDOW_HEIGHT - 50;

export function CreateGameScene() {
    const scene = new ex.Scene();

    let playerPos = new ex.Vector(200, 400);
    let playerVel = ex.vec(0, 0);

    const OnDie = () => {
        // console.debug('Player died');

        // Zoom in the camera over 1 second
        // scene.camera.clearAllStrategies();
        scene.camera.zoomOverTime(2, 1000);

        // Play death sound
        Resources.death.play(window.volume);

        // Wait 1 second then call GameOver
        setTimeout(() => {
            window.GameOver(0);
        }, 1000);
    };

    const OnWin = () => {
        // console.debug('Player won');

        // Position the camera right to rotate properly
        playerPos.x = WINDOW_HEIGHT - scene.player.pos.y;
        playerPos.y = PLATFORM_HEIGHT - (LEVEL_LENGTH - scene.player.pos.x) + scene.player.size.y;
        playerVel.x = scene.player.vel.y;
        playerVel.y = scene.player.vel.x;

        // Rotate the camera 45 degrees
        const int1 = setInterval(() => {
            for (const p of scene.platforms) {
                p.color = new ex.Color(p.color.r, p.color.g, p.color.b, p.color.a - 1 / 100);
            }
            scene.camera.rotation += (Math.PI / 4) / 100;
            if (scene.camera.rotation >= Math.PI / 4) {
                clearInterval(int1);
                const rot = scene.camera.rotation;
                for (const p of scene.platforms) {
                    p.kill();
                }
                scene.player.kill();
                const startScene = fillLevel();
                
                // Rotate the camera 45 degrees
                scene.camera.rotation = -rot;
                for (const p of scene.platforms) {
                    p.color = new ex.Color(p.color.r, p.color.g, p.color.b, 0);
                }
                const int2 = setInterval(() => {
                    for (const p of scene.platforms) {
                        p.color = new ex.Color(p.color.r, p.color.g, p.color.b, p.color.a + 1 / 100);
                    }
                    scene.camera.rotation += (Math.PI / 4) / 100;
                    if (scene.camera.rotation >= 0) {
                        clearInterval(int2);
                        scene.camera.rotation = 0;
                        startScene();
                    }
                }, 10);
            }
        }, 10);
    };

    // Lava
    const lavaL = new ex.Actor({
        name: 'lava',
        pos: new ex.Vector(-250, 0),
        width: 500,
        height: WINDOW_HEIGHT * 3,
        color: ex.Color.Red,
        collisionType: ex.CollisionType.Fixed,
    });
    const lavaB = new ex.Actor({
        name: 'lava',
        pos: new ex.Vector(LEVEL_LENGTH / 2, WINDOW_HEIGHT + 250),
        width: LEVEL_LENGTH,
        height: 500,
        color: ex.Color.Red,
        collisionType: ex.CollisionType.Fixed,
    });
    const lavaR = new ex.Actor({
        name: 'lava',
        pos: new ex.Vector(LEVEL_LENGTH + 250, 0),
        width: 500,
        height: WINDOW_HEIGHT * 3,
        color: ex.Color.Red,
        collisionType: ex.CollisionType.Fixed,
    });
    scene.add(lavaL);
    scene.add(lavaB);
    scene.add(lavaR);

    // Start and end platforms
    for (const p of CreatePlatforms(new ex.Vector(0, WINDOW_HEIGHT), "start")) {
        scene.add(p);
    }
    for (const p of CreatePlatforms(new ex.Vector(LEVEL_LENGTH, WINDOW_HEIGHT), "end")) {
        scene.add(p);
    }

    // Level
    scene.level = 0;
    const fillLevel = () => {
        scene.level++;

        // Player
        const player = CreatePlayer(OnDie, OnWin);
        scene.player = player;
        scene.add(player);
        player.pos = playerPos;
        player.vel = playerVel;
        scene.camera.pos = playerPos;
        scene.camera.clearAllStrategies();
        scene.camera.strategy.elasticToActor(player, 0.1, 0.1);

        // Platforms
        scene.platforms = [];
        for (const p of CreatePlatforms(new ex.Vector(200, PLATFORM_HEIGHT), "base")) {
            scene.add(p);
            scene.platforms.push(p);
        }
        for (const p of CreatePlatforms(new ex.Vector(LEVEL_LENGTH - 200, PLATFORM_HEIGHT), "base")) {
            scene.add(p);
            scene.platforms.push(p);
        }
        for (const p of CreatePlatforms(new ex.Vector(LEVEL_LENGTH / 2, PLATFORM_HEIGHT), "test")) {
            scene.add(p);
            scene.platforms.push(p);
        }

        return () => {
            player.body.useGravity = true;
        };
    };
    const startScene = fillLevel();
    startScene();

    return scene;
};