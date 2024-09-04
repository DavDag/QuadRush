import {Color, Vector} from "excalibur";

export const Config = {
    //
    // Settings
    //
    volume: 0.5,

    //
    // Window
    //
    WindowWidth: 800,
    WindowHeight: 600,

    //
    // Game
    //

    // Game: Score
    ScoreTimerInterval: 100,

    // Game: Feedback
    TimeThresholdForClose: 0.75,
    LevelChangeDuration: 2000,
    LevelChangeAnimInterval: 10,
    PlatformHidingAngle: Math.PI / 2,
    PlatformFallingSpeed: 500,
    GameOverDelay: 1000,
    CameraZoomOnDeath: 2,

    // Game: Gameplay
    SideSpeed: 200,
    JumpSpeed: 450,
    DashPower: 2,
    DashDuration: 500,
    Gravity: 800,
    LevelLength: 2800,
    PlatformHeight: 1400,
    PlatformTimeBeforeFalling: 500,
    CameraMaxZoom: 1.25,
    CameraStartZoom: 0.75,
    CameraZoomIncrement: 0.025,

    //
    // Graphics
    //

    // Graphics: General
    ManualBorderWidth: 5,
    ShadowOffset: new Vector(-10, -10),

    // Graphics: Pole
    PoleWidth: 8,
    PoleHeight: 600,

    // Graphics: Platforms
    PlatformRotationHeight: 1800,
    PlatformZIndexes: [0, 2, 4],

    // Graphics: Player
    PlayerZIndex: 2,
    PlayerColor: Color.White,

    // Graphics: Lava
    LavaSize: 4000,
    LavaColors: [
        Color.fromHex("#ff0000"),
        Color.fromHex("#aa0000"),
        Color.fromHex("#660000"),
    ],
    LavaZIndexes: [1, 3, 5],
    LavaSpeed: [100, 60, 80],

    // Graphics: Vulkan
    VulkanLayerSize: 3600,
    VulkanColors: [
        Color.fromHex("#666600"),
        Color.fromHex("#888800"),
        Color.fromHex("#aaaa00"),
        Color.fromHex("#cccc00"),
        Color.fromHex("#ffff00"),
    ],
    VulkanZIndexes: [-1, -2, -3, -4, -5]
};
