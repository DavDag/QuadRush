import {Actor, Collider, CollisionContact, CollisionType, Color, Engine, Side, Sprite, Timer, Vector} from "excalibur";
import {Config} from "../config";
import {MakeThisASceneryObject} from "./graphics/make-scenery-obj";
import {Resources} from "./resources";

interface PlatformUnitGenOptions {
    posoffset: Vector,
    width: number,
    height: number,
    color: Color,
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
            color: Color.Gray,
            collisionType: CollisionType.Fixed,
        },
    ]),
    "falling.1": (level: number) => ([
        {
            posoffset: new Vector(0, 0),
            width: Math.max(50, 500 - level * 50),
            height: 50,
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "falling.2": (level: number) => ([
        {
            posoffset: new Vector(-125, 0),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            color: Color.Vermilion,
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
            color: Color.Vermilion,
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
            color: Color.Vermilion,
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
            color: Color.Vermilion,
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
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new Vector(0, -75),
            width: 50,
            height: Math.min(150, 25 + level * 50),
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new Vector(125, 0),
            width: Math.max(25, 200 - level * 50),
            height: 50,
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "falling.4": (level: number) => ([
        {
            posoffset: new Vector(0, -200),
            width: Math.max(50, 250 - level * 50),
            height: Math.min(150, 25 + level * 50),
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new Vector(0, 25),
            width: Math.max(50, 250 - level * 50),
            height: Math.min(150, 25 + level * 50),
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "test": (_: number) => ([
        {
            posoffset: new Vector(0, 0),
            width: 2000,
            height: 50,
            color: Color.Yellow,
            collisionType: CollisionType.Fixed,
        }
    ]),
    "start": (_: number) => ([
        {
            posoffset: new Vector(100, -100),
            width: 200,
            height: 200,
            color: Color.fromHex('#00000020'),
            collisionType: CollisionType.Passive,
        }
    ]),
    "end": (_: number) => ([
        {
            posoffset: new Vector(-100, -100),
            width: 200,
            height: 200,
            color: Color.fromHex('#00000020'),
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
            color: data.color,
            collisionType: data.collisionType
        });

        this.canVanish = data.willvanish;
        this.canMove = data.moving !== undefined;
    }

    onInitialize(engine: Engine) {
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

        if (this.pattern !== 'start' && this.pattern !== 'end') {
            const z = Config.PlatformZIndexes[Math.floor(Math.random() * Config.PlatformZIndexes.length)];
            MakeThisASceneryObject(this, z);
        }

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
        this.isStopped = true;
        this.body.collisionType = CollisionType.PreventCollision;

        if (time === 0) {
            this.rotation = Math.PI / 2;
            return;
        }
        this.actions
            .rotateBy(-Math.PI / 2, (Math.PI / 2) / (time / 1000))
            .callMethod(() => {
                // TODO: Replace this sound
                // void Resources.Falling.play();
            });
    }

    public show(time: number) {
        this.isStopped = true;
        this.body.collisionType = CollisionType.PreventCollision;

        if (time === 0) {
            this.rotation = 0;
            return;
        }
        this.actions
            .callMethod(() => {
                // TODO: Replace this sound
                // void Resources.Falling.play();
            })
            .rotateBy(-Math.PI / 2, (Math.PI / 2) / (time / 1000))
            .callMethod(() => {
                this.isStopped = false;
                this.body.collisionType = this.data.collisionType;
            });
    }

    public fall() {
        const timer = new Timer({
            fcn: () => {
                this.actions
                    .callMethod(() => {
                        this.isStopped = true;
                        this.body.collisionType = CollisionType.PreventCollision;
                        // TODO: Replace this sound
                        // void Resources.Falling.play();
                    })
                    .moveBy(0, Config.WindowHeight, Config.PlatformFallingSpeed)
                    .callMethod(this.hide.bind(this, 0));
            },
            interval: Config.PlatformTimeBeforeFalling,
            repeats: false,
        });
        this.scene.add(timer);
        timer.start();
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
