import { Leaderboard } from "./leaderboard.js";
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
    let wasClose = false;
    let timerunning = 0;
    let timelimit = 30;
    let score = 0;

    window.UpdateScoreUI(0);
    window.UpdateTimerUI(0, false);
    window.UpdateTimeLimitUI(timelimit);

    const scoretimer = new ex.Timer({
        fcn: () => {
            timerunning += 100;
            const time = timerunning / 1000;
            const close = time >= (timelimit * 0.75); // only 25% time left
            window.UpdateTimerUI(time, close);

            if (close && !wasClose) {
                wasClose = true;
                Resources.danger.play(window.volume);
            }
            if (time >= timelimit) {
                scene.player.Die();
                OnDie();
            }
        },
        repeats: true,
        interval: 100,
    });
    scene.add(scoretimer);

    const OnDie = () => {
        // console.debug('Player died');

        // Stop the timer
        scoretimer.stop();
        scene.player.isPaused = true;

        // Zoom in the camera over 1 second
        // scene.camera.clearAllStrategies();
        scene.camera.zoomOverTime(2, 1000);

        // Play death sound
        Resources.death.play(window.volume);

        // Wait 1 second then call GameOver
        setTimeout(() => {
            window.GameOver(score);
        }, 1000);
    };

    const OnWin = () => {
        // console.debug('Player won');

        // Stop the timer
        scoretimer.stop();
        scene.player.isPaused = true;

        // Play win sound
        Resources.levelcomplete.play(window.volume);

        // Stop the timer
        score += timerunning * (scene.level + 1);
        window.UpdateScoreUI(score);
        if (score > sessionStorage.getItem('high_score')) {
            window.UpdateHighscoreUI(score);
            Leaderboard.SubmitScore(score);
        }

        // Position the camera right to rotate properly
        playerPos.x = WINDOW_HEIGHT - scene.player.pos.y;
        playerPos.y = PLATFORM_HEIGHT - (LEVEL_LENGTH - scene.player.pos.x) + scene.player.size.y;
        scene.player.vel = ex.vec(0, 0);
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
                scene.level++;
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
    for (const p of CreatePlatforms(scene, 0, new ex.Vector(0, WINDOW_HEIGHT), "start")) {
        scene.add(p);
    }
    for (const p of CreatePlatforms(scene, 0, new ex.Vector(LEVEL_LENGTH, WINDOW_HEIGHT), "end")) {
        scene.add(p);
    }

    // Level
    scene.level = 0;
    const fillLevel = () => {
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
        for (const p of CreatePlatforms(scene, scene.level, new ex.Vector(200, PLATFORM_HEIGHT), "base")) {
            scene.add(p);
            scene.platforms.push(p);
        }
        for (const p of CreatePlatforms(scene, scene.level, new ex.Vector(LEVEL_LENGTH - 200, PLATFORM_HEIGHT), "base")) {
            scene.add(p);
            scene.platforms.push(p);
        }
        for (let i = 0; i < 4; i++) {
            const types = [
                "falling.1",
                "falling.2",
                "falling.2.inv",
                "falling.3",
                "falling.4"
            ];
            const type = types[Math.floor(Math.random() * types.length)];
            for (const p of CreatePlatforms(scene, scene.level, new ex.Vector(400 + 250 + 500 * i, PLATFORM_HEIGHT), type)) {
                scene.add(p);
                scene.platforms.push(p);
            }
        }

        // When testing
        // for (const p of CreatePlatforms(scene, scene.level, new ex.Vector(LEVEL_LENGTH / 2, PLATFORM_HEIGHT), "test")) { scene.add(p); scene.platforms.push(p); }

        return () => {
            wasClose = false;
            timerunning = 0;
            timelimit = Math.max(5, 30 - scene.level / 2);
            window.UpdateTimeLimitUI(timelimit);
            player.isPaused = false;
            scoretimer.reset();
            scoretimer.start();
        };
    };
    const startScene = fillLevel();
    startScene();

    return scene;
};