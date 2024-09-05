import {
    Actor,
    Collider,
    CollisionContact,
    CollisionType,
    Color,
    Engine,
    Side,
    Sprite,
    Vector
} from "excalibur";
import {Config} from "../config";
import {MakeThisASceneryObject} from "./graphics/make-scenery-obj";
import {Resources} from "./resources";

interface PlatformUnitGenOptions {
    posoffset: Vector,
    width: number,
    height: number,
    collisionType: CollisionType,
    willvanish?: boolean,
    moving?: {
        startoff: number,
        endoff: number,
        duration: number,
    },
}

export const PLATFORM_PATTERNS: { [key: string]: ((level: number) => PlatformUnitGenOptions[]) } = {
    "base": (_: number) => ([
        {
            posoffset: new Vector(0, 0),
            width: 400,
            height: 50,
            collisionType: CollisionType.Fixed,
        },
    ]),
    "falling.1": (level: number) => ([
        {
            posoffset: new Vector(0, 0),
            width: Math.max(50, 500 - level * 50),
            height: 50,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "falling.2": (level: number) => ([
        {
            posoffset: new Vector(-125, 0),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            moving: {
                startoff: 0,
                endoff: -100,
                duration: Math.max(500, 3000 - level * 500),
            },
        },
        {
            posoffset: new Vector(+125, -100),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            moving: {
                startoff: 0,
                endoff: +100,
                duration: Math.max(500, 3000 - level * 500),
            },
        },
    ]),
    "falling.2.inv": (level: number) => ([
        {
            posoffset: new Vector(-125, -100),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            moving: {
                startoff: 0,
                endoff: +100,
                duration: Math.max(500, 3000 - level * 500),
            },
        },
        {
            posoffset: new Vector(+125, 0),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            moving: {
                startoff: 0,
                endoff: -100,
                duration: Math.max(500, 3000 - level * 500),
            },
        },
    ]),
    "falling.3": (level: number) => ([
        {
            posoffset: new Vector(-125, 0),
            width: Math.max(25, 200 - level * 50),
            height: 50,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new Vector(0, -75),
            width: 50,
            height: Math.min(150, 25 + level * 50),
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new Vector(125, 0),
            width: Math.max(25, 200 - level * 50),
            height: 50,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "falling.4": (level: number) => ([
        {
            posoffset: new Vector(0, -200),
            width: Math.max(50, 250 - level * 50),
            height: Math.min(150, 25 + level * 50),
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new Vector(0, 25),
            width: Math.max(50, 250 - level * 50),
            height: Math.min(150, 25 + level * 50),
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "start": (_: number) => ([
        {
            posoffset: new Vector(100, -100),
            width: 200,
            height: 200,
            collisionType: CollisionType.Passive,
        }
    ]),
    "end": (_: number) => ([
        {
            posoffset: new Vector(-100, -100),
            width: 200,
            height: 200,
            collisionType: CollisionType.Passive,
        }
    ]),
};

export type PlatformPatternType = keyof typeof PLATFORM_PATTERNS;

export class PlatformUnit extends Actor {

    private canVanish = false;
    private canMove = false;
    private isStopped = false;

    private isVanishing = false;
    private currentMoveDirection = 1;
    private currentMoveTime = 0;

    constructor(public readonly pattern: PlatformPatternType, private data: PlatformUnitGenOptions) {
        super({
            name: 'platform',
            x: data.posoffset.x,
            y: data.posoffset.y,
            width: data.width,
            height: data.height,
            color: Config.PlatformColors[pattern] || Color.Violet,
            collisionType: data.collisionType
        });

        // Vanishing ability
        this.canVanish = data.willvanish;

        // Moving ability
        this.canMove = data.moving !== undefined;
    }

    onInitialize(engine: Engine) {
        // Add sprite
        const sprite = new Sprite({
            image: Resources.image.PaperTexture,
            sourceView: {
                x: Math.random() * 1000,
                y: Math.random() * 1000,
                width: this.width,
                height: this.height,
            },
            destSize: {
                width: this.width,
                height: this.height,
            },
            tint: this.color,
        });
        this.graphics.use(sprite);

        // Make platform a scenery object
        if (this.pattern !== 'start' && this.pattern !== 'end') {
            const z = Config.PlatformZIndexes[Math.floor(Math.random() * Config.PlatformZIndexes.length)];
            MakeThisASceneryObject(this, z, true, true);
        }

        //
        // This enables the platform to rotate around a specific point
        //
        this.graphics.onPreDraw = (ctx, delta) => {
            ctx.save();

            // Make rotation pivot around the center offset by half the height of the pole
            ctx.rotate(-this.rotation);
            ctx.translate(0, Config.PlatformRotationHeight - this.center.y)
            ctx.rotate(this.rotation);
            ctx.translate(0, -(Config.PlatformRotationHeight - this.center.y));
        }
        this.graphics.onPostDraw = (ctx, delta) => {
            ctx.restore();
        }
    }

    onPostUpdate(engine: Engine, delta: number) {
        if (!this.canMove || this.isStopped) return;

        // Move platform up and down
        this.currentMoveTime += delta * this.currentMoveDirection;
        if (this.currentMoveTime >= this.data.moving.duration) {
            this.currentMoveTime -= delta;
            this.currentMoveDirection = -1;
        } else if (this.currentMoveTime < 0) {
            this.currentMoveTime += delta;
            this.currentMoveDirection = +1;
        }

        const f = (this.currentMoveTime / this.data.moving.duration);
        const off = (this.data.moving.endoff - this.data.moving.startoff) * f;
        this.pos.y = this.data.posoffset.y + this.data.moving.startoff + off;
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact) {
        if (!this.canVanish || this.isStopped) return;

        // Vanish if player touches
        if (other.owner.name === 'player' && !this.isVanishing) {
            this.isVanishing = true;
            this.fall();
        }
    }

    public hide(time: number) {
        // Make platform stop and don't collide
        this.isStopped = true;
        this.body.collisionType = CollisionType.PreventCollision;

        // Check if hide immediately
        if (time === 0) {
            this.rotation = Config.PlatformHidingAngle;
            return;
        }

        // Otherwise, rotate the platform using actions API
        this.actions
            .rotateBy(-Config.PlatformHidingAngle, Config.PlatformHidingAngle / (time / 1000))
            .callMethod(() => {
                // TODO: Replace this sound
                // void Resources.Falling.play();
            });
    }

    public show(time: number) {
        // Make platform stop and don't collide
        this.isStopped = true;
        this.body.collisionType = CollisionType.PreventCollision;

        // Check if show immediately
        if (time === 0) {
            this.rotation = 0;
            return;
        }

        // Otherwise, rotate the platform using actions API
        this.actions
            .callMethod(() => {
                // TODO: Replace this sound
                // void Resources.Falling.play();
            })
            .rotateBy(-Config.PlatformHidingAngle, Config.PlatformHidingAngle / (time / 1000))
            .callMethod(() => {
                // Make platform move and collide again
                this.isStopped = false;
                this.body.collisionType = this.data.collisionType;
            });
    }

    public fall() {
        this.actions
            .delay(Config.PlatformTimeBeforeFalling)
            .callMethod(() => {
                // Make platform stop and don't collide
                this.isStopped = true;
                this.body.collisionType = CollisionType.PreventCollision;
                // TODO: Replace this sound
                // void Resources.Falling.play();
            })
            // Animate platform falling
            .moveBy(0, Config.WindowHeight, Config.PlatformFallingSpeed);
    }
}

export class Platform extends Actor {

    constructor(private pattern: PlatformPatternType, private level: number, pos: Vector) {
        super({
            name: 'platform.container',
            x: pos.x,
            y: pos.y,
        });

        // Add children
        const children = PLATFORM_PATTERNS[this.pattern](this.level);
        for (const data of children) {
            this.addChild(new PlatformUnit(this.pattern, data));
        }
    }

    public hide(time: number) {
        this.children.forEach((child) => (child as PlatformUnit).hide(time));
    }

    public show(time: number) {
        this.children.forEach((child) => (child as PlatformUnit).show(time));
    }
}
