import {Leaderboard} from "../../api/leaderboard";
import {Platform, PlatformPatternType} from "../platform";
import {Player} from "../player";
import {Resources} from "../resources";
import {Engine, Scene, Timer, Vector} from "excalibur";
import {Config} from "../../config";
import {Ui} from "../../ui";
import {Environment} from "../environment";

export class GameScene extends Scene {

    private player: Player;
    private environment: Environment;
    private score = 0;
    private level = 0;

    private playerPos = new Vector(200, Config.PlatformHeight - 200);
    private playerVel = new Vector(0, 0);
    private wasClose = false;
    private timerunning = 0;
    private timelimit = 30;
    private scoretimer: Timer;
    private platforms: Platform[] = [];

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
        this.playerPos.x = -this.player.pos.y;
        this.playerPos.y = Config.PlatformHeight - (Config.LevelLength - this.player.pos.x) + this.player.height;
        this.player.vel = new Vector(0, 0);

        const timer2 = new Timer({
            fcn: () => {
                this.camera.rotation += (Math.PI / 4) / 100;
                if (this.camera.rotation >= 0) {
                    timer2.stop();

                    this.camera.rotation = 0;
                    this.startScene();
                }
            },
            repeats: true,
            interval: 10,
        });

        const timer = new Timer({
            fcn: () => {
                this.camera.rotation += (Math.PI / 4) / 100;
                if (this.camera.rotation >= Math.PI / 4) {
                    timer.stop();

                    const rot = this.camera.rotation;
                    for (const p of this.platforms) {
                        p.kill();
                    }
                    this.player.kill();
                    this.level++;
                    this.fillLevel();

                    this.camera.rotation = -rot;
                    for (const p of this.platforms) {
                        p.hide(0);
                    }
                    timer2.start();

                    for (const p of this.platforms) {
                        p.show(1000);
                    }
                }
            },
            repeats: true,
            interval: 10,
        });

        this.add(timer);
        this.add(timer2);
        timer.start();
        for (const p of this.platforms) {
            p.hide(1000);
        }

        this.environment.animateGoingToNextLevel(1000 * 2);
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
        this.platforms = [
            new Platform("base", this.level, new Vector(200, Config.PlatformHeight)),
            new Platform("base", this.level, new Vector(Config.LevelLength - 200, Config.PlatformHeight)),
        ];
        for (let i = 0; i < 4; i++) {
            const types: PlatformPatternType[] = [
                "falling.1",
                "falling.2",
                "falling.2.inv",
                "falling.3",
                "falling.4"
            ];
            const type: PlatformPatternType = types[Math.floor(Math.random() * types.length)];
            this.platforms.push(new Platform(type, this.level, new Vector(400 + 250 + 500 * i, Config.PlatformHeight)));
        }
        this.platforms.forEach(this.add.bind(this));
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
