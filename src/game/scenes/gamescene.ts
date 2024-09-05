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

    private wasClose = false;
    private timerunning = 0;
    private timelimit = 30;
    private scoretimer: Timer;
    private platforms: Platform[] = [];

    onInitialize(engine: Engine) {
        Ui.UpdateScore(this.score);
        Ui.UpdateTime(this.timerunning, false);
        Ui.UpdateTimeLimit(this.timelimit);

        // Add score timer
        this.scoretimer = new Timer({
            fcn: this.updateScore.bind(this),
            repeats: true,
            interval: Config.ScoreTimerInterval,
        });
        this.add(this.scoretimer);

        // Add environment
        this.environment = new Environment();
        this.add(this.environment);

        // Add player & camera
        this.player = new Player(this.onDie.bind(this), this.onWin.bind(this));
        this.player.pos = new Vector(-Config.LevelLength / 2 + 200, Config.PlatformHeight - 200);
        this.add(this.player);
        this.camera.strategy.elasticToActor(this.player, 0.1, 0.1);

        // Add platforms for level
        this.fillLevel();
        this.startScene();
    }

    private onDie() {
        // Stop the timer
        this.scoretimer.stop();
        this.player.isPaused = true;

        // Zoom in the camera over 1 second
        void this.camera.zoomOverTime(Config.CameraZoomOnDeath, Config.GameOverDelay);

        // Play Death sound
        void Resources.music.Death.play(Config.volume);

        // Wait delay then call GameOver
        const timer = new Timer({
            fcn: () => window["GameOver"](this.score),
            repeats: false,
            interval: Config.GameOverDelay,
        });
        this.add(timer);
        timer.start();
    };

    private onWin() {
        // Stop the timer
        this.scoretimer.stop();
        this.player.isPaused = true;

        // Play win sound
        void Resources.music.LevelComplete.play(Config.volume);

        // Stop the timer
        this.score += this.timerunning * (this.level + 1);
        Ui.UpdateScore(this.score);
        Leaderboard.SubmitScore(this.score)
            .then(() => {
                Leaderboard.GetHighScore().then((res) => {
                    Ui.UpdateHighScore(res.score, res.rank);
                });
            });

        // Animate the camera rotation
        this.animateLevelComplete();
    };

    private fillLevel() {
        // Zoom in
        this.camera.zoom = Math.min(Config.CameraMaxZoom, Config.CameraStartZoom + this.level * Config.CameraZoomIncrement);

        // Platforms
        this.platforms = [
            new Platform("base", this.level, new Vector(-Config.LevelLength / 2 + 200, Config.PlatformHeight)),
            new Platform("base", this.level, new Vector(+Config.LevelLength / 2 - 200, Config.PlatformHeight)),
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
            const ppos = new Vector(-Config.LevelLength / 2 + 400 + 250 + 500 * i, Config.PlatformHeight);
            this.platforms.push(new Platform(type, this.level, ppos));
        }
        this.platforms.forEach(this.add.bind(this));
    }

    private startScene() {
        this.wasClose = false;
        this.timerunning = 0;
        this.timelimit = Math.max(5, 30 - this.level / 2);
        this.player.isPaused = false;
        this.scoretimer.reset();
        this.scoretimer.start();
        Ui.UpdateTimeLimit(this.timelimit);
    }

    private animateLevelComplete() {
        // This timer animates the camera rotation from -45° to 0°
        const backward = new Timer({
            fcn: () => {
                this.camera.rotation += (Math.PI / 4) / (Config.LevelChangeDuration / 2 / Config.LevelChangeAnimInterval);
                this.player.rotation = -this.camera.rotation;
                if (this.camera.rotation >= 0) {
                    backward.stop();
                    this.camera.rotation = 0;
                    this.player.rotation = -this.camera.rotation;
                    this.startScene();
                }
            },
            repeats: true,
            interval: Config.LevelChangeAnimInterval,
        });

        // This timer animates the camera rotation from 0° to 45°
        const forward = new Timer({
            fcn: () => {
                this.camera.rotation += (Math.PI / 4) / (Config.LevelChangeDuration / 2 / Config.LevelChangeAnimInterval);
                this.player.rotation = -this.camera.rotation;
                if (this.camera.rotation >= Math.PI / 4) {
                    forward.stop();
                    backward.start();
                    this.onLevelSwitch();
                }
            },
            repeats: true,
            interval: Config.LevelChangeAnimInterval,
        });

        // Add the timers to the scene
        this.add(forward);
        this.add(backward);

        // Start the forward timer
        forward.start();

        // Animate platforms going away
        this.platforms.forEach((p) => p.hide(Config.LevelChangeDuration / 2));
    }

    private onLevelSwitch() {
        // Save current camera rotation (~45°)
        const rot = this.camera.rotation;

        // Remove all platforms
        this.platforms.forEach((p) => p.kill());

        // Move player to start position
        const px = this.player.pos.x;
        const py = this.player.pos.y;
        this.player.pos.x = -py;
        this.player.pos.y = px;

        // Move camera to player
        this.camera.pos = this.player.pos;

        // Increase level
        this.level++;
        this.fillLevel();

        // Restore camera rotation (reverse)
        this.camera.rotation = -rot;

        // Set platforms to invisible
        this.platforms.forEach((p) => p.hide(0));

        // Animate platforms coming back
        this.platforms.forEach((p) => p.show(Config.LevelChangeDuration / 2));

        // Rotate environment to keep the illusion
        this.environment.rotateToLevel(this.level);
    }

    private updateScore() {
        // Update time
        this.timerunning += Config.ScoreTimerInterval;

        // Update UI
        const time = this.timerunning / 1000;
        const close = time >= (this.timelimit * Config.TimeThresholdForClose); // only 25% time left
        Ui.UpdateTime(time, close);

        // Play danger sound (once)
        if (close && !this.wasClose) {
            this.wasClose = true;
            void Resources.music.Danger.play(Config.volume);
        }

        // Check if time is up
        if (time >= this.timelimit) {
            this.player.die();
        }
    }
}
