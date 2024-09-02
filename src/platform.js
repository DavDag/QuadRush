
export const PLATFORM_PATTERNS = {
    "base": [
        {
            posoffset: new ex.Vector(0, 0),
            width: 300,
            height: 50,
            color: ex.Color.Gray,
            collisionType: ex.CollisionType.Fixed,
        },
    ],
    "start": [
        {
            posoffset: new ex.Vector(100, -100),
            width: 200,
            height: 200,
            color: ex.Color.fromHex('#00000020'),
            collisionType: ex.CollisionType.Passive,
        }
    ],
    "end": [
        {
            posoffset: new ex.Vector(-100, -100),
            width: 200,
            height: 200,
            color: ex.Color.fromHex('#00000020'),
            collisionType: ex.CollisionType.Passive,
        }
    ],
};

export function CreatePlatforms(pos, pattern) {
    const platforms = [];
    for (const data of PLATFORM_PATTERNS[pattern]) {
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
        platforms.push(platform);
    }
    return platforms;
};