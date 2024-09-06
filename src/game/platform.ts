import {Actor, Collider, CollisionContact, CollisionType, Engine, Side, Sprite, Vector} from "excalibur";
import {Config} from "../config";
import {MakeThisASceneryObject} from "./graphics/make-scenery-obj";
import {Resources} from "./resources";

//
// Width is calculated as follows:
//
// width = baseWidth + widthIncreaseByLevel * level
// width = max(minWidth, min(maxWidth, width))
//
interface PlatformUnitGetWidthOptions {
    baseWidth: number,
    widthIncreaseByLevel: number,
    minWidth?: number,
    maxWidth?: number,
}

//
// Height is calculated as follows:
//
// height = baseHeight + heightIncreaseByLevel * level
// height = max(minHeight, min(maxHeight, height))
//
interface PlatformUnitGetHeightOptions {
    baseHeight: number,
    heightIncreaseByLevel: number,
    minHeight?: number,
    maxHeight?: number,
}

//
// Vanishing options
//
// chance = baseVanishChance + vanishChanceIncreaseByLevel * level
// chance = min(max(0.0, chance), 1.0)
//
interface PlatformUnitGenVanishingOptions {
    baseVanishChance?: number,
    vanishChanceIncreaseByLevel?: number,
}

//
// Moving options (single axis)
//
// d = baseDuration + durationIncreaseByLevel * level
// d = max(minDuration, min(maxDuration, d))
//
// f = currentMoveTime / d
// pos = startingPos + offset.start + (offset.end - offset.start) * f
//
interface PlatformUnitGenMovingSingleAxisOptions {
    offset: {
        start: number,
        end: number,
    },
    baseDuration: number,
    durationIncreaseByLevel?: number,
    minDuration?: number,
    maxDuration?: number,
}

//
// Moving options
//
// x: moving options for x-axis
// y: moving options for y-axis
//
interface PlatformUnitGenMovingOptions {
    x?: PlatformUnitGenMovingSingleAxisOptions,
    y?: PlatformUnitGenMovingSingleAxisOptions,
}

interface PlatformUnitGenOptions {
    offset: Vector,
    width: number | PlatformUnitGetWidthOptions,
    height: number | PlatformUnitGetHeightOptions,
    vanishing?: PlatformUnitGenVanishingOptions,
    moving?: PlatformUnitGenMovingOptions,
}

export const PLATFORM_PATTERNS = {
    "safe": [
        {
            offset: new Vector(0, 0),
            width: 400,
            height: 50,
        }
    ],
    "simple": [
        {
            offset: new Vector(0, 0),
            width: {
                baseWidth: 500,
                widthIncreaseByLevel: -50,
                minWidth: 50,
            },
            height: 50,
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
        },
    ],
    "downwards": [
        {
            offset: new Vector(-125, 0),
            width: {
                baseWidth: 250,
                widthIncreaseByLevel: -25,
                minWidth: 50,
            },
            height: 50,
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
            moving: {
                y: {
                    offset: {
                        start: 0,
                        end: -100,
                    },
                    baseDuration: 3000,
                    durationIncreaseByLevel: -500,
                    minDuration: 500,
                },
            },
        },
        {
            offset: new Vector(+125, -100),
            width: {
                baseWidth: 250,
                widthIncreaseByLevel: -25,
                minWidth: 50,
            },
            height: 50,
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
            moving: {
                y: {
                    offset: {
                        start: 0,
                        end: +100,
                    },
                    baseDuration: 3000,
                    durationIncreaseByLevel: -500,
                    minDuration: 500,
                },
            },
        },
    ],
    "upwards": [
        {
            offset: new Vector(-125, -100),
            width: {
                baseWidth: 250,
                widthIncreaseByLevel: -25,
                minWidth: 50,
            },
            height: 50,
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
            moving: {
                y: {
                    offset: {
                        start: 0,
                        end: +100,
                    },
                    baseDuration: 3000,
                    durationIncreaseByLevel: -500,
                    minDuration: 500,
                },
            },
        },
        {
            offset: new Vector(+125, 0),
            width: {
                baseWidth: 250,
                widthIncreaseByLevel: -25,
                minWidth: 50,
            },
            height: 50,
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
            moving: {
                y: {
                    offset: {
                        start: 0,
                        end: -100,
                    },
                    baseDuration: 3000,
                    durationIncreaseByLevel: -500,
                    minDuration: 500,
                },
            },
        },
    ],
    "reverseT": [
        {
            offset: new Vector(-125, 0),
            width: {
                baseWidth: 200,
                widthIncreaseByLevel: -50,
                minWidth: 25,
            },
            height: 50,
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
        },
        {
            offset: new Vector(0, -75),
            width: 50,
            height: {
                baseHeight: 25,
                heightIncreaseByLevel: 50,
                maxHeight: 150,
            },
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
        },
        {
            offset: new Vector(125, 0),
            width: {
                baseWidth: 200,
                widthIncreaseByLevel: -50,
                minWidth: 25,
            },
            height: 50,
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
        },
    ],
    "tunnel": [
        {
            offset: new Vector(0, -200),
            width: {
                baseWidth: 250,
                widthIncreaseByLevel: -50,
                minWidth: 50,
            },
            height: {
                baseHeight: 25,
                heightIncreaseByLevel: 50,
                maxHeight: 150,
            },
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
        },
        {
            offset: new Vector(0, 25),
            width: {
                baseWidth: 250,
                widthIncreaseByLevel: -50,
                minWidth: 50,
            },
            height: {
                baseHeight: 25,
                heightIncreaseByLevel: 50,
                maxHeight: 150,
            },
            vanishing: {
                vanishChanceIncreaseByLevel: 0.05,
            },
        },
    ],
};

export type PlatformPatternType = keyof typeof PLATFORM_PATTERNS;

export class PlatformUnit extends Actor {

    private static GetWidth(options: number | PlatformUnitGetWidthOptions, level: number): number {
        switch (typeof options) {
            case 'number':
                return options;
            case 'object':
                const w = options as PlatformUnitGetWidthOptions;
                const width = w.baseWidth + w.widthIncreaseByLevel * level;
                return Math.min(w.maxWidth || w.baseWidth, Math.max(w.minWidth || w.baseWidth, width));
            default:
                return 0;
        }
    }

    private static GetHeight(options: number | PlatformUnitGetHeightOptions, level: number): number {
        switch (typeof options) {
            case 'number':
                return options;
            case 'object':
                const h = options as PlatformUnitGetHeightOptions;
                const height = h.baseHeight + h.heightIncreaseByLevel * level;
                return Math.min(h.maxHeight || h.baseHeight, Math.max(h.minHeight || h.baseHeight, height));
            default:
                return 0;
        }
    }

    private static GetVanishingChance(options: PlatformUnitGenVanishingOptions, level: number): number {
        if (options === undefined) return 0;
        const chance = (options.baseVanishChance || 0) + (options.vanishChanceIncreaseByLevel || 0) * level;
        return Math.min(1.0, Math.max(0.0, chance));
    }

    private static GetMovingData(options: PlatformUnitGenMovingSingleAxisOptions, level: number) {
        if (options === undefined) return undefined;
        const d = options.baseDuration + (options.durationIncreaseByLevel || 0) * level;
        return {
            offset: options.offset,
            duration: Math.min(options.maxDuration || options.baseDuration, Math.max(options.minDuration || options.baseDuration, d)),
        };
    }

    private isStopped = false;

    private readonly vanish: boolean = false;
    private isVanishing = false;

    private readonly startingPos: Vector = Vector.Zero;
    private readonly moveX?: { offset: { start: number, end: number }, duration: number } = undefined;
    private readonly moveY?: { offset: { start: number, end: number }, duration: number } = undefined;
    private currentMoveDirectionX = 1;
    private currentMoveDirectionY = 1;
    private currentMoveTimeX = 0;
    private currentMoveTimeY = 0;

    constructor(
        public readonly pattern: PlatformPatternType,
        data: PlatformUnitGenOptions,
        level: number
    ) {
        super({
            name: 'platform',
            pos: data.offset,
            width: PlatformUnit.GetWidth(data.width, level),
            height: PlatformUnit.GetHeight(data.height, level),
            color: Config.PlatformColors[Math.floor(Math.random() * Config.PlatformColors.length)],
            collisionType: CollisionType.Fixed,
        });

        // Vanishing ability
        this.vanish = Math.random() < PlatformUnit.GetVanishingChance(data.vanishing, level);

        // Moving ability
        this.startingPos = this.pos.clone();
        this.moveX = PlatformUnit.GetMovingData(data.moving?.x, level);
        this.moveY = PlatformUnit.GetMovingData(data.moving?.y, level);
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
        const z = Config.PlatformZIndexes[Math.floor(Math.random() * Config.PlatformZIndexes.length)];
        MakeThisASceneryObject(this, z, true, true);

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
        if (this.isStopped) return;

        // Move platform up and down
        if (this.moveY !== undefined) {
            this.currentMoveTimeY += delta * this.currentMoveDirectionY;
            if (this.currentMoveTimeY >= this.moveY.duration) {
                this.currentMoveTimeY -= delta;
                this.currentMoveDirectionY = -1;
            } else if (this.currentMoveTimeY < 0) {
                this.currentMoveTimeY += delta;
                this.currentMoveDirectionY = +1;
            }

            const f = (this.currentMoveTimeY / this.moveY.duration);
            const off = (this.moveY.offset.end - this.moveY.offset.start) * f;
            this.pos.y = this.startingPos.y + this.moveY.offset.start + off;
        }

        // Move platform left and right
        if (this.moveX !== undefined) {
            this.currentMoveTimeX += delta * this.currentMoveDirectionX;
            if (this.currentMoveTimeX >= this.moveX.duration) {
                this.currentMoveTimeX -= delta;
                this.currentMoveDirectionX = -1;
            } else if (this.currentMoveTimeX < 0) {
                this.currentMoveTimeX += delta;
                this.currentMoveDirectionX = +1;
            }

            const f = (this.currentMoveTimeX / this.moveX.duration);
            const off = (this.moveX.offset.end - this.moveX.offset.start) * f;
            this.pos.x = this.startingPos.x + this.moveX.offset.start + off;
        }
    }

    onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact) {
        if (!this.vanish || this.isStopped) return;

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
            this.rotation = -Config.PlatformHidingAngle;
            return;
        }

        // Otherwise, rotate the platform using actions API
        this.actions
            .rotateTo(-Config.PlatformHidingAngle, Config.PlatformHidingAngle / (time / 1000))
            .callMethod(() => {
                // TODO: Replace this sound
                // void Resources.Falling.play();
            });
    }

    public show(time: number) {
        // Make platform stop and don't collide
        this.isStopped = true;
        this.body.collisionType = CollisionType.PreventCollision;
        this.rotation = Config.PlatformHidingAngle;

        // Check if show immediately
        if (time === 0) {
            this.rotation = 0;
            this.isStopped = false;
            this.body.collisionType = CollisionType.Fixed;
            return;
        }

        // Otherwise, rotate the platform using actions API
        this.actions
            .callMethod(() => {
                // TODO: Replace this sound
                // void Resources.Falling.play();
            })
            .rotateTo(0, Config.PlatformHidingAngle / (time / 1000))
            .callMethod(() => {
                // Make platform move and collide again
                this.isStopped = false;
                this.body.collisionType = CollisionType.Fixed;
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

        //
        // I'm required to add children in the constructor since they can be queried
        // before the actor is initialized.
        //
        // (e.g. in the `fillLevel` method, calling `this.show`).
        //
        const children = PLATFORM_PATTERNS[this.pattern];
        for (const data of children) {
            this.addChild(new PlatformUnit(this.pattern, data, this.level));
        }
    }

    public hide(time: number) {
        this.children.forEach((child) => (child as PlatformUnit).hide(time));
    }

    public show(time: number) {
        this.children.forEach((child) => (child as PlatformUnit).show(time));
    }
}
