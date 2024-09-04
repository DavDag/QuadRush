import {Actor, CollisionType, Color, Engine, ParallaxComponent, Scene, Shape, Sprite, Vector} from "excalibur";
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
            color: Color.Violet,
            collisionType: CollisionType.PreventCollision,
        });
    }

    onInitialize(engine: Engine) {
        // Add the vulkan layer sprite
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
            tint: Config.VulkanColors[this.layer]
        });
        this.graphics.use(sprite);

        // Make this a scenery object
        const z = Config.VulkanZIndexes[this.layer];
        MakeThisASceneryObject(this, z, false);

        // Rotate the vulkan layer (to differ each layer)
        this.rotation = Math.PI / 2 * this.layer;

        // Add a parallax component
        const p = Math.pow(1.1, this.layer);
        this.addComponent(new ParallaxComponent(new Vector(p, p)));
    }
}

class Vulkan extends Actor {
    constructor() {
        super({
            name: "vulkan.container",
            pos: Vector.Zero,
        });
    }

    onInitialize(engine: Engine) {
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
            color: Color.Violet,
            collisionType: CollisionType.PreventCollision,
        });

        // Each layer has a different speed and direction
        this.speed = Config.LavaSpeed[this.layer];
        this.direction = layer % 2 === 0 ? 1 : -1;
    }

    onInitialize(engine: Engine) {
        // Add the lava layer sprite
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
            tint: Config.LavaColors[this.layer]
        });
        this.graphics.use(sprite);

        // Make this a scenery object
        const z = Config.LavaZIndexes[this.layer];
        MakeThisASceneryObject(this, z, false);

        // Rotate the lava layer (to differ each layer)
        this.rotation = Math.PI / 2 * this.layer;
    }

    onPreUpdate(engine: Engine, delta: number) {
        // Make the lava move
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
            pos: Vector.Zero,
        });
    }

    onInitialize(engine: Engine) {
        // Add colliders for making player die
        this.collider.useCompositeCollider([
            Shape.Box(Config.LevelLength + 400, 400, Vector.Half, new Vector(0, Config.PlatformRotationHeight)),
            Shape.Box(Config.LevelLength + 400, 400, Vector.Half, new Vector(0, -Config.PlatformRotationHeight)),
            Shape.Box(400, Config.LevelLength + 400, Vector.Half, new Vector(-Config.LevelLength / 2 - 400, 0)),
            Shape.Box(400, Config.LevelLength + 400, Vector.Half, new Vector(+Config.LevelLength / 2 + 400, 0)),
        ]);
        this.body.collisionType = CollisionType.Fixed;

        // Add lava layers
        for (let i = 0; i < Config.LavaZIndexes.length; i++) {
            const layer = new LavaLayer(i);
            this.addChild(layer);
        }
    }
}

export class Environment {

    private lava: Lava;
    private vulkan: Vulkan;

    constructor(scene: Scene) {
        // Environment
        this.lava = new Lava();
        this.vulkan = new Vulkan();
        scene.add(this.lava);
        scene.add(this.vulkan);

        // Start and end platforms
        scene.add(new Platform("start", 0, new Vector(-Config.LevelLength / 2, Config.LevelLength / 2)));
        scene.add(new Platform("end", 0, new Vector(Config.LevelLength / 2, Config.LevelLength / 2)));
    }

    public rotateToLevel(level: number) {
        // Rotate the environment
        this.vulkan.rotation = Math.PI / 2 * level;
        this.lava.rotation = Math.PI / 2 * level;
    }
}
