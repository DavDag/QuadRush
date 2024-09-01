
export const PLATFORM_PATTERNS = {
    "base": {

    }
};

export function CreatePlatform(pattern) {
    const platform = new ex.Actor({
        name: 'platform',
        width: 50,
        height: 50,
        color: ex.Color.Green,
        collisionType: ex.CollisionType.Fixed,
    });

    return platform;
};