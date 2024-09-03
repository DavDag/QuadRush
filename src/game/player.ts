import {Resources} from "./resources";
import {Actor, Collider, CollisionContact, CollisionType, Color, Engine, Keys, Side, Vector} from "excalibur";
import {Config} from "../config";

export class Player extends Actor {

    public isPaused = true;
    private hasWon = false;
    private isDead = false;
    private onGround = false;
    private hasDash = false;
    private isDashing = 0;

    constructor(private OnDie: () => void, private OnWin: () => void) {
        super({
            name: 'player',
            width: 50,
            height: 50,
            color: Color.Blue,
            collisionType: CollisionType.Active
        });
    }

    onPreUpdate(engine: Engine, delta: number) {
        if (this.isDead || this.hasWon || this.isPaused) return;

        // Apply gravity
        this.vel.y += 800 * delta / 1000.0;

        // Reduce dash duration
        if (this.isDashing > 0) {
            this.isDashing -= delta;
            if (this.isDashing <= 0) {
                this.isDashing = 0;
            }
        }
        if (this.isDashing <= 0 && this.onGround) {
            this.hasDash = true;
        }

        // Move left and right
        if (engine.input.keyboard.isHeld(Keys.Left)
            || engine.input.keyboard.isHeld(Keys.A)) {
            if (this.isDashing > 0 && this.vel.x > 0) {
                this.isDashing = 0;
            }
            this.vel.x = -Config.sideSpeed * (this.isDashing > 0 ? Config.dashPower : 1);
        } else if (engine.input.keyboard.isHeld(Keys.Right)
            || engine.input.keyboard.isHeld(Keys.D)) {
            if (this.isDashing > 0 && this.vel.x < 0) {
                this.isDashing = 0;
            }
            this.vel.x = Config.sideSpeed * (this.isDashing > 0 ? Config.dashPower : 1);
        } else {
            this.vel.x = 0;
        }

        // Jump
        if ((engine.input.keyboard.isHeld(Keys.Up)
                || engine.input.keyboard.isHeld(Keys.W)
                || engine.input.keyboard.isHeld(Keys.Space))
            && this.onGround) {
            this.vel.y = -Config.jumpSpeed;
            this.onGround = false;

            // Play jump sound
            void Resources.jump.play(Config.volume);
        }

        // Dash
        if (engine.input.keyboard.isHeld(Keys.ShiftLeft)
            && this.hasDash) {
            this.isDashing = Config.dashDuration;
            this.hasDash = false;

            // Play dash sound
            void Resources.dash.play(Config.volume);
        }
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact) {
        if (this.isDead || this.hasWon || this.isPaused) return;

        // Check for collision with end platform (winning condition)
        if (other.owner.name === 'platform' && other.owner["pattern"] === 'end') {
            this.hasWon = true;
            this.isPaused = true;
            this.vel = new Vector(0, 0);
            this.OnWin();
        }

        // Check for collision with lava (losing condition)
        if (other.owner.name === 'lava') {
            this.die();
            return;
        }

        // Check for collision with ground (reset jumping ability)
        if (side === Side.Bottom) {
            this.onGround = true;
        }
    }

    public die() {
        this.isDead = true;
        this.isPaused = true;
        this.vel = new Vector(0, 0);
        this.OnDie();
    };
}