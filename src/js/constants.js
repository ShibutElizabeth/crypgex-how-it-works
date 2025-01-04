import { Color, Vector3 } from 'three';

// CrystalPlayground.js
export const COLORS = {
    white: new Color('#FFFFFF'),
    pink: new Color('#FF00FF'),
    blue: new Color('#4535FF'),
    violet: new Color('#882AEB'),
    black: new Color('#000000')
};

export const rectAreaLightsData = [
    {
        color: COLORS.violet,
        intensity: 10,
        size: 10,
        position: new Vector3(0, 0, -3)
    },
    {
        color: COLORS.blue,
        intensity: 10,
        size: 10,
        position: new Vector3(5, 0, 3)
    },
    {
        color: COLORS.blue,
        intensity: 10,
        size: 10,
        position: new Vector3(0, -6, -7)
    },
    {
        color: COLORS.blue,
        intensity: 5,
        size: 10,
        position: new Vector3(-5, 0, 3)
    },
    {
        color: COLORS.white,
        intensity: 25,
        size: 5,
        position: new Vector3(0, 1, 0)
    },
    {
        color: COLORS.white,
        intensity: 25,
        size: 5,
        position: new Vector3(0, -2, 0)
    },
    {
        color: COLORS.pink,
        intensity: 10,
        size: 3,
        position: new Vector3(0, 0, -2)
    },
    {
        color: COLORS.blue,
        intensity: 10,
        size: 10,
        position: new Vector3(-5, 0, 1)
    },
];
