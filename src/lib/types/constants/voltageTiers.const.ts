export type GtVoltageTier = {
    name:string;
    voltage:number;
}

export var voltageTier:GtVoltageTier[] = [
    {name: "LV", voltage: 32},
    {name: "MV", voltage: 128},
    {name: "HV", voltage: 512},
    {name: "EV", voltage: 2048},
    {name: "IV", voltage: 8192},
    {name: "LuV", voltage: 32768},
    {name: "ZPM", voltage: 131072},
    {name: "UV", voltage: 524288},
    {name: "UHV", voltage: 2097152},
    {name: "UEV", voltage: 8388608},
    {name: "UIV", voltage: 33554432},
    {name: "UMV", voltage: 134217728},
    {name: "UXV", voltage: 536870912},
    {name: "MAX", voltage: 2147483640}
];

export const TIER_LV = 0;
export const TIER_MV = 1;
export const TIER_HV = 2;
export const TIER_EV = 3;
export const TIER_IV = 4;
export const TIER_LUV = 5;
export const TIER_ZPM = 6;
export const TIER_UV = 7;
export const TIER_UHV = 8;
export const TIER_UEV = 9;
export const TIER_UIV = 10;
export const TIER_UMV = 11;
export const TIER_UXV = 12;
export const TIER_MAX = 13;