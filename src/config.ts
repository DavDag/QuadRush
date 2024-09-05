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
    TimeThresholdForClose: 0.8,
    LevelChangeDuration: 1500,
    LevelChangeAnimInterval: 10,
    PlatformHidingAngle: Math.PI / 2,
    PlatformFallingSpeed: 500,
    GameOverDelay: 1000,
    CameraZoomOnDeath: 2,

    // Game: Gameplay
    SideSpeed: 250,
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
    TimeLimitBase: 30000,
    TimeLimitIncrease: -1000,
    TimeLimitBaseMin: 10000,

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
    PlatformZIndexes: [1, 3, 5],
    PlatformColors: [
        Color.fromHex("#ffe0e0"),
        Color.fromHex("#dccaca"),
        Color.fromHex("#c3b4b4"),
        Color.fromHex("#aa9e9e"),
        Color.fromHex("#918888"),
        Color.fromHex("#787272"),
        Color.fromHex("#5f5c5c"),
        Color.fromHex("#464444"),
        Color.fromHex("#2d2c2c"),
    ],

    // Graphics: Player
    PlayerZIndex: 3,
    PlayerWidth: 50,
    PlayerHeight: 50,
    PlayerColor: Color.White,

    // Graphics: Lava
    LavaZIndexes: [2, 4, 6],
    LavaSize: 4000,
    LavaColors: [
        Color.fromHex("#ff0000"),
        Color.fromHex("#aa0000"),
        Color.fromHex("#660000"),
    ],
    LavaSpeed: [100, 60, 80],

    // Graphics: Vulkan
    VulkanZIndexes: [-11, -12, -13, -14, -15],
    VulkanLayerSize: 3600,
    VulkanColors: [
        Color.fromHex("#666600"),
        Color.fromHex("#888800"),
        Color.fromHex("#aaaa00"),
        Color.fromHex("#cccc00"),
        Color.fromHex("#ffff00"),
    ],

    // Graphics: Portal
    PortalZIndex: 0,
    PortalWidth: 200,
    PortalHeight: 200,
    PortalColor: Color.fromHex("#00000020"),
};
