<div align="center">

# 🌾 Wheel of Creation: Agriculture Update

### _A Realistic Farming Revolution for Minecraft Bedrock_

[![Minecraft](https://img.shields.io/badge/Minecraft-Bedrock%201.21+-green?style=for-the-badge&logo=minecraft)](https://minecraft.net)
[![License](https://img.shields.io/badge/License-GPL%20v3-blue?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Script%20API-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

🌐 **[🇪🇸 Leer en Español](./AGRICULTURE_UPDATE_I_SPANISH.md)** | **[🇧🇷 Ler em Português](./AGRICULTURE_UPDATE_I_PORTUGUESE.md)**

---

**Transform your Minecraft farming experience with a comprehensive agricultural system that introduces biome-based climate mechanics, crop genetics, soil hydration, and realistic plant growth cycles.**

> 🎮 **Inspired by [TerraFirmaCraft](https://terrafirmacraft.com/)** — This addon takes inspiration from some mechanics of the popular Java mod TerraFirmaCraft. However, this is **NOT** an official port. All systems have been completely reimagined and reinterpreted for Minecraft Bedrock Edition by **HormigaDev**.

![Screenshot1](../../assets/portada.png)

</div>

---

<div align="center">

### 🌾 Agriculture Update I — Part of an Expanding Series

This is the **first release** of the Agriculture Update series. The **Agriculture Update II** is now available with:

🥗 **Diet & Nutrition System** | 🍳 **29 Cooking Recipes** | 🌽 **4 New Crops (Tomato, Cabbage, Onion, Rice)** | 🥧 **Food Processing & Vanilla Rebalancing**

👉 **[Read Agriculture Update II](./AGRICULTURE_UPDATE_II_ENGLISH.md)**

</div>

---

<div align="center">

### ✅ 100% FUNCTIONAL — Read Before Playing!

</div>

> 📢 **Important Clarification**: This addon focuses on **crop mechanics** and is the first of many planned updates. However, this does **NOT** mean the addon is incomplete or that something doesn't work properly.
>
> 🎮 **The addon is 100% functional and ready to play.** All crop systems, climate mechanics, genetics, composting, and tools work exactly as designed. You can install it right now and enjoy a complete, polished farming experience.
>
> 🔧 **Why "Update I"?** There are many more features in active development that will expand the addon over time. By releasing in updates, I can deliver quality content sooner and gather valuable player feedback.
>
> 💬 **Your feedback matters!** If you play and share your experience, you'll help me balance the mechanics better. Report bugs, suggest tweaks, or just tell me what you think — the community shapes this project.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [Game Mechanics](#-game-mechanics)
    - [Climate System](#-climate-system)
    - [Soil & Hydration](#-soil--hydration)
    - [Crop Types](#-crop-types)
    - [Crop Quality System](#-crop-quality-system)
    - [Better Composter](#-better-composter)
    - [Crop Inspector](#-crop-inspector)
- [Crop Reference Guide](#-crop-reference-guide)
- [Biome Compatibility](#-biome-compatibility)
- [Tips & Strategies](#-tips--strategies)
- [Installation](#-installation)
- [Credits](#-credits)

---

## 🌍 Overview

**Wheel of Creation: Agriculture Update** reimagines Minecraft's farming system from the ground up. Gone are the days of mindless bone meal spam and infinite farmlands. This addon introduces a sophisticated agricultural simulation where:

- 🌡️ **Temperature matters** — Crops have optimal temperature ranges and can die from extreme heat or cold
- 💧 **Hydration is dynamic** — Soil moisture levels fluctuate based on biome, weather, and water proximity
- 🧬 **Genetics affect yields** — "Wild" vs "Select" seeds produce dramatically different results
- 🌿 **Weeds compete** — Neglected crops can be overtaken by invasive weeds
- 🍂 **Crops can fail** — Drought, rot, and temperature extremes can kill your plants
- ⏰ **Offline Growth** — Crops grow even when chunks are unloaded! Go explore freely!

---

<div align="center">

### ⏰ TRUE OFFLINE GROWTH — A Game Changer!

</div>

> 🚀 **No need to stay near your farm!** Unlike vanilla Minecraft, crops in this addon **grow even when chunks are unloaded**. Since growth times are realistically long (days to weeks), you can freely explore the world, go mining, or embark on adventures. When you return and the game assigns a random tick to a crop block, **it automatically calculates all elapsed time** and determines:
>
> - ✅ How many growth stages should have passed
> - ✅ Whether the crop should already be mature
> - ✅ If environmental conditions caused death during your absence
>
> **This is NOT a minor detail** — it completely changes how you can play the game!

---

<div align="center">

### 🌐 PERFECT FOR MULTIPLAYER SERVERS!

</div>

> 🎮 **Give purpose to the Farmer role!** This addon is ideal for **multiplayer servers** (tested on third-party servers, **not yet tested on Realms**). The realistic farming mechanics create a genuine need for dedicated farmers:
>
> - 👨‍🌾 **Farmer players become essential** — Not everyone can efficiently grow crops
> - 📈 **Create player-driven economies** — Farmers can trade their valuable harvests
> - 🏘️ **Encourage specialization** — Some players farm, others explore, others build
> - 🤝 **Foster community cooperation** — Villages need farmers to thrive
>
> **Transform your server's economy with meaningful agricultural gameplay!**

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🌡️ Biome-Based Climate

Every biome has unique characteristics:

- Base humidity (0-10)
- Temperature (°C)
- Evaporation rate
- Rot probability
- Weed growth chance
- Rain sensitivity

</td>
<td width="50%">

### 💧 Dynamic Soil System

The custom farmland block tracks:

- Hydration level (0-10)
- Fertilizer level (0-10)
- Visual texture changes
- Weather responsiveness

</td>
</tr>
<tr>
<td>

### 🌱 Realistic Growth Cycles

Crops take real time to mature:

- Wheat: ~48 in-game days
- Potatoes: ~60 in-game days
- Pumpkins/Melons: ~64 days stem + fruit cycles
- Growth speed affected by conditions

</td>
<td>

### 🧬 Seed Genetics System

Two quality tiers for seeds:

- **Wild (Standard)**: Lower yields, higher weed risk
- **Select (Premium)**: Higher yields, disease resistance

</td>
</tr>
</table>

![Screenshot2](../../assets/s2.png)

---

## 🚀 Getting Started

### First Steps

1. **Create a Hoe** — Any hoe will work
2. **Till the Soil** — Use the hoe on grass/dirt blocks to create `woc:farmland`
3. **Check Conditions** — Craft a **Crop Inspector** to analyze soil and climate
4. **Choose Wisely** — Plant crops suited to your biome's temperature and humidity
5. **Maintain Your Farm** — Apply fertilizer, ensure water sources, and monitor health

### Quick Tips for Beginners

> ⚠️ **Important**: Standard Minecraft seeds (`minecraft:wheat_seeds`) produce "Wild" crops. For better yields, you need to obtain "Select" seeds through careful farming.

---

## ⚙️ Game Mechanics

### 🌡️ Climate System

Each biome in Minecraft now has a complete climate profile that affects farming:

```
┌─────────────────────────────────────────────────────────────┐
│  BIOME DATA STRUCTURE                                       │
├─────────────────────────────────────────────────────────────┤
│  [0] Base Humidity      (0-10)    - Starting soil moisture  │
│  [1] Temperature        (°C)      - Affects crop survival   │
│  [2] Evaporation Factor (0-1)     - Water loss probability  │
│  [3] Rot Factor         (0-1)     - Disease probability     │
│  [4] Weed Chance        (0-1)     - Parasitic plant risk    │
│  [5] Rain Sensitivity   (0-1)     - Weather impact          │
└─────────────────────────────────────────────────────────────┘
```

#### Climate Examples:

| Biome              | Humidity | Temp (°C) | Evap. | Rot | Weeds | Rain Sens. |
| ------------------ | :------: | :-------: | :---: | :-: | :---: | :--------: |
| 🏜️ Desert          |    0     |    45     |  40%  | 0%  |  0%   |    90%     |
| 🌴 Jungle          |    9     |    30     |  0%   | 3%  |  12%  |    80%     |
| 🌲 Taiga           |    6     |     5     |  2%   | 1%  |  2%   |    40%     |
| 🌻 Plains          |    5     |    18     |  2%   | 1%  |  5%   |    40%     |
| ❄️ Frozen Peaks    |    0     |    -25    |  25%  | 0%  |  0%   |     0%     |
| 🍄 Mushroom Island |    10    |    20     |  0%   | 5%  |  8%   |    90%     |

![Screenshot3](../../assets/s3.png)
![Screenshot4](../../assets/s4.png)

---

### 💧 Soil & Hydration

The custom **Farmland Block** (`woc:farmland`) is the foundation of farming. It actively tracks and displays moisture levels.

#### Hydration Mechanics

- **Water Sources**: Each water block within 3 blocks adds +2 hydration (max +4)
- **Altitude**: Higher altitudes reduce humidity, lower altitudes increase it
- **Weather**: Rain increases hydration in most biomes (reduced effect in arid zones)
- **Temperature**: High temperatures (>35°C) reduce hydration by 2

#### Visual Feedback

| Hydration Level | Appearance                       |
| :-------------: | -------------------------------- |
|       0-7       | Dry texture (cracked appearance) |
|      8-10       | Wet texture (dark, moist soil)   |

#### Fertilizer System

Apply **Fertilizer** to farmland to boost crop performance:

- **Maximum Level**: 10 units per block
- **Effects**:
    - 🚀 Increased growth speed
    - 🌾 Higher crop yields (+50% per fertilizer level)
    - 🛡️ Reduced weed probability
    - 📈 Extended plant lifespan for stem/column crops

> 💡 **Pro Tip**: Fertilizer is consumed gradually as crops grow. Check your soil regularly!

---

### 🌾 Crop Types

The addon features three distinct crop categories, each with unique mechanics:

#### 1️⃣ Base Crops

_Traditional row crops that grow in vertical stages_

| Crop         | Stages | Growth Time | Min Hydro | Max Hydro | Temp Range | Preferred Biomes          |
| ------------ | :----: | :---------: | :-------: | :-------: | :--------: | ------------------------- |
| 🌾 Wheat     |   7    |   48 days   |     2     |     9     |   5-32°C   | Plains, Sunflower, Meadow |
| 🥕 Carrots   |   3    |   32 days   |     4     |     8     |   8-26°C   | Taiga, Grove, Forest      |
| 🥔 Potatoes  |   3    |   60 days   |     4     |     7     |  10-24°C   | Savanna, Hills, Mesa      |
| 🫒 Beetroots |   3    |   24 days   |     2     |     9     |  -5-18°C   | Snow, Ice, Cold           |

#### 2️⃣ Stem Crops

_Produce multiple fruits over their lifetime_

| Crop       | Stem Growth | Fruit Cycle | Min Fruits | Max Fruits | Preferred Biomes       |
| ---------- | :---------: | :---------: | :--------: | :--------: | ---------------------- |
| 🎃 Pumpkin |   64 days   |   10 days   |     3      |     8      | Plains, Forest, Meadow |
| 🍈 Melon   |   64 days   |   8 days    |     4      |     10     | Jungle, Swamp, River   |

**Stem Crop Lifecycle**:

1. Plant seed → Stem grows through 7 stages
2. At maturity → Stem produces fruit in adjacent blocks
3. Stem continues producing until it reaches max lifetime
4. Quality seeds produce more fruits over a longer period

![Screenshot8](../../assets/s8.png)
![Screenshot9](../../assets/s9.png)

#### 3️⃣ Column Crops

_Vertical growing plants with unique requirements_

| Crop          | Max Height |   Growth Time   | Water Required | Preferred Biomes            |
| ------------- | :--------: | :-------------: | :------------: | --------------------------- |
| 🎋 Sugar Cane |  3 blocks  | 16 days/segment |  ✅ Adjacent   | Swamp, Jungle, River, Beach |

**Column Crop Mechanics**:

- The bottom block is the "brain" that controls growth
- New segments spawn above until max height
- Requires adjacent water source (or high hydration farmland)
- Each root can produce limited segments before dying

![Screenshot5](../../assets/s5.png)

---

### 🧬 Crop Quality System

One of the most impactful features is the **genetic quality** system:

<table>
<tr>
<th width="50%">🌿 Wild Quality</th>
<th width="50%">⭐ Select Quality</th>
</tr>
<tr>
<td>

- Obtained from vanilla Minecraft seeds
- **70% growth speed**
- **50% base yield**
- Higher weed susceptibility (100%)
- Higher rot susceptibility (200%)
- Lower fruit production for stems
- 50% chance to drop Select seeds at harvest

</td>
<td>

- Obtained from `woc:` prefixed seeds
- **100% growth speed**
- **100%+ base yield**
- Reduced weed susceptibility (5-10%)
- Normal rot susceptibility (100%)
- Maximum fruit production for stems
- Always drops Select seeds

</td>
</tr>
</table>

#### How to Obtain Select Seeds

> 🏆 **Primary Source: Farmer Villagers!**
>
> The most reliable way to obtain Select seeds is through **trading with Farmer Villagers**. They offer high-quality Select seeds as part of their trade inventory. This is the recommended method for starting your premium seed collection!

| Seed Type            | How to Obtain                                        |
| -------------------- | ---------------------------------------------------- |
| `woc:wheat_seeds`    | 🏪 **Farmer Villager** or harvest Wild (50% chance)  |
| `woc:beetroot_seeds` | 🏪 **Farmer Villager** or harvest Wild (50% chance)  |
| `woc:carrot`         | 🏪 **Farmer Villager** or harvest Wild (50% chance)  |
| `woc:potato`         | 🏪 **Farmer Villager** or harvest Wild (50% chance)  |
| `woc:melon_seeds`    | 🏪 **Farmer Villager** or harvest Wild stem at death |
| `woc:pumpkin_seeds`  | 🏪 **Farmer Villager** or harvest Wild stem at death |

> 💡 **Pro Tip**: Find a village early and protect your Farmer Villagers! They are your key to agricultural success.

#### Wild vs Select Seed Comparison

![Screenshot10](../../assets/s10.png)

---

### ♻️ Better Composter

A complete overhaul of the composting system that produces **Fertilizer**:

![BetterComposterCrafting](../../assets/better_composter_crafting.png)
![Screenshot11](../../assets/s11.png)

#### How It Works

The Better Composter requires **balanced inputs** of two material types:

<table>
<tr>
<th>🟢 Green Materials (Nitrogen)</th>
<th>🟤 Brown Materials (Carbon)</th>
</tr>
<tr>
<td>

**High Tier (100% success)**

- Melon Block, Pumpkin
- Hay Block, Cake

**Mid Tier (85% success)**

- Wheat, Carrot, Potato, Beetroot
- Melon Slice, Cactus, Vines
- Lily Pad, All Leaves

**Low Tier (50% success)**

- All Seeds, Kelp
- Grass, Fern

</td>
<td>

**High Tier (100% success)**

- Mushroom Stems
- Mushroom Blocks

**Mid Tier (85% success)**

- Brown/Red Mushrooms
- Coarse Dirt, Podzol
- Dead Bush

**Low Tier (50% success)**

- Sticks
- Hanging Roots, Dried Kelp
- Mangrove Roots

</td>
</tr>
</table>

#### Composting Process

```
    Fill Both Sides         Use Bone Meal          Collect Fertilizer
         ↓                       ↓                        ↓
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│  🟢🟢🟢🟢     │      │                │      │                │
│  ═══════════  │  →   │   ✨ ACTIVATE   │  →   │  💚 4-8 Fert.  │
│  🟤🟤🟤🟤     │      │                │      │                │
└────────────────┘      └────────────────┘      └────────────────┘
  (4 Green + 4 Brown)      (Bone Meal)           (Random output)
```

#### Visual Indicators

- Fill level rises as materials are added
- Green sparkles = Green material success
- Brown particles = Brown material success
- Smoke = Material failed to compost

---

### 🔍 Crop Inspector

The **Crop Inspector** is an essential tool for any serious farmer. Hold it in your main hand to see real-time information on the action bar.

![Screenshot6](../../assets/s6.png)
![Screenshot7](../../assets/s7.png)

#### Information Displayed

**When looking at the sky/nothing:**

```
Biome: Plains   18°C
```

**When looking at Farmland:**

```
Biome: Plains   18°C
H: 7  F: 3  T: 18°C
Soil Ready for Planting
```

**When looking at a Growing Crop:**

```
Biome: Plains   18°C
H: 7  F: 3  T: 18°C
| Growth: 45% (3/7) | Health: Very Good (100% Speed)
```

**When looking at a Mature Stem Crop:**

```
Biome: Jungle   30°C
H: 9  F: 5  T: 30°C
| Yield: 4 / 8 Fruits (Select) | Health: Optimal (120% Speed)
```

#### Health Status Indicators

| Status       |    Color    | Meaning                                                    |
| ------------ | :---------: | ---------------------------------------------------------- |
| Optimal      |  🟣 Purple  | Maximum growth speed (120%), fertilized + ideal conditions |
| Very Good    |  🟢 Green   | Normal growth speed (100%), all conditions met             |
| Good         |  🟡 Yellow  | Stable growth, minor imperfections                         |
| Regular      |  🟠 Orange  | Suboptimal conditions                                      |
| Bad (Water)  |   🔴 Red    | Water shortage, reduced growth                             |
| Dormant      |   🔵 Blue   | Too cold, growth paused                                    |
| Fatal (Rot)  | ⚫ Dark Red | Dying from excess moisture                                 |
| Fatal (Dry)  | ⚫ Dark Red | Dying from dehydration                                     |
| Fatal (Heat) | ⚫ Dark Red | Dying from extreme heat                                    |
| Fatal (Cold) | ⚫ Dark Red | Dying from extreme cold                                    |

**When looking at the Better Composter:**

```
Composter Status:
Green: 3/4  Brown: 2/4
Add Materials...
```

**When looking at Dead Crops:**

```
Biome: Desert   45°C
   Dead Wheat
```

#### Crafting Recipe

![CropInspectorCrafting](../../assets/crop_inspector_crafting.png)

---

## 📊 Crop Reference Guide

### Complete Crop Specifications

<details>
<summary><b>🌾 Wheat (Click to expand)</b></summary>

| Property              | Value                            |
| --------------------- | -------------------------------- |
| **ID**                | `woc:wheat`                      |
| **Growth Stages**     | 7                                |
| **Growth Time**       | 48 in-game days (~16 real hours) |
| **Hydration Range**   | 2-9                              |
| **Temperature Range** | 5-32°C                           |
| **Base Drops**        | 1 Wheat                          |
| **Seed Drops**        | 2 Seeds                          |
| **Weed Probability**  | 5%                               |
| **Preferred Biomes**  | Plains, Sunflower Plains, Meadow |

**Tips:**

- Most versatile crop, tolerates wide humidity range
- Excellent for beginners
- Grows well in temperate biomes

</details>

<details>
<summary><b>🥕 Carrots (Click to expand)</b></summary>

| Property              | Value                        |
| --------------------- | ---------------------------- |
| **ID**                | `woc:carrots`                |
| **Growth Stages**     | 3                            |
| **Growth Time**       | 32 in-game days              |
| **Hydration Range**   | 4-8                          |
| **Temperature Range** | 8-26°C                       |
| **Base Drops**        | 2 Carrots                    |
| **Seed Drops**        | 0 (uses carrot as seed)      |
| **Weed Probability**  | 2%                           |
| **Preferred Biomes**  | Taiga, Grove, Meadow, Forest |

**Tips:**

- Low weed risk makes them reliable
- Prefer cooler, forested areas
- Medium moisture requirements

</details>

<details>
<summary><b>🥔 Potatoes (Click to expand)</b></summary>

| Property              | Value                            |
| --------------------- | -------------------------------- |
| **ID**                | `woc:potatoes`                   |
| **Growth Stages**     | 3                                |
| **Growth Time**       | 60 in-game days (~20 real hours) |
| **Hydration Range**   | 4-7                              |
| **Temperature Range** | 10-24°C                          |
| **Base Drops**        | 3 Potatoes                       |
| **Seed Drops**        | 0 (uses potato as seed)          |
| **Weed Probability**  | 15%                              |
| **Preferred Biomes**  | Savanna, Hills, Mountain, Mesa   |

**Tips:**

- Highest weed susceptibility - use Select seeds!
- Narrow humidity tolerance
- Long growth time but high yield
- Thrives in elevated, dry biomes

</details>

<details>
<summary><b>🫒 Beetroots (Click to expand)</b></summary>

| Property              | Value                           |
| --------------------- | ------------------------------- |
| **ID**                | `woc:beetroots`                 |
| **Growth Stages**     | 3                               |
| **Growth Time**       | 24 in-game days (~8 real hours) |
| **Hydration Range**   | 2-9                             |
| **Temperature Range** | -5 to 18°C                      |
| **Base Drops**        | 1 Beetroot                      |
| **Seed Drops**        | 1 Seed                          |
| **Weed Probability**  | 8%                              |
| **Preferred Biomes**  | Snow, Ice, Cold, Frozen         |

**Tips:**

- Only crop that thrives in freezing temperatures!
- Fastest growing base crop
- Wide humidity tolerance
- Perfect for cold biome farms

</details>

<details>
<summary><b>🎃 Pumpkin (Click to expand)</b></summary>

| Property              | Value                                   |
| --------------------- | --------------------------------------- |
| **ID**                | `woc:pumpkin_stem`                      |
| **Stem Stages**       | 7                                       |
| **Stem Growth Time**  | 64 in-game days                         |
| **Fruit Cycle**       | 10 days per fruit                       |
| **Hydration Range**   | 3-8                                     |
| **Temperature Range** | 5-35°C                                  |
| **Min/Max Fruits**    | 3-8 per lifetime                        |
| **Weed Probability**  | 3%                                      |
| **Preferred Biomes**  | Plains, Forest, Hills, Meadow, Mountain |

**Tips:**

- Very flexible temperature range
- Medium water requirements
- Low weed risk
- Good for temperate highland farms

</details>

<details>
<summary><b>🍈 Melon (Click to expand)</b></summary>

| Property              | Value                |
| --------------------- | -------------------- |
| **ID**                | `woc:melon_stem`     |
| **Stem Stages**       | 7                    |
| **Stem Growth Time**  | 64 in-game days      |
| **Fruit Cycle**       | 8 days per fruit     |
| **Hydration Range**   | 6-9                  |
| **Temperature Range** | 18-45°C              |
| **Min/Max Fruits**    | 4-10 per lifetime    |
| **Weed Probability**  | 8%                   |
| **Preferred Biomes**  | Jungle, Swamp, River |

**Tips:**

- Requires high humidity and temperature
- Fastest fruit production of stem crops
- Higher weed risk - use fertilizer!
- Thrives in tropical biomes

</details>

<details>
<summary><b>🎋 Sugar Cane (Click to expand)</b></summary>

| Property              | Value                               |
| --------------------- | ----------------------------------- |
| **ID**                | `woc:column_sugar_cane`             |
| **Max Height**        | 3 blocks                            |
| **Growth Time**       | 16 days per segment                 |
| **Hydration Range**   | 8-10                                |
| **Temperature Range** | 10-45°C                             |
| **Required Water**    | ✅ Adjacent or high hydration       |
| **Base Drops**        | 1 per segment                       |
| **Weed Probability**  | 1%                                  |
| **Preferred Biomes**  | Swamp, River, Jungle, Beach, Desert |

**Tips:**

- Very low weed risk
- Requires water source nearby OR farmland with 8+ hydration
- Extreme temperature tolerance
- Each root produces limited segments (5 + fertilizer level)

</details>

---

## 🗺️ Biome Compatibility

Use this chart to plan your farms based on location:

### Optimal Crop Placement by Biome Category

| Biome Type             | Best Crops               | Avoid            |
| ---------------------- | ------------------------ | ---------------- |
| **❄️ Frozen/Cold**     | Beetroots                | Melons, Potatoes |
| **🌲 Taiga/Forest**    | Carrots, Wheat           | Melons           |
| **🌻 Plains/Meadow**   | Wheat, Pumpkins, Carrots | —                |
| **🏔️ Mountains/Hills** | Potatoes, Pumpkins       | Melons           |
| **🌴 Jungle/Swamp**    | Melons, Sugar Cane       | Beetroots        |
| **🏜️ Desert/Mesa**     | Potatoes, Sugar Cane\*   | All others       |
| **🌊 Beach/River**     | Sugar Cane               | Most crops       |

\*Requires irrigation system

![Screenshot1](../../assets/s1.png)

---

## 💡 Tips & Strategies

### 🏆 Pro Farming Strategies

<details>
<summary><b>🌟 Beginner Strategy: Safe Start</b></summary>

1. Start in **Plains or Forest** biome
2. Farm **Wheat** first — most forgiving crop
3. Craft a **Crop Inspector** immediately
4. Build near water (within 3 blocks of farmland)
5. Upgrade to Select seeds before expanding

</details>

<details>
<summary><b>🌟 Intermediate Strategy: Diversification</b></summary>

1. Set up a **Better Composter** early
2. Plant diverse crops to ensure constant fertilizer materials
3. Match crops to your biome's strengths
4. Use fertilizer on high-value crops (Melons, Pumpkins)
5. Maintain a seed bank of Select varieties

</details>

<details>
<summary><b>🌟 Advanced Strategy: Biome Exploitation</b></summary>

1. Establish **satellite farms** in optimal biomes:
    - Snow biome → Beetroot farm
    - Jungle → Melon empire
    - Swamp → Sugar cane plantation
2. Use Nether portals for fast travel between farms
3. Apply maximum fertilizer (10) for stem crops
4. Time harvests with rain for natural irrigation

</details>

### ⚠️ Common Mistakes to Avoid

| Mistake                        | Why It's Bad                      | Solution                               |
| ------------------------------ | --------------------------------- | -------------------------------------- |
| Using Wild seeds exclusively   | 50% yield penalty                 | Invest in Select seed production       |
| Ignoring the Crop Inspector    | Crops die unexpectedly            | Check conditions before planting       |
| Planting melons in cold biomes | Fatal temperature damage          | Match crops to climate                 |
| Over-watering in jungles       | Rot kills crops                   | Use farmland with controlled hydration |
| Neglecting fertilizer          | Increased weed risk, lower yields | Maintain Better Composter              |

---

## Installation

### Requirements

- Minecraft Bedrock Edition **1.21.0** or higher
- **Experimental Features**: Upcoming Creator Features

![ExperimentalFeatures](../../assets/experimental_features.png)

### Installation Steps

1. Download the `.mcaddon` file from [Curseforge](https://curseforge.com)
2. Double-click the file to import into Minecraft
3. Create a new world or add to existing world
4. Enable the **Behavior Pack** and **Resource Pack**
5. Ensure both packs show version `0.0.1` or higher

### ⚠️ Compatibility Notes

- This addon **replaces** vanilla crop behavior
- Existing vanilla farms will continue working but won't benefit from new features
- New farmland must be created with a hoe on grass/dirt blocks

---

## 🏗️ Building from Source

For developers who want to contribute or customize:

```bash
# Clone the repository
git clone https://github.com/your-repo/wheel_of_creation.git

# Install dependencies
npm install

# Development mode (watch)
npm run dev

# Build for production
npm run build
```

### Project Structure

```
wheel_of_creation/
├── Behavior/           # Behavior Pack
│   ├── blocks/         # Block definitions (JSON)
│   ├── items/          # Item definitions (JSON)
│   ├── scripts/        # TypeScript source code
│   │   ├── features/   # Core game mechanics
│   │   │   ├── blocks/ # Block components (Crop, Farmland, etc.)
│   │   │   ├── items/  # Item logic (Crop Inspector)
│   │   │   └── environment/ # Weather system
│   │   ├── data/       # Scoreboard persistence
│   │   └── utils/      # Utilities (Times, Colors, etc.)
│   ├── loot_tables/    # Drop configurations
│   └── recipes/        # Crafting recipes
├── Resource/           # Resource Pack
│   ├── models/         # 3D models (geometry)
│   ├── textures/       # Block & item textures
│   └── texts/          # Localization files
└── scripts/            # Build scripts
```

---

## 🌐 Localization

The addon is fully translated in:

- 🇺🇸 English (en_US)
- 🇪🇸 Spanish (es_ES)
- 🇧🇷 Portuguese - Brazil (pt_BR)

Want to add your language? Check `Resource/texts/` for reference files!

---

## 📜 Credits

<div align="center">

### Created with 💚 by **HormigaDev**

---

| Role                       | Contributor                                                |
| -------------------------- | ---------------------------------------------------------- |
| 🎨 **Creator & Developer** | [HormigaDev](https://github.com/HormigaDev)                |
| 💡 **Inspiration**         | [TerraFirmaCraft](https://terrafirmacraft.com/) (Java Mod) |
| 🎮 **Platform**            | Minecraft Bedrock Edition                                  |

---

**Wheel of Creation: Agriculture Update** is part of the larger **Wheel of Creation** addon series, bringing realistic and immersive mechanics to Minecraft Bedrock Edition.

> ⚠️ **Disclaimer**: This addon is inspired by TerraFirmaCraft but is **NOT** an official port or affiliated project. All game mechanics, code, and assets have been completely reimagined and developed from scratch by HormigaDev for Minecraft Bedrock Edition.

</div>

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

This means you are free to:

- ✅ Use, modify, and distribute this addon
- ✅ Create derivative works
- ✅ Use for commercial purposes

Under the following conditions:

- 📋 Derivative works must also be licensed under GPL-3.0
- 📋 You must include the original copyright notice
- 📋 You must disclose your source code

**Contributions are welcome!** Feel free to submit pull requests, report issues, or suggest new features.

See the [LICENSE](LICENSE) file for full details.

---

## 💪 Support the Development

<div align="center">

### ❤️ Help Keep This Project Alive

</div>

This project **is and will always be open source and free**. My goal is to improve the Minecraft Bedrock ecosystem and give the community access to deeper, more immersive gameplay mechanics.

However, I want to be honest with you: **developing addons of this complexity takes hundreds of hours**. The biome systems, crop genetics, offline growth calculations, performance optimizations, and the constant testing across different devices—all of this requires a significant time investment that often comes at the expense of other responsibilities.

If you enjoy this level of depth in your Minecraft experience and want to see the **Wild Update**, **Diplomacy Update**, and future content released faster, consider supporting the project. Every contribution, no matter how small, helps me dedicate more time to development instead of other work.

<div align="center">

### 🌟 Your Support Makes a Difference

| What Your Support Enables                     |
| --------------------------------------------- |
| ⏰ More development time for upcoming updates |
| 🐛 Faster bug fixes and optimizations         |
| 🌍 More languages and better documentation    |
| 🧪 Testing on more devices and scenarios      |
| ☕ Coffee to fuel late-night coding sessions  |

---

[![PayPal](https://img.shields.io/badge/PayPal-Donate-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/donate/?hosted_button_id=UCL7EE2G44KPQ)

**[Click here to donate via PayPal](https://www.paypal.com/donate/?hosted_button_id=UCL7EE2G44KPQ)**

---

</div>

> 🙏 **Thank you** to everyone who has already supported or contributed to this project. Whether through donations, bug reports, translations, or simply spreading the word—you are what makes open source amazing.

---

## 💬 Join the Community

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-BBEL%20Studios-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/m7cs2EUc8z)

**Want to chat, share feedback, or just hang out?**

Join the **BBEL Studios** Discord server! Talk directly with me, share your farms, report bugs, suggest ideas, or just connect with other players.

**[👉 Click here to join the Discord](https://discord.gg/m7cs2EUc8z)**

</div>

---

<div align="center">

**[⬆ Back to Top](#-wheel-of-creation-addon)**

---

_Last Updated: February 2026 | Version 0.0.1 | Agriculture Update I_

**Made with ❤️ by HormigaDev — Open Source under GPL-3.0**

![ScreenshotEnd](../../assets/end.png)

</div>
