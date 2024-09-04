import {Vector} from "excalibur";

export const Config = {
    // Settings (can change)
    volume: 0.1,

    // Window
    WindowWidth: 800,
    WindowHeight: 600,

    // Game
    SideSpeed: 200,
    JumpSpeed: 450,
    DashPower: 2,
    DashDuration: 500,
    Gravity: 800,
    LevelLength: 2800,
    PlatformHeight: 1400,
    PlatformFallingSpeed: 500,
    PlatformTimeBeforeFalling: 500,

    // Graphics
    ManualBorderWidth: 5,
    PoleWidth: 8,
    PoleHeight: 600,
    PlatformRotationHeight: 1800,
    ShadowOffset: new Vector(-10, -10),
    PlayerZIndex: 2,
    PlatformZIndexes: [0, 2, 4],
    LavaSize: 4000,
    LavaZIndexes: [1, 3, 5],
    LavaSpeed: [100, 60, 80],
    VulkanLayerSize: 3600,
    VulkanZIndexes: [-1, -2, -3, -4, -5]
};
