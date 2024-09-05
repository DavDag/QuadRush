import {Resources} from "./resources";
import {
    Actor,
    Collider,
    CollisionContact,
    CollisionType,
    Color,
    Engine,
    Keys,
    Shape,
    Side,
    Sprite,
    Vector
} from "excalibur";
import {Config} from "../config";
import {MakeThisASceneryObject} from "./graphics/make-scenery-obj";
import {PlatformUnit} from "./platform";

export class Player extends Actor {

    public isPaused = false;
    private onGround = false;
    private hasDash = false;
    private isDashing = 0;

    constructor(private OnDie: () => void, private OnWin: () => void) {
        super({
            name: 'player',
            width: Config.PlayerWidth,
            height: Config.PlayerHeight,
            color: Color.Violet,
            collisionType: CollisionType.Active,
            collider: Shape.Box(50, 50),
        });
    }

    onInitialize(engine: Engine) {
        // Add player sprite
        const sprite = new Sprite({
            image: Resources.image.PaperTexture,
            sourceView: {
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                width: this.width,
                height: this.height,
            },
            destSize: {
                width: this.width,
                height: this.height,
            },
            tint: Config.PlayerColor,
        });
        this.graphics.use(sprite);

        // Make player a scenery object
        MakeThisASceneryObject(this, Config.PlayerZIndex, true, true);
    }

    onPreUpdate(engine: Engine, delta: number) {
        if (this.isPaused) return;

        // Apply Gravity
        this.vel.y += 800 * delta / 1000.0;

        // Reduce dash duration
        if (this.isDashing > 0) {
            this.isDashing -= delta;
            if (this.isDashing <= 0) {
                this.isDashing = 0;
            }
        }

        // Check to reset dash
        if (this.isDashing <= 0 && this.onGround) {
            this.hasDash = true;
        }

        // Move left and right
        if (engine.input.keyboard.isHeld(Keys.Left)
            || engine.input.keyboard.isHeld(Keys.A)) {
            if (this.isDashing > 0 && this.vel.x > 0) {
                this.isDashing = 0;
            }
            this.vel.x = -Config.SideSpeed * (this.isDashing > 0 ? Config.DashPower : 1);
        } else if (engine.input.keyboard.isHeld(Keys.Right)
            || engine.input.keyboard.isHeld(Keys.D)) {
            if (this.isDashing > 0 && this.vel.x < 0) {
                this.isDashing = 0;
            }
            this.vel.x = Config.SideSpeed * (this.isDashing > 0 ? Config.DashPower : 1);
        } else {
            this.vel.x = 0;
        }

        // Jump
        if ((engine.input.keyboard.isHeld(Keys.Up)
                || engine.input.keyboard.isHeld(Keys.W)
                || engine.input.keyboard.isHeld(Keys.Space))
            && this.onGround) {
            this.vel.y = -Config.JumpSpeed;
            this.onGround = false;

            // Play Jump sound
            void Resources.music.Jump.play(Config.volume);
        }

        // Dash
        if (engine.input.keyboard.isHeld(Keys.ShiftLeft)
            && this.hasDash) {
            this.isDashing = Config.DashDuration;
            this.hasDash = false;

            // Play Dash sound
            void Resources.music.Dash.play(Config.volume);
        }
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact) {
        if (this.isPaused) return;

        // Check for collision with end platform (winning condition)
        if (other.owner.name === 'portal.end') {
            this.isPaused = true;
            this.vel = new Vector(0, 0);
            this.OnWin();
        }

        // Check for collision with lava (losing condition)
        if (other.owner.name === 'lava.container') {
            this.die();
            return;
        }

        // Check for collision with ground (reset jumping ability)
        if (other.owner.name === 'platform' && (other.owner as PlatformUnit).pattern !== 'start'
            && side === Side.Bottom) {
            this.onGround = true;
        }
    }

    public die() {
        this.isPaused = true;
        this.vel = new Vector(0, 0);
        this.OnDie();
    };
}
