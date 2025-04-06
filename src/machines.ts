type MachineCoefficient = number | ((tier:number, coilTier:number) => number);

type Machine = {
    perfectOverclock: boolean;
    coil: boolean;
    speed: MachineCoefficient;
    power: MachineCoefficient;
    parallels: MachineCoefficient;
}

type MachineList = {
    [key: string]: Machine;
}

const machines: MachineList = {};

machines["Electric Blast Furnace"] = {
    perfectOverclock: false,
    coil: false,
    speed: (tier: number, coilTier: number) => { // TODO: special formula
        return 1;
    },
    power: (tier: number, coilTier: number) => { // TODO: special formula
        return 1;
    },
    parallels: 1,
};

machines["Multi Smelter"] = {
    perfectOverclock: false,
    coil: true,
    speed: (tier: number, coilTier: number) => { // TODO: increases with coil tier
        return 1;
    },
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: 8-8192 (increases with coil tier)
        return 8;
    },
};

machines["Dimensionally Transcendent Plasma Forge"] = {
    perfectOverclock: true, // TODO: Perfect Overclocks when Convergence is active (increased catalyst cost)
    coil: false,
    speed: 1, // TODO: Perfect Overclocks when Convergence is active (increased catalyst cost)
    power: (tier: number, coilTier: number) => { // TODO: up to 50% after 8 hours continuous run time
        return 1;
    },
    parallels: 1,
};

machines["Pyrolyse Oven"] = {
    perfectOverclock: false,
    coil: true,
    speed: (tier: number, coilTier: number) => -0.5 + 0.5 * coilTier,
    power: 1,
    parallels: 1,
};

machines["Large Chemical Reactor"] = {
    perfectOverclock: true,
    coil: false,
    speed: 1,
    power: 1,
    parallels: 1,
};

machines["Bacterial Vat"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: (tier: number, coilTier: number) => { // TODO: maximum efficiency boost keep the Output Hatch always half filled!
        return 1;
    },
    parallels: 1,
};

machines["Mega Blast Furnace"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: 256,
};

machines["Mega Vacuum Freezer"] = {
    perfectOverclock: true, // TODO: Perfect overclocks with Subspace Cooling
    coil: false,
    speed: 1, // TODO: Perfect overclocks with Subspace Cooling
    power: (tier: number, coilTier: number) => { // TODO: increases with coolant type and amount (Subspace Cooling)
        return 1;
    },
    parallels: 256,
};

machines["Electric Implosion Compressor"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: (tier: number, coilTier: number) => Math.pow(4, tier - 1),
};

machines["Circuit Assembly Line"] = {
    perfectOverclock: true,
    coil: false,
    speed: 1,
    power: 1,
    parallels: 1,
};

machines["Mega Distillation Tower"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: 256,
};

machines["Mega Chemical Reactor"] = {
    perfectOverclock: true,
    coil: false,
    speed: 1,
    power: 1,
    parallels: 256,
};

machines["Helioflare Power Forge"] = {
    perfectOverclock: false,
    coil: false,
    speed: (tier: number, coilTier: number) => { // TODO: specialized towards speed
        return 1;
    },
    power: 1,
    parallels: 1,
};

machines["Naquadah Fuel Refinery"] = {
    perfectOverclock: false,
    coil: true,
    speed: (tier: number, coilTier: number) => { // TODO: unlock more fuel types with higher tier coils
        return 1;
    },
    power: (tier: number, coilTier: number) => { // TODO: reduce processing times with higher tier coils
        return 1;
    },
    parallels: 1,
};

machines["Large Fluid Extractor"] = {
    perfectOverclock: false,
    coil: true,
    speed: (tier: number, coilTier: number) => 0.5 * Math.pow(1.1, coilTier),
    power: (tier: number, coilTier: number) => Math.pow(0.9, coilTier),
    parallels: 16, // TODO: 8 * solenoid tier (MV is tier 2)
};

machines["Hyper-Intensity Laser Engraver"] = {
    perfectOverclock: false,
    coil: false,
    speed: 3, // 200% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: cube root of laser source amperage input
        return 1;
    },
};

machines["Dissection Apparatus"] = {
    perfectOverclock: false,
    coil: false,
    speed: 3, // 200% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 8 * tier, // TODO: 8 per tier of Item Pipe Casing
};

machines["Big Barrel Brewery"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1.5, // 50% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 4 * tier,
};

machines["Dangote Distillus"] = {
    perfectOverclock: false,
    coil: false,
    speed: (tier: number, coilTier: number) => { // TODO: 250% faster in DT mode  100% faster in distillery mode
        return 1;
    },
    power: (tier: number, coilTier: number) => { // TODO: 85% less energy in distillery mode
        return 1;
    },
    parallels: (tier: number, coilTier: number) => { // TODO: DTower Mode: T1=4  T2=12; Distillery Mode: Tower Tier * (4*InputTier)
        return 1;
    },
};

machines["Zyngen"] = {
    perfectOverclock: false,
    coil: true,
    speed: (tier: number, coilTier: number) => 1 + 0.05 * coilTier,
    power: 1,
    parallels: (tier: number, coilTier: number) => tier * coilTier,
};

machines["Elemental Duplicator"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: (tier: number, coilTier: number) => 8 * tier,
};

machines["Boldarnator"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2,
    power: 1,
    parallels: (tier: number, coilTier: number) => tier * 8,
};

machines["Industrial Sledgehammer"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: (tier: number, coilTier: number) => tier * tier * 8, // TODO: Tier x Anvil Tier x 8 (assuming Anvil Tier is the same as Machine Tier for now)
};

machines["Thermic Heating Device"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2.2, // 120% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 8 * tier,
};

machines["Quantum Force Transformer"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: 1 + number of catalysts
        return 1;
    },
};

machines["Neutron Activator"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: (tier: number, coilTier: number) => { // TODO: time discount per extra Speeding Pipe Casing (reduces Neutron Accelerator efficiency)
        return 1;
    },
    parallels: 1,
};

machines["Precise Auto-Assembler MT-3662"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2, // 100% faster in Normal Mode
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: Imprecise (MK-0) = 16x MK-I = 32x MK-II = 64x MK-III = 128x MK-IV = 256x (in Normal Mode based on Precise Electronic Unit Casing)
        return 16 * Math.pow(2, tier); // Assuming tier corresponds to MK level (0-4)
    },
};

machines["Compact Fusion Computer MK-I Prototype"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: 64,
};

machines["Compact Fusion Computer MK-II"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: 128x if Startup < 160 000 000 EU 64x if Startup >= 160 000 000 EU
        return 64;
    },
};

machines["Compact Fusion Computer MK-III"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: 192x if Startup < 160 000 000 EU 128x if Startup < 320 000 000 EU 64x if Startup >= 320 000 000 EU
        return 64;
    },
};

machines["Compact Fusion Computer MK-IV Prototype"] = {
    perfectOverclock: true, // Performs 4/4 overclock
    coil: false,
    speed: 1,
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: 256x if Startup < 160 000 000 EU 192x if Startup < 320 000 000 EU 128x if Startup < 640 000 000 EU 64x if Startup >= 640 000 000 EU
        return 64;
    },
};

machines["Compact Fusion Computer MK-V"] = {
    perfectOverclock: true, // Performs 4/4 overclock
    coil: false,
    speed: 1,
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: 320x if Startup < 160 000 000 EU 256x if Startup < 320 000 000 EU 192x if Startup < 640 000 000 EU 128x if Startup < 1 200 000 000 EU 64x if Startup >= 1 200 000 000 EU
        return 64;
    },
};

machines["Magnetic Flux Exhibitor"] = {
    perfectOverclock: false,
    coil: false,
    speed: (tier: number, coilTier: number) => { // TODO: bonuses depend on electromagnet
        return 1;
    },
    power: (tier: number, coilTier: number) => { // TODO: bonuses depend on electromagnet
        return 1;
    },
    parallels: 1,
};

machines["TurboCan Pro"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2, // 100% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 8 * tier,
};

machines["Fluid Shaper"] = {
    perfectOverclock: false,
    coil: false,
    speed: (tier: number, coilTier: number) => { // TODO: up to 200% faster
        return 1;
    },
    power: 1,
    parallels: (tier: number, coilTier: number) => 2 * tier + 3 * tier * 0, // Assuming no width expansion by default
};

machines["Industrial Precision Lathe"] = {
    perfectOverclock: false,
    coil: false,
    speed: (tier: number, coilTier: number) => { // TODO: increases based on item pipe casing speed and voltage
        return 1;
    },
    power: 0.8,
    parallels: (tier: number, coilTier: number) => tier + (tier * 2), // TODO: Item Pipe Casing Parallel + (Voltage Tier * 2) - Assuming Item Pipe Casing Parallel is the same as Voltage Tier for now
};

machines["Industrial Autoclave"] = {
    perfectOverclock: false,
    coil: true,
    speed: (tier: number, coilTier: number) => 1 + 0.25 * coilTier,
    power: (tier: number, coilTier: number) => { // TODO: Energy consumption reduced with higher fluid pipe tiers
        return 1;
    },
    parallels: (tier: number, coilTier: number) => 12 * tier, // TODO: 12 per Item Pipe Casing Tier - Assuming Item Pipe Casing Tier is the same as Voltage Tier for now
};

machines["Nuclear Salt Processing Plant"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2.5, // 150% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 2 * tier,
};

machines["Industrial Centrifuge"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2.25, // 125% faster
    power: 0.9,
    parallels: (tier: number, coilTier: number) => 6 * tier,
};

machines["Industrial Coke Oven"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: (tier: number, coilTier: number) => 1 - 0.04 * tier,
    parallels: (tier: number, coilTier: number) => { // TODO: 12 with Heat Resistant Casings 24 with Heat Proof Casings - Assuming a fixed tier for these casings
        return 12;
    },
};

machines["Industrial Material Press"] = {
    perfectOverclock: false,
    coil: false,
    speed: 6, // 500% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 4 * tier,
};

machines["Industrial Electrolyzer"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2.8, // 180% faster
    power: 0.9,
    parallels: (tier: number, coilTier: number) => 2 * tier,
};

machines["Industrial Maceration Stack"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1.6, // 60% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 2 * tier, // TODO: up to n*tier (n=2 initially n=8 with Maceration Upgrade Chip)
};

machines["Industrial Wire Factory"] = {
    perfectOverclock: false,
    coil: false,
    speed: 3, // 200% faster
    power: 0.75,
    parallels: (tier: number, coilTier: number) => 4 * tier,
};

machines["Matter Fabrication CPU"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1, // +0%
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: Scrap = 64  UU = 8 * Tier
        return 8 * tier;
    },
};

machines["Industrial Mixing Machine"] = {
    perfectOverclock: false,
    coil: false,
    speed: 3.5, // 250% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 8 * tier,
};

machines["Large Sifter Control Block"] = {
    perfectOverclock: false,
    coil: false,
    speed: 5, // 400% faster
    power: 0.75,
    parallels: (tier: number, coilTier: number) => 4 * tier,
};

machines["Large Thermal Refinery"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2.5, // 150% faster
    power: 0.8,
    parallels: (tier: number, coilTier: number) => 8 * tier,
};

machines["Ore Washing Plant"] = {
    perfectOverclock: false,
    coil: false,
    speed: 5, // 400% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 4 * tier,
};

machines["Industrial Extrusion Machine"] = {
    perfectOverclock: false,
    coil: false,
    speed: 3.5, // 250% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 4 * tier,
};

machines["High Current Industrial Arc Furnace"] = {
    perfectOverclock: false,
    coil: false,
    speed: 3.5, // 250% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => { // TODO: voltage tier * W (Electric mode)  8 * voltage tier * W (Plasma mode) - Assuming W is 1 for now
        return tier;
    },
};

machines["Solar Tower"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: (tier: number, coilTier: number) => { // TODO: increases with heat and number of reflectors
        return 1;
    },
    parallels: 1,
};

machines["Large Scale Auto-Assembler v1.01"] = {
    perfectOverclock: false,
    coil: false,
    speed: 3, // 200% faster
    power: 1,
    parallels: (tier: number, coilTier: number) => 2 * tier,
};

machines["Cryogenic Freezer"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2, // +100%
    power: 1,
    parallels: 4,
};

machines["Amazon Warehousing Depot"] = {
    perfectOverclock: false,
    coil: false,
    speed: 6, // 500% faster
    power: 0.75,
    parallels: (tier: number, coilTier: number) => 16 * tier,
};

machines["Volcanus"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2.2, // +120%
    power: 0.9,
    parallels: 8,
};

machines["Density^2"] = {
    perfectOverclock: false,
    coil: false,
    speed: 2, // +100%
    power: 1,
    parallels: (tier: number, coilTier: number) => Math.floor((tier / 2) + 1),
};

machines["FusionTech MK IV"] = {
    perfectOverclock: true, // Performs 4/4 overclocks
    coil: false,
    speed: 1,
    power: 1,
    parallels: 1,
};

machines["FusionTech MK V"] = {
    perfectOverclock: true, // Performs 4/4 overclocks
    coil: false,
    speed: 1,
    power: 1,
    parallels: 1,
};

machines["Industrial Cutting Factory"] = {
    perfectOverclock: false,
    coil: false,
    speed: 3, // 200% faster
    power: 0.75,
    parallels: (tier: number, coilTier: number) => 4 * tier,
};

machines["Utupu-Tanuri"] = {
    perfectOverclock: false,
    coil: false,
    speed: (tier: number, coilTier: number) => { // TODO: +120% (upgraded overclocks reduce recipe time to 25%)
        return 2.2;
    },
    power: (tier: number, coilTier: number) => { // TODO: 5% speedup per 900K over min. Heat Capacity (multiplicative)
        return 1;
    },
    parallels: 4,
};

machines["ExxonMobil Chemical Plant"] = {
    perfectOverclock: false,
    coil: false,
    speed: 1,
    power: (tier: number, coilTier: number) => { // TODO: +20% chance of not damaging catalyst per pipe casing tier
        return 1;
    },
    parallels: (tier: number, coilTier: number) => 2 * tier, // TODO: +2 per pipe casing tier - Assuming pipe casing tier is the same as voltage tier
};