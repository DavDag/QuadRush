import {Actor, Color, Graphic, GraphicsGroup, Rectangle, Vector} from "excalibur";
import {Config} from "../../config";

function CreateShadow(current: Graphic): Graphic {
    // TODO: Improve shadows
    // Make them responsive to ShadowOffset
    // otherwise, they will be off when rotating its parent
    const shadow = current.clone();
    shadow.tint = Color.fromHex("#000000ff");
    shadow.opacity = 0.75;
    return shadow;
}

function CreatePole(): Graphic {
    return new Rectangle({
        width: Config.PoleWidth,
        height: Config.PoleHeight,
        color: Color.fromHex("#cd9d5e"),
        strokeColor: Color.Black,
        lineWidth: Config.ManualBorderWidth,
    });
}

export function MakeThisASceneryObject(actor: Actor, zIndex: number, hasPole: boolean = true, drawBorderOnBounds: boolean = false): void {
    const current = actor.graphics.current;
    const currentShadow = CreateShadow(current);
    const pole = CreatePole();
    const poleShadow = CreateShadow(pole);
    const borders = new Rectangle({
        width: actor.width,
        height: actor.height,
        color: Color.Transparent,
        strokeColor: Color.Black,
        lineWidth: Config.ManualBorderWidth,
    });

    const offset = new Vector(-current.width / 2, -current.height / 2);
    const group = new GraphicsGroup({
        members: [
            // {
            //     graphic: currentShadow,
            //     offset: offset
            //         .add(Config.ShadowOffset),
            // },
            // {
            //     graphic: poleShadow,
            //     offset: offset
            //         .add(new Vector(-pole.width / 2 + current.width / 2, current.height / 2))
            //         .add(Config.ShadowOffset),
            // },
            {
                graphic: pole,
                offset: offset.add(new Vector(-pole.width / 2 + current.width / 2, current.height / 2)),
            },
            {
                graphic: current,
                offset: offset,
            },
            {
                graphic: borders,
                offset: offset,
            },
        ],
        useAnchor: false,
        origin: Vector.Zero,
    });
    actor.graphics.use(group);
    actor.z = zIndex;

    if (!drawBorderOnBounds) {
        group.members.splice(2, 1);
    }
    if (!hasPole) {
        group.members.splice(0, 1);
    }
}
