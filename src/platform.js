import { Resources } from "./resources.js";

export const PLATFORM_PATTERNS = {
    "base": (level) => ([
        {
            posoffset: new ex.Vector(0, 0),
            width: 400,
            height: 50,
            color: ex.Color.Gray,
            collisionType: ex.CollisionType.Fixed,
        },
    ]),
    "falling.1": (level) => ([
        {
            posoffset: new ex.Vector(0, 0),
            width: Math.max(50, 500 - level * 25),
            height: 50,
            color: ex.Color.LightGray,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "falling.2": (level) => ([
        {
            posoffset: new ex.Vector(-125, 0),
            width: Math.max(50, 250 - level * 25),
            height: 50,
            color: ex.Color.Vermilion,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            movingy: [0, -100, Math.max(500, 3000 - level * 250)],
        },
        {
            posoffset: new ex.Vector(+125, -100),
            width: Math.max(50, 250 - level * 25),
            height: 50,
            color: ex.Color.Vermilion,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            movingy: [0, 100, Math.max(500, 3000 - level * 250)],
        },
    ]),
    "falling.2.inv": (level) => ([
        {
            posoffset: new ex.Vector(-125, -100),
            width: Math.max(50, 250 - level * 25),
            height: 50,
            color: ex.Color.Vermilion,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            movingy: [0, 100, Math.max(500, 3000 - level * 250)],
        },
        {
            posoffset: new ex.Vector(+125, 0),
            width: Math.max(50, 250 - level * 25),
            height: 50,
            color: ex.Color.Vermilion,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
            movingy: [0, -100, Math.max(500, 3000 - level * 250)],
        },
    ]),
    "falling.3": (level) => ([
        {
            posoffset: new ex.Vector(-125, 0),
            width: Math.max(25, 200 - level * 25),
            height: 50,
            color: ex.Color.LightGray,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new ex.Vector(0, -75),
            width: 50,
            height: Math.min(150, 25 + level * 25),
            color: ex.Color.LightGray,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new ex.Vector(125, 0),
            width: Math.max(25, 200 - level * 25),
            height: 50,
            color: ex.Color.LightGray,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "falling.4": (level) => ([
        {
            posoffset: new ex.Vector(0, -200),
            width: Math.max(50, 250 - level * 25),
            height: Math.min(150, 25 + level * 25),
            color: ex.Color.LightGray,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
        {
            posoffset: new ex.Vector(0, 25),
            width: Math.max(50, 250 - level * 25),
            height: Math.min(150, 25 + level * 25),
            color: ex.Color.LightGray,
            collisionType: ex.CollisionType.Fixed,
            willvanish: (Math.random() * 30 < level),
        },
    ]),
    "test": (level) => ([
        {
            posoffset: new ex.Vector(0, 0),
            width: 2000,
            height: 50,
            color: ex.Color.Yellow,
            collisionType: ex.CollisionType.Fixed,
        }
    ]),
    "start": (_) => ([
        {
            posoffset: new ex.Vector(100, -100),
            width: 200,
            height: 200,
            color: ex.Color.fromHex('#00000020'),
            collisionType: ex.CollisionType.Passive,
        }
    ]),
    "end": (_) => ([
        {
            posoffset: new ex.Vector(-100, -100),
            width: 200,
            height: 200,
            color: ex.Color.fromHex('#00000020'),
            collisionType: ex.CollisionType.Passive,
        }
    ]),
};

export function CreatePlatforms(scene, level, pos, pattern) {
    const platforms = [];
    for (const data of PLATFORM_PATTERNS[pattern](level)) {
        const platform = new ex.Actor({
            name: 'platform',
            x: pos.x + data.posoffset.x,
            y: pos.y + data.posoffset.y,
            width: data.width,
            height: data.height,
            color: data.color,
            collisionType: data.collisionType,
        });
        platform.pattern = pattern;
        if (data.willvanish === true) {
            platform.willvanish = true;
            platform.onCollisionStart = (self, other, side, contact) => {
                if (other.owner.name === 'player' && platform.isvanishing !== true) {
                    platform.isvanishing = true;
                    const timer = new ex.Timer({
                        fcn: () => {
                            platform.body.collisionType = ex.CollisionType.PreventCollision;
                            platform.color = new ex.Color(platform.color.r, platform.color.g, platform.color.b, platform.color.a * 0.25);
                            Resources.falling.play();
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
            platform.movingy = data.movingy;
            platform.offy = 0;
            platform.onPostUpdate = (engine, delta) => {
                const [start, end, speed] = platform.movingy;
                platform.offy += delta;
                if (platform.offy >= speed) {
                    platform.offy = 0;
                    platform.movingy = [end, start, speed];
                } else {
                    const off = (end - start) * (platform.offy / speed);
                    platform.pos.y = pos.y + data.posoffset.y + start + off;
                }
            };
        }
        platforms.push(platform);
    }
    return platforms;
};