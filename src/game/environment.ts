import {Actor, CollisionType, Color, Scene, Vector} from "excalibur";
import {Config} from "../config";
import {CreatePlatforms} from "./platform";

export class Environment {
    constructor(private scene: Scene) {
        // Lava
        const lavaL = new Actor({
            name: 'lava',
            pos: new Vector(-250, 0),
            width: 500,
            height: Config.windowHeight * 3,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        const lavaB = new Actor({
            name: 'lava',
            pos: new Vector(Config.levelLength / 2, Config.windowHeight + 250),
            width: Config.levelLength,
            height: 500,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        const lavaR = new Actor({
            name: 'lava',
            pos: new Vector(Config.levelLength + 250, 0),
            width: 500,
            height: Config.windowHeight * 3,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        scene.add(lavaL);
        scene.add(lavaB);
        scene.add(lavaR);

        // Start and end platforms
        for (const p of CreatePlatforms(scene, 0, new Vector(0, Config.windowHeight), "start")) {
            scene.add(p);
        }
        for (const p of CreatePlatforms(scene, 0, new Vector(Config.levelLength, Config.windowHeight), "end")) {
            scene.add(p);
        }

    }
}
