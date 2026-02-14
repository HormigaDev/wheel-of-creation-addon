# 📋 Changelog — Wheel of Creation

All notable changes to the **Wheel of Creation** addon are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [0.1.0] — 2026-02-11 — Agriculture Update II

### 🌱 New Crops

- **Tomatoes** (`woc:tomatoes`) — 8 growth stages, 56-day cycle, 15–30°C, hydration 5–7. Highest weed probability (18%). Yields 4 tomatoes + 2 seeds.
- **Cabbages** (`woc:cabbages`) — 8 growth stages, 72-day cycle, -10 to 15°C, hydration 4–8. Cold-climate crop with low weed risk (2%). Yields 1 cabbage + 2 seeds.
- **Onions** (`woc:onions`) — 4 growth stages, 64-day cycle, 5–25°C, hydration 3–7. Self-seeding crop (like carrots). Yields 3 onions.
- **Rice** (`woc:rices`) — First **Water Crop** category. Two-block growth system (base submerged + panicle above water). 5+4 stages, 64-day cycle, 18–34°C. Grows on dirt/mud/grass, NOT farmland. Requires water submersion.

### 🍳 New Food Items (29 total)

#### Raw Ingredients

- Tomato, Onion, Cabbage, Rice, Cabbage Leaf, Wheat Dough, Bacon, Cooked Bacon, Fried Egg, Milk Bottle

#### Sandwiches (stack to 64)

- Egg Sandwich, Chicken Sandwich, Bacon Sandwich

#### Bowl Meals (stack to 16, return bowl)

- Beef Stew, Chicken Soup, Bacon & Eggs, Bone Broth, Steak & Potatoes
- Fish Stew, Baked Cod Stew
- Cooked Rice, Fried Rice, Mushroom Rice
- Mixed Salad, Tomato Sauce, Pumpkin Soup, Vegetable Soup

#### Multi-Variant Recipes

- Dumplings (5 variants: beef, chicken, mutton, porkchop, rabbit)
- Cabbage Rolls (5 variants: beetroot, carrot, onion, potato, tomato)

### 🥗 Diet & Nutrition System

- **7 nutrient groups**: Fruits, Proteins, Vegetables, Grains, Sugars, Dairy, Fats (each 0–100%)
- **Digestion simulation**: nutrients burn at different rates every ~20 seconds (Sugars fastest at 1.6×, Fats slowest at 0.6×)
- **Repetition penalty**: eating the same food repeatedly reduces effectiveness by 10% per repeat in last 10 meals (min 20%)
- **Synergies**: high Sugars+Grains slow Protein/Fat burning; sprinting accelerates Fruit/Sugar burning
- **3 combat buffs/debuffs**:
    - Max Health: 10–40 HP based on Sugars (30%), Fruits (25%), Vegetables (20%), Grains (15%), Dairy+Fats (10%)
    - Attack Damage: ×0.6–×1.6 based on Proteins (40%), Grains (25%), Fruits (15%), Sugars+Vegetables (20%)
    - Damage Resistance: ×0.6–×1.4 based on Fats (35%), Dairy (25%), Proteins (20%), Grains+Vegetables (20%)
- **Balance factor**: smoothstep curve suppresses buffs if diet is unbalanced
- Debuffs configurable (disabled by default)

### 📖 New Tools

- **Diet Book** (`woc:diet_book`) — Hold to display all 7 nutrient percentages on the action bar with color-coded indicators

### 🔧 New Recipes (30+)

- Wheat Dough (8 wheat + water bucket → 3 dough, shaped)
- Bread reworked (wheat dough → furnace → bread, replaces vanilla recipe)
- Bacon (porkchop → stonecutter → 2 bacon)
- Rice Threshing (rice panicle → stonecutter → rice; select panicle → 2 rice)
- Milk Bottle (8 glass bottles + milk bucket → 8 milk bottles, shaped)
- Cabbage Leaf (1 cabbage → 2 cabbage leaf)
- All sandwiches, stews, dumplings, rolls (see food items above)
- Diet Book crafting recipe

### ⚖️ Vanilla Food Rebalancing

- **39 vanilla foods rebalanced** with reduced nutrition and saturation values
- Cooked Beef: 8 → 3 nutrition (-62%)
- Cooked Porkchop: 8 → 3 (-62%)
- Cooked Chicken: 6 → 3 (-50%)
- Bread: 5 → 3 (-40%)
- Apple: 4 → 2 (-50%)
- Baked Potato: 5 → 2 (-60%)
- Purpose: incentivize cooking elaborate meals over simple vanilla foods

### 🌱 New Seeds

- Cabbage Seeds / Select Cabbage Seeds
- Tomato Seeds / Select Tomato Seeds
- Select Onion (self-seeding)
- Rice Panicle / Select Rice Panicle

### 🏪 Updated Farmer Trades

- **Tier 4** (150 XP): Farmer buys new crops (tomato ×20, cabbage ×12, onion ×22, rice ×26 → 1 emerald)
- **Tier 4**: Farmer sells select seeds for new crops (6 emeralds each)

### 🔧 Technical Changes

- New crop category: **Water Crops** (WaterCrop.ts) with liquid detection and two-block growth
- Scripts restructured into `agriculture_update/` subdirectory
- New `BiMap` utility class
- New `ArmorSystem` utility for thermal calculations
- Crop Inspector updated with Water Crop handler
- Planting handler expanded to support water crop planting mechanics
- Player entity definition added for diet system integration
- Item interaction system expanded with new configuration

### 📝 Documentation

- Agriculture Update II documentation created in 3 languages (EN, ES, PT)
- Agriculture Update I documentation updated: "Coming Soon" replaced with links to Update II
- README.md updated with trilingual project description
- CHANGELOG.md created

---

## [0.0.1] — 2026-02 — Agriculture Update I

### Added

- **Biome-based climate system**: temperature, humidity, evaporation, rot, weed probability, and rain sensitivity per biome
- **Custom Farmland** (`woc:farmland`): dynamic hydration (0–10), fertilizer tracking (0–10), visual texture changes
- **6 crop types**: Wheat (7 stages, 48 days), Carrots (3 stages, 32 days), Potatoes (3 stages, 60 days), Beetroots (3 stages, 24 days), Pumpkin Stem (7 stages + fruit), Melon Stem (7 stages + fruit), Sugar Cane (column, 3 blocks)
- **Seed genetics**: Wild (standard, 70% speed, 50% yield) vs Select (premium, 100% speed, 100%+ yield)
- **Offline growth**: crops calculate elapsed time when chunks are reloaded
- **Better Composter** (`woc:better_composter`): balanced green/brown material composting system producing fertilizer
- **Crop Inspector** (`woc:crop_inspector`): real-time HUD showing biome data, soil stats, crop health and growth progress
- **Weed system**: neglected crops can be replaced by weeds based on biome and seed quality
- **Dead crop states**: crops die from drought, rot, extreme heat, or extreme cold
- **Farmer Villager trades**: 5 tiers of trading including select seed sales
- **Fertilizer** and **Creative Fertilizer** items
- **Straw** drop from wheat harvesting
- Full localization: English, Spanish, Portuguese
- Custom textures and models for all blocks and items

---

<div align="center">

_Maintained by [HormigaDev](https://github.com/HormigaDev) — GPL-3.0_

</div>
