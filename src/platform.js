
export const PLATFORM_PATTERNS = {
    "base": [
        {
            posoffset: new ex.Vector(0, 0),
            width: 400,
            height: 50,
            color: ex.Color.Gray,
        },
    ],
    "end": [
        {
            posoffset: new ex.Vector(+25, -300),
            width: 50,
            height: 600,
            color: ex.Color.Green,
        },
        {
            posoffset: new ex.Vector(-100, 0),
            width: 200,
            height: 50,
            color: ex.Color.Green,
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
            collisionType: ex.CollisionType.Fixed,
        });
        platform.pattern = pattern;
        platforms.push(platform);
    }
    return platforms;
};