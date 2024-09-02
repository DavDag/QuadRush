import { Resources } from "./resources.js";

const SIDE_SPEED = 250;
const JUMP_SPEED = 450;

export function CreatePlayer(OnDie, OnWin) {
    const player = new ex.Actor({
        name: 'player',
        width: 50,
        height: 50,
        color: ex.Color.Blue,
        collisionType: ex.CollisionType.Active,
    });

    player.size = ex.vec(50, 50);
    player.hasWon = false;
    player.isDead = false;
    player.onGround = false;
    player.body.useGravity = false;
    
    player.onPreUpdate = (engine, delta) => {
        if (player.isDead || player.hasWon) return;
        player.vel.x = 0;

        // Remove jumping ability if player is falling
        if (player.vel.y > 0) {
            player.onGround = false;
        }

        // Apply gravity
        player.vel.y += 800 * delta / 1000.0;
    
        // Move left and right
        if(engine.input.keyboard.isHeld(ex.Input.Keys.Left)
            || engine.input.keyboard.isHeld(ex.Input.Keys.A)) {
            player.vel.x = -SIDE_SPEED;
        }
        if(engine.input.keyboard.isHeld(ex.Input.Keys.Right)
            || engine.input.keyboard.isHeld(ex.Input.Keys.D)) {
            player.vel.x = SIDE_SPEED;
        }
    
        // Jump
        if((engine.input.keyboard.isHeld(ex.Input.Keys.Up)
            || engine.input.keyboard.isHeld(ex.Input.Keys.W)
            || engine.input.keyboard.isHeld(ex.Input.Keys.Space))
            && player.onGround) {
            player.vel.y = -JUMP_SPEED;
            player.onGround = false;

            // Play jump sound
            Resources.jump.play(0.1);
        }
    };

    player.onCollisionStart = (self, other, side, contact) => {
        // Check for collision with end platform (winning condition)
        if (other.owner.name === 'platform' && other.owner.pattern === 'end') {
            player.hasWon = true;
            player.body.useGravity = false;
            OnWin();
            player.vel = ex.vec(0, 0);
        }
    };
    
    player.onPostCollisionResolve = (self, other, side, contact) => {
        if (player.isDead || player.hasWon) return;
        //console.debug('Player colliding with:', other.owner.name);
    
        // Check for collision with lava (losing condition)
        if (other.owner.name === 'lava') {
            player.isDead = true;
            player.body.useGravity = false;
            OnDie();
            player.vel = ex.vec(0, 0);
        }
    
        // Check for collision with ground (reset jumping ability)
        if (side === ex.Side.Bottom) {
            player.onGround = true;
        }
    };

    return player;
}