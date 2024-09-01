export const GameScene = () => {
    const scene = new ex.Scene();

    const lava = new ex.Actor({
        pos: new ex.Vector(400, 575),
        width: 800,
        height: 50,
        color: ex.Color.Red,
        collisionType: ex.CollisionType.Fixed,
    });

    const player = new ex.Actor({
        pos: new ex.Vector(400, 300),
        width: 50,
        height: 50,
        color: ex.Color.Blue,
        collisionType: ex.CollisionType.Active,
        useGravity: true,
    });

    scene.add(lava);
    scene.add(player);

    scene.camera.x = 400;
    scene.camera.y = 300;

    return scene;
};