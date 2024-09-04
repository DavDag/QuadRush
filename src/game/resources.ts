import {ImageFiltering, ImageSource, Sound} from "excalibur";
// @ts-ignore
import JumpSound from "../assets/music/jump.mp3";
// @ts-ignore
import DashSound from "../assets/music/dash.wav";
// @ts-ignore
import DeathSound from "../assets/music/death.wav";
// @ts-ignore
import DangerSound from "../assets/music/danger.wav";
// @ts-ignore
import FallingSound from "../assets/music/falling.wav";
// @ts-ignore
import LevelCompleteSound from "../assets/music/levelcomplete.wav";
// @ts-ignore
import BgLayer1Image from "../assets/sprite/bg_layer1.png";
// @ts-ignore
import LavaLayer1Image from "../assets/sprite/lava_layer1.png";
// @ts-ignore
import PaperTextureImage from "../assets/sprite/paper_texture.png";
// @ts-ignore
import WoodTextureImage from "../assets/sprite/wood_texture.png";

export const Resources = {
    image: {
        BgLayer1: new ImageSource(BgLayer1Image),
        LavalLayer1: new ImageSource(LavaLayer1Image),
        PaperTexture: new ImageSource(PaperTextureImage),
        WoodTexture: new ImageSource(WoodTextureImage),
    },
    music: {
        Jump: new Sound(JumpSound),
        Dash: new Sound(DashSound),
        Death: new Sound(DeathSound),
        Danger: new Sound(DangerSound),
        Falling: new Sound(FallingSound),
        LevelComplete: new Sound(LevelCompleteSound),
    },
};
