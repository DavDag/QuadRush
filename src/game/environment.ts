import {Actor, Color, Engine, ParallaxComponent, Scene, Sprite, Vector} from "excalibur";
import {Config} from "../config";
import {Platform} from "./platform";
import {Resources} from "./resources";
import {MakeThisASceneryObject} from "./graphics/make-scenery-obj";

class VulkanLayer extends Actor {
    constructor(private layer: number) {
        super({
            name: "vulkan.layer",
            pos: Vector.Zero,
            width: Config.VulkanLayerSize,
            height: Config.VulkanLayerSize,
            color: Color.fromHex("#ff000020"),
        });
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        const sprite = new Sprite({
            image: Resources.image.BgLayer1,
            sourceView: {
                x: 0,
                y: 0,
                width: Resources.image.BgLayer1.width,
                height: Resources.image.BgLayer1.height,
            },
            destSize: {
                width: this.width,
                height: this.height,
            },
            tint: [
                Color.fromHex("#666600"),
                Color.fromHex("#888800"),
                Color.fromHex("#aaaa00"),
                Color.fromHex("#cccc00"),
                Color.fromHex("#ffff00"),
            ][this.layer % 5]
        });
        this.graphics.use(sprite);
        this.rotation = Math.PI / 2 * this.layer;

        const p = Math.pow(1.1, this.layer);
        this.addComponent(new ParallaxComponent(new Vector(p, p)));

        const z = Config.VulkanZIndexes[this.layer];
        MakeThisASceneryObject(this, z, false);
    }
}

class Vulkan extends Actor {
    constructor() {
        super({
            name: "vulkan.container",
            pos: Vector.Zero
        });
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        for (let i = 0; i < Config.VulkanZIndexes.length; i++) {
            const layer = new VulkanLayer(i);
            this.addChild(layer);
        }
    }
}

class LavaLayer extends Actor {

    private speed = 0;
    private direction = 1;

    constructor(private layer: number) {
        super({
            name: "lava.layer",
            pos: Vector.Zero,
            width: Config.LavaSize,
            height: Config.LavaSize,
            color: Color.fromHex("#ff000020"),
        });

        this.speed = Config.LavaSpeed[this.layer];
        this.direction = layer % 2 === 0 ? 1 : -1;
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        const sprite = new Sprite({
            image: Resources.image.LavalLayer1,
            sourceView: {
                x: 0,
                y: 0,
                width: Resources.image.LavalLayer1.width,
                height: Resources.image.LavalLayer1.height,
            },
            destSize: {
                width: this.width,
                height: this.height,
            },
            tint: [
                Color.fromHex("#ff0000"),
                Color.fromHex("#aa0000"),
                Color.fromHex("#660000"),
            ][this.layer % 3]
        });
        this.graphics.use(sprite);
        this.rotation = Math.PI / 2 * this.layer;

        const z = Config.LavaZIndexes[this.layer];
        MakeThisASceneryObject(this, z, false);
    }

    onPreUpdate(engine: Engine, delta: number) {
        // TODO: Remove and use sprite animation
        this.pos.x += this.direction * this.speed * (delta / 1000);
        if (this.pos.x > 100) {
            this.direction = -1;
        } else if (this.pos.x < -100) {
            this.direction = 1;
        }
    }
}

class Lava extends Actor {
    constructor() {
        super({
            name: "lava.container",
            pos: Vector.Zero
        });
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine);

        for (let i = 0; i < Config.LavaZIndexes.length; i++) {
            const layer = new LavaLayer(i);
            this.addChild(layer);
        }
    }
}

export class Environment {

    private lava: Lava;
    private vulkan: Vulkan;

    constructor(private scene: Scene) {
        // // Lava
        // this.lavaL = new Actor({
        //     name: 'lava',
        //     pos: new Vector(-250, 0),
        //     width: 500,
        //     height: Config.WindowHeight * 3,
        //     color: Color.Red,
        //     collisionType: CollisionType.Fixed,
        // });
        // this.lavaB = new Actor({
        //     name: 'lava',
        //     pos: new Vector(Config.LevelLength / 2, 250),
        //     width: Config.LevelLength,
        //     height: 500,
        //     color: Color.Red,
        //     collisionType: CollisionType.Fixed,
        // });
        // this.lavaR = new Actor({
        //     name: 'lava',
        //     pos: new Vector(Config.LevelLength + 250, 0),
        //     width: 500,
        //     height: Config.WindowHeight * 3,
        //     color: Color.Red,
        //     collisionType: CollisionType.Fixed,
        // });
        // // scene.add(this.lavaL);
        // // scene.add(this.lavaB);
        // // scene.add(this.lavaR);

        this.lava = new Lava();
        this.vulkan = new Vulkan();
        scene.add(this.lava);
        scene.add(this.vulkan);

        // Start and end platforms
        scene.add(new Platform("start", 0, new Vector(-Config.LevelLength / 2, Config.LevelLength / 2)));
        scene.add(new Platform("end", 0, new Vector(Config.LevelLength / 2, Config.LevelLength / 2)));
    }

    public rotateToLevel(level: number) {
        this.vulkan.rotation = Math.PI / 2 * level;
        this.lava.rotation = Math.PI / 2 * level;
    }
}
