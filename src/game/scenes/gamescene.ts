import {Leaderboard} from "../../api/leaderboard";
import {CreatePlatforms} from "../platform";
import {Player} from "../player";
import {Resources} from "../resources";
import {Actor, Color, Engine, Scene, Timer, Vector} from "excalibur";
import {Config} from "../../config";
import {Ui} from "../../ui";
import {Environment} from "../environment";

export class GameScene extends Scene {

    private player: Player;
    private environment: Environment;
    private score = 0;
    private level = 0;

    private playerPos = new Vector(200, 400);
    private playerVel = new Vector(0, 0);
    private wasClose = false;
    private timerunning = 0;
    private timelimit = 30;
    private scoretimer: Timer;
    private platforms: Actor[] = [];

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        Ui.UpdateScore(this.score);
        Ui.UpdateTime(this.timerunning, false);
        Ui.UpdateTimeLimit(this.timelimit);

        this.scoretimer = new Timer({
            fcn: () => {
                this.timerunning += 100;
                const time = this.timerunning / 1000;
                const close = time >= (this.timelimit * 0.75); // only 25% time left
                Ui.UpdateTime(time, close);

                if (close && !this.wasClose) {
                    this.wasClose = true;
                    void Resources.danger.play(Config.volume);
                }
                if (time >= this.timelimit) {
                    this.player.die();
                    this.onDie();
                }
            },
            repeats: true,
            interval: 100,
        });
        this.add(this.scoretimer);

        this.environment = new Environment(this);

        this.fillLevel();
        this.startScene();
    }

    private onDie() {
        // Stop the timer
        this.scoretimer.stop();
        this.player.isPaused = true;

        // Zoom in the camera over 1 second
        void this.camera.zoomOverTime(2, 1000);

        // Play death sound
        void Resources.death.play(Config.volume);

        // Wait 1-second then call GameOver
        const timer = new Timer({
            fcn: () => {
                window["GameOver"](this.score);
            },
            repeats: false,
            interval: 1000,
        });
        this.add(timer);
        timer.start();
    };

    private onWin() {
        // Stop the timer
        this.scoretimer.stop();
        this.player.isPaused = true;

        // Play win sound
        void Resources.levelcomplete.play(Config.volume);

        // Stop the timer
        this.score += this.timerunning * (this.level + 1);
        Ui.UpdateScore(this.score);
        Leaderboard.SubmitScore(this.score)
            .then(() => {
                Leaderboard.GetHighScore().then((res) => {
                    Ui.UpdateHighScore(res.score, res.rank);
                });
            });

        // Position the camera right to rotate properly
        this.playerPos.x = Config.windowHeight - this.player.pos.y;
        this.playerPos.y = Config.platformHeight - (Config.levelLength - this.player.pos.x) + this.player.height;
        this.player.vel = new Vector(0, 0);

        const timer2 = new Timer({
            fcn: () => {
                for (const p of this.platforms) {
                    p.color = new Color(p.color.r, p.color.g, p.color.b, p.color.a + 1 / 100);
                }
                this.camera.rotation += (Math.PI / 4) / 100;
                if (this.camera.rotation >= 0) {
                    this.camera.rotation = 0;
                    this.startScene();
                    timer2.stop();
                }
            },
            repeats: true,
            interval: 10,
        });

        const timer = new Timer({
            fcn: () => {
                for (const p of this.platforms) {
                    p.color = new Color(p.color.r, p.color.g, p.color.b, p.color.a - 1 / 100);
                }
                this.camera.rotation += (Math.PI / 4) / 100;
                if (this.camera.rotation >= Math.PI / 4) {
                    const rot = this.camera.rotation;
                    for (const p of this.platforms) {
                        p.kill();
                    }
                    this.player.kill();
                    this.level++;
                    this.fillLevel();

                    this.camera.rotation = -rot;
                    for (const p of this.platforms) {
                        p.color = new Color(p.color.r, p.color.g, p.color.b, 0);
                    }
                    timer2.start();
                    timer.stop();
                }
            },
            repeats: true,
            interval: 10,
        });

        this.add(timer);
        this.add(timer2);
        timer.start();
    };

    private fillLevel() {
        // Recreate player
        this.player = new Player(this.onDie.bind(this), this.onWin.bind(this));
        this.add(this.player);
        this.player.pos = this.playerPos;
        this.player.vel = this.playerVel;
        this.camera.pos = this.playerPos;
        this.camera.clearAllStrategies();
        this.camera.strategy.elasticToActor(this.player, 0.1, 0.1);

        // Platforms
        this.platforms = [];
        for (const p of CreatePlatforms(this, this.level, new Vector(200, Config.platformHeight), "base")) {
            this.add(p);
            this.platforms.push(p);
        }
        for (const p of CreatePlatforms(this, this.level, new Vector(Config.levelLength - 200, Config.platformHeight), "base")) {
            this.add(p);
            this.platforms.push(p);
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
            for (const p of CreatePlatforms(this, this.level, new Vector(400 + 250 + 500 * i, Config.platformHeight), type)) {
                this.add(p);
                this.platforms.push(p);
            }
        }
    };

    private startScene() {
        this.wasClose = false;
        this.timerunning = 0;
        this.timelimit = Math.max(5, 30 - this.level / 2);
        this.player.isPaused = false;
        this.scoretimer.reset();
        this.scoretimer.start();
        Ui.UpdateTimeLimit(this.timelimit);
    }
}
