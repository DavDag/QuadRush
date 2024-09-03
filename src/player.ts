import {Resources} from "./resources";
import {Actor, CollisionType, Color, Keys, Side, Vector} from "excalibur";

const DASH_POWER = 2;
const DASH_DURATION = 500;
const SIDE_SPEED = 250;
const JUMP_SPEED = 450;

export function CreatePlayer(OnDie: () => void, OnWin: () => void) {
    const player = new Actor({
        name: 'player',
        width: 50,
        height: 50,
        color: Color.Blue,
        collisionType: CollisionType.Active,
    });

    player["size"] = new Vector(50, 50);
    player["hasWon"] = false;
    player["isDead"] = false;
    player["isPaused"] = true;
    player["onGround"] = false;
    player["hasDash"] = false;
    player["isDashing"] = 0;

    player.onPreUpdate = (engine, delta) => {
        if (player["isDead"] || player["hasWon"] || player["isPaused"]) return;

        // Apply gravity
        player.vel.y += 800 * delta / 1000.0;

        // Reduce dash duration
        if (player["isDashing"] > 0) {
            player["isDashing"] -= delta;
            if (player["isDashing"] <= 0) {
                player["isDashing"] = 0;
            }
        }

        // Move left and right
        if (engine.input.keyboard.isHeld(Keys.Left)
            || engine.input.keyboard.isHeld(Keys.A)) {
            if (player["isDashing"] > 0 && player.vel.x > 0) {
                player["isDashing"] = 0;
            }
            player.vel.x = -SIDE_SPEED * (player["isDashing"] > 0 ? DASH_POWER : 1);
        } else if (engine.input.keyboard.isHeld(Keys.Right)
            || engine.input.keyboard.isHeld(Keys.D)) {
            if (player["isDashing"] > 0 && player.vel.x < 0) {
                player["isDashing"] = 0;
            }
            player.vel.x = SIDE_SPEED * (player["isDashing"] > 0 ? DASH_POWER : 1);
        } else {
            player.vel.x = 0;
        }

        // Jump
        if ((engine.input.keyboard.isHeld(Keys.Up)
                || engine.input.keyboard.isHeld(Keys.W)
                || engine.input.keyboard.isHeld(Keys.Space))
            && player["onGround"]) {
            player.vel.y = -JUMP_SPEED;
            player["onGround"] = false;

            // Play jump sound
            void Resources.jump.play(window["volume"]);
        }

        // Dash
        if (engine.input.keyboard.isHeld(Keys.ShiftLeft)
            && player["hasDash"]) {
            player["isDashing"] = DASH_DURATION;
            player["hasDash"] = false;

            // Play dash sound
            void Resources.dash.play(window["volume"]);
        }
    };

    player.onCollisionStart = (_, other, __, ___) => {
        if (player["isDead"] || player["hasWon"] || player["isPaused"]) return;

        // Check for collision with end platform (winning condition)
        if (other.owner.name === 'platform' && other.owner["pattern"] === 'end') {
            player["hasWon"] = true;
            player["isPaused"] = true;
            OnWin();
            player.vel = new Vector(0, 0);
        }
    };

    player["Die"] = () => {
        player["isDead"] = true;
        player["isPaused"] = true;
        OnDie();
        player.vel = new Vector(0, 0);
    };

    player.onPostCollisionResolve = (_, other, side, __) => {
        if (player["isDead"] || player["hasWon"] || player["isPaused"]) return;

        // Check for collision with lava (losing condition)
        if (other.owner.name === 'lava') {
            player["Die"]();
        }

        // Check for collision with ground (reset jumping ability)
        if (side === Side.Bottom) {
            player["onGround"] = true;
            if (player["isDashing"] == 0) {
                player["hasDash"] = true;
            }
        }
    };

    return player;
}
