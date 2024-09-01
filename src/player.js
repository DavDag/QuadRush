import { Resources } from "./resources.js";

const SIDE_SPEED = 250;
const JUMP_SPEED = 450;

export function CreatePlayer(OnDie, OnWin) {
    const player = new ex.Actor({
        name: 'player',
        pos: new ex.Vector(1200, 300),
        width: 50,
        height: 50,
        color: ex.Color.Blue,
        collisionType: ex.CollisionType.Active,
        useGravity: true,
    });

    player.hasWon = false;
    player.isDead = false;
    player.onGround = true;
    
    player.onPreUpdate = (engine) => {
        player.vel.x = 0;
        if (player.isDead || player.hasWon) return;
    
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

        // Remove jumping ability if player is falling
        if (player.vel.y > 0) {
            player.onGround = false;
        }
    };
    
    player.onPostCollisionResolve = (self, other, side, contact) => {
        if (player.isDead || player.hasWon) return;
        console.debug('Player colliding with:', other.owner.name);
    
        // Check for collision with lava (losing condition)
        if (other.owner.name === 'lava') {
            player.isDead = true;
            OnDie();
        }

        // Check for collision with end platform (winning condition)
        if (other.owner.name === 'platform' && other.owner.pattern === 'end') {
            player.hasWon = true;
            OnWin();
        }
    
        // Check for collision with ground (reset jumping ability)
        if (side === ex.Side.Bottom) {
            player.onGround = true;
        }
    };

    return player;
}