import {Actor, Color, CompositeCollider, Graphic, GraphicsGroup, Rectangle, Vector} from "excalibur";
import {Config} from "../../config";

function CreateShadow(current: Graphic): Graphic {
    const shadow = current.clone();
    shadow.tint = Color.fromHex("#000000ff");
    shadow.opacity = 0.8;
    return shadow;
}

function CreatePole(): Graphic {
    return new Rectangle({
        width: Config.PoleWidth,
        height: Config.PoleHeight,
        color: Color.White,
    });
}

export function MakeThisASceneryObject(actor: Actor, zIndex: number): void {
    const current = actor.graphics.current;
    const currentShadow = CreateShadow(current);
    const pole = CreatePole();
    const poleShadow = CreateShadow(pole);

    const offset = new Vector(- current.width / 2, - current.height / 2);
    const group = new GraphicsGroup({
        members: [
            {
                graphic: currentShadow,
                offset: offset
                    .add(Config.ShadowOffset),
            },
            {
                graphic: poleShadow,
                offset: offset
                    .add(new Vector(-pole.width / 2 + current.width / 2, current.height / 2))
                    .add(Config.ShadowOffset),
            },
            {
                graphic: pole,
                offset: offset
                    .add(new Vector(-pole.width / 2 + current.width / 2, current.height / 2)),
            },
            {
                graphic: current,
                offset: offset,
            },
        ],
        useAnchor: false,
        origin: Vector.Zero,
    });
    actor.graphics.use(group);
    actor.transform.z = zIndex;
}
