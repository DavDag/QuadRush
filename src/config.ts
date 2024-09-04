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
    PoleWidth: 8,
    PoleHeight: 600,
    PlatformRotationHeight: 1550,
    ShadowOffset: new Vector(-3, -3),
    PlayerZIndex: 1,
    PlatformZIndex1: 1,
    PlatformZIndex2: 1,
    PlatformZIndex3: 1,
    LavaSize: 4000,
    LavaZIndexes: [1, 2, 3],
    VulkanLayerSize: 3600,
    VulkanZIndexes: [-1, -2, -3]
};
