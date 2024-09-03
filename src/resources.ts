import {Sound} from "excalibur";
// @ts-ignore
import JumpSound from "./assets/music/jump.mp3";
// @ts-ignore
import DashSound from "./assets/music/dash.wav";
// @ts-ignore
import DeathSound from "./assets/music/death.wav";
// @ts-ignore
import DangerSound from "./assets/music/danger.wav";
// @ts-ignore
import FallingSound from "./assets/music/falling.wav";
// @ts-ignore
import LevelCompleteSound from "./assets/music/levelcomplete.wav";

const resources = {
    jump: new Sound(JumpSound),
    dash: new Sound(DashSound),
    death: new Sound(DeathSound),
    danger: new Sound(DangerSound),
    falling: new Sound(FallingSound),
    levelcomplete: new Sound(LevelCompleteSound),
};

export const Resources = resources;
