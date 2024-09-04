import {Actor, Color, Graphic, GraphicsGroup, Rectangle, Vector} from "excalibur";
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
        height: Config.WindowHeight,
        color: Color.White,
    });
}

export function MakeThisASceneryObject(actor: Actor, zIndex: number): void {
    const current = actor.graphics.current;
    const currentShadow = CreateShadow(current);
    const pole = CreatePole();
    const poleShadow = CreateShadow(pole);

    const origin = new Vector(-current.width / 2, -current.height / 2);
    const group = new GraphicsGroup({
        members: [
            {
                graphic: currentShadow,
                offset: origin.add(Config.ShadowOffset),
            },
            {
                graphic: poleShadow,
                offset: new Vector(-pole.width / 2, 0).add(Config.ShadowOffset),
            },
            {
                graphic: pole,
                offset: new Vector(-pole.width / 2, 0),
            },
            {
                graphic: current,
                offset: origin,
            },
        ],
        useAnchor: false,
        origin: origin,
    });
    actor.graphics.use(group);
    actor.transform.z = zIndex;
}
