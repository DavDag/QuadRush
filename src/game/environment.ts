import {Actor, CollisionType, Color, Scene, Timer, Vector} from "excalibur";
import {Config} from "../config";
import {CreatePlatforms} from "./platform";

export class Environment {

    private lavaL: Actor;
    private lavaB: Actor;
    private lavaR: Actor;

    constructor(private scene: Scene) {
        // Lava
        this.lavaL = new Actor({
            name: 'lava',
            pos: new Vector(-250, 0),
            width: 500,
            height: Config.windowHeight * 3,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        this.lavaB = new Actor({
            name: 'lava',
            pos: new Vector(Config.levelLength / 2, Config.windowHeight + 250),
            width: Config.levelLength,
            height: 500,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        this.lavaR = new Actor({
            name: 'lava',
            pos: new Vector(Config.levelLength + 250, 0),
            width: 500,
            height: Config.windowHeight * 3,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        scene.add(this.lavaL);
        scene.add(this.lavaB);
        scene.add(this.lavaR);

        // Start and end platforms
        for (const p of CreatePlatforms(scene, 0, new Vector(0, Config.windowHeight), "start")) {
            scene.add(p);
        }
        for (const p of CreatePlatforms(scene, 0, new Vector(Config.levelLength, Config.windowHeight), "end")) {
            scene.add(p);
        }
    }

    public animateGoingToNextLevel(time: number) {
        for (const a of [this.lavaL, this.lavaB, this.lavaR]) {
            // TODO: Implement animation
        }
    }
}
