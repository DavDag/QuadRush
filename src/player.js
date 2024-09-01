const SIDE_SPEED = 250;
const JUMP_SPEED = 450;

export function CreatePlayer() {
    const player = new ex.Actor({
        name: 'player',
        pos: new ex.Vector(400, 300),
        width: 50,
        height: 50,
        color: ex.Color.Blue,
        collisionType: ex.CollisionType.Active,
        useGravity: true,
    });

    player.onGround = true;
    
    player.onPreUpdate = (engine) => {
        player.vel.x = 0;
    
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
        }
    };
    
    player.onPostCollisionResolve = (self, other, side, contact) => {
        console.debug('Player colliding with:', other.owner.name);
    
        if (other.owner.name === 'lava') {
            window.GameOver(0);
        }
    
        if (side === ex.Side.Bottom) {
            player.onGround = true;
        }
    };

    return player;
}