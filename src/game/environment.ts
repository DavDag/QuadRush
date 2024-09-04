import {Actor, CollisionType, Color, Scene, Vector} from "excalibur";
import {Config} from "../config";
import {Platform} from "./platform";

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
            height: Config.WindowHeight * 3,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        this.lavaB = new Actor({
            name: 'lava',
            pos: new Vector(Config.LevelLength / 2, 250),
            width: Config.LevelLength,
            height: 500,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        this.lavaR = new Actor({
            name: 'lava',
            pos: new Vector(Config.LevelLength + 250, 0),
            width: 500,
            height: Config.WindowHeight * 3,
            color: Color.Red,
            collisionType: CollisionType.Fixed,
        });
        scene.add(this.lavaL);
        scene.add(this.lavaB);
        scene.add(this.lavaR);

        // Start and end platforms
        scene.add(new Platform("start", 0, new Vector(0, 0)));
        scene.add(new Platform("end", 0, new Vector(Config.LevelLength, 0)));
    }

    public animateGoingToNextLevel(time: number) {
        for (const a of [this.lavaL, this.lavaB, this.lavaR]) {
            // TODO: Implement animation
        }
    }
}
