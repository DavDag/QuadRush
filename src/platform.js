
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
    "falling": (level) => ([
        {
            posoffset: new ex.Vector(0, 0),
            width: Math.max(50, 500 - level * 50),
            height: 50,
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
            platform.onCollisionStart = (self, other, side, contact) => {
                if (other.owner.name === 'player' && platform.willvanish !== true) {
                    platform.willvanish = true;
                    const timer = new ex.Timer({
                        fcn: () => {
                            platform.body.collisionType = ex.CollisionType.PreventCollision;
                            platform.color = new ex.Color(platform.color.r, platform.color.g, platform.color.b, platform.color.a * 0.5);
                        },
                        repeats: false,
                        interval: 1000,
                    })
                    scene.add(timer);
                    timer.start();
                }
            };
        }
        platforms.push(platform);
    }
    return platforms;
};