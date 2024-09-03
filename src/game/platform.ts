import {Resources} from "./resources";
import {Actor, CollisionType, Color, GraphicsGroup, Scene, Timer, Vector} from "excalibur";
import {Config} from "../config";

type PGenFun = (level: number) => {
    posoffset: Vector,
    width: number,
    height: number,
    color: Color,
    collisionType: CollisionType,
    willvanish?: boolean,
    movingy?: [number, number, number],
    hasShadow?: boolean,
}[];

export const PLATFORM_PATTERNS: { [key: string]: PGenFun } = {
    "base": (_: number) => ([
        {
            posoffset: new Vector(0, 0),
            width: 400,
            height: 50,
            color: Color.Gray,
            collisionType: CollisionType.Fixed,
            hasShadow: true,
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
            hasShadow: true,
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
            hasShadow: true,
        },
        {
            posoffset: new Vector(+125, -100),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            color: Color.Vermilion,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            movingy: [0, 100, Math.max(500, 3000 - level * 500)],
            hasShadow: true,
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
            hasShadow: true,
        },
        {
            posoffset: new Vector(+125, 0),
            width: Math.max(50, 250 - level * 50),
            height: 50,
            color: Color.Vermilion,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            movingy: [0, -100, Math.max(500, 3000 - level * 500)],
            hasShadow: true,
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
            hasShadow: true,
        },
        {
            posoffset: new Vector(0, -75),
            width: 50,
            height: Math.min(150, 25 + level * 50),
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            hasShadow: true,
        },
        {
            posoffset: new Vector(125, 0),
            width: Math.max(25, 200 - level * 50),
            height: 50,
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            hasShadow: true,
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
            hasShadow: true,
        },
        {
            posoffset: new Vector(0, 25),
            width: Math.max(50, 250 - level * 50),
            height: Math.min(150, 25 + level * 50),
            color: Color.LightGray,
            collisionType: CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            hasShadow: true,
        },
    ]),
    "test": (_: number) => ([
        {
            posoffset: new Vector(0, 0),
            width: 2000,
            height: 50,
            color: Color.Yellow,
            collisionType: CollisionType.Fixed,
            hasShadow: true,
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

export function CreatePlatforms(scene: Scene, level: number, pos: Vector, pattern: keyof typeof PLATFORM_PATTERNS) {
    const platforms = [];
    for (const data of PLATFORM_PATTERNS[pattern](level)) {
        const platform = new Actor({
            name: 'platform',
            x: pos.x + data.posoffset.x,
            y: pos.y + data.posoffset.y,
            width: data.width,
            height: data.height,
            color: data.color,
            collisionType: data.collisionType,
        });
        platform["pattern"] = pattern;

        if (data.willvanish === true) {
            platform["willvanish"] = true;
            platform.onCollisionStart = (_, other, __, ___) => {
                if (other.owner.name === 'player' && platform["isvanishing"] !== true) {
                    platform["isvanishing"] = true;
                    const timer = new Timer({
                        fcn: () => {
                            platform.body.collisionType = CollisionType.PreventCollision;
                            platform.color = new Color(platform.color.r, platform.color.g, platform.color.b, platform.color.a * 0.25);
                            void Resources.falling.play();
                        },
                        repeats: false,
                        interval: 500,
                    })
                    scene.add(timer);
                    timer.start();
                }
            };
        }

        if (data.movingy !== undefined) {
            platform["movingy"] = data.movingy;
            platform["offy"] = 0;
            platform.onPostUpdate = (_, delta) => {
                const [start, end, speed] = platform["movingy"];
                platform["offy"] += delta;
                if (platform["offy"] >= speed) {
                    platform["offy"] = 0;
                    platform["movingy"] = [end, start, speed];
                } else {
                    const off = (end - start) * (platform["offy"] / speed);
                    platform.pos.y = pos.y + data.posoffset.y + start + off;
                }
            };
        }
        platforms.push(platform);

        if (data.hasShadow === true) {
            const shadow = platform.graphics.current.clone();
            shadow.tint = Color.Black;
            platform.graphics.use(new GraphicsGroup({
                members: [
                    {
                        graphic: shadow,
                        offset: new Vector(Config.shadowOffsetX, Config.shadowOffsetY),
                    },
                    {
                        graphic: platform.graphics.current,
                        offset: Vector.Zero
                    }
                ],
            }));
        }
        platform.transform.z = Config.level2zIndex;
    }
    return platforms;
}
