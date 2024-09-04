import {Resources} from "./resources";
import {Actor, Collider, CollisionContact, CollisionType, Color, Engine, Scene, Side, Timer, Vector} from "excalibur";
import {Config} from "../config";
import {MakeThisASceneryObject} from "./graphics/make-scenery-obj";

interface PlatformUnitGenOptions {
    posoffset: Vector,
    width: number,
    height: number,
    color: Color,
    collisionType: CollisionType,
    willvanish?: boolean,
    movingy?: [number, number, number],
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
            movingy: [0, -100, Math.max(500, 3000 - level * 500)],
        },
        {
            posoffset: new Vector(+125, -100),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            color: Color.Vermilion,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            movingy: [0, 100, Math.max(500, 3000 - level * 500)],
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
            movingy: [0, 100, Math.max(500, 3000 - level * 500)],
        },
        {
            posoffset: new Vector(+125, 0),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            color: Color.Vermilion,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            movingy: [0, -100, Math.max(500, 3000 - level * 500)],
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
    private isVanishing = false;
    private canMove = false;
    private startingPos = new Vector(0, 0);
    private moveOffset = new Vector(0, 0);
    private moveTime = 0;
    private currentMoveDirection = 1;
    private currentMoveTime = 0;

    constructor(public readonly pattern: PlatformPatternType, data: PlatformUnitGenOptions) {
        super({
            name: 'platform',
            x: data.posoffset.x,
            y: data.posoffset.y,
            width: data.width,
            height: data.height,
            color: data.color,
            collisionType: data.collisionType,
        });

        this.canVanish = data.willvanish;
        this.canMove = data.movingy !== undefined;
        if (this.canMove) {
            this.startingPos = data.posoffset;
            this.moveOffset = new Vector(data.movingy![0], data.movingy![1]);
            this.moveTime = data.movingy![2];
        }
    }

    onInitialize(engine: Engine) {
        super.onInitialize(engine);
        MakeThisASceneryObject(this, Config.PlatformZIndex1);
    }

    onPostUpdate(engine: Engine, delta: number) {
        if (!this.canMove) return;

        // Move platform up and down
        this.currentMoveTime += delta * this.currentMoveDirection;
        if (this.currentMoveTime >= this.moveTime) {
            this.currentMoveTime -= delta;
            this.currentMoveDirection = -1;
        } else if (this.currentMoveTime < 0) {
            this.currentMoveTime += delta;
            this.currentMoveDirection = +1;
        }

        const off = (this.moveOffset.y - this.moveOffset.x) * (this.currentMoveTime / this.moveTime);
        this.pos.y = this.startingPos.y + this.moveOffset.x + off;
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact) {
        if (!this.canVanish) return;

        // Vanish if player touches
        if (other.owner.name === 'player' && !this.isVanishing) {
            this.isVanishing = true;
            this.actions
                .fade(0, Config.PlatformFallingTime)
                .callMethod(this.onVanishComplete.bind(this));
        }
    }

    private onVanishComplete() {
        void Resources.falling.play();
        this.body.collisionType = CollisionType.PreventCollision;
    }
}

export class Platform extends Actor {

    constructor(private pattern: PlatformPatternType, private level: number, pos: Vector) {
        super({
            name: 'platform.container',
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            color: Color.Transparent,
            collisionType: CollisionType.PreventCollision,
        });

        // Add children
        const children = PLATFORM_PATTERNS[this.pattern](this.level);
        for (const data of children) {
            this.addChild(new PlatformUnit(this.pattern, data));
        }
    }

    public hide(time: number) {
        if (time === 0) {
            this.children.forEach((child) => {
                (child as PlatformUnit).graphics.opacity = 0;
            });
            return;
        }

        this.children.forEach((child) => {
           (child as PlatformUnit)
               .actions
               .fade(0, time);
        });
    }

    public show(time: number) {
        if (time === 0) {
            this.children.forEach((child) => {
                (child as PlatformUnit).graphics.opacity = 1;
            });
            return;
        }

        this.children.forEach((child) => {
            (child as PlatformUnit)
                .actions
                .fade(1, time);
        });
    }
}
