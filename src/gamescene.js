import { CreatePlayer } from "./player.js";

export function CreateGameScene() {
    const scene = new ex.Scene();

    const lava = new ex.Actor({
        name: 'lava',
        pos: new ex.Vector(400, 575),
        width: 800,
        height: 50,
        color: ex.Color.Red,
        collisionType: ex.CollisionType.Fixed,
    });

    scene.add(lava);
    scene.add(CreatePlayer());
    
    scene.camera.x = 400;
    scene.camera.y = 300;

    return scene;
};