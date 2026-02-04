# 🤝 Contributing to Wheel of Creation

First off, **thank you** for considering contributing to Wheel of Creation! It's people like you that make this addon better for everyone in the Minecraft Bedrock community.

This document provides guidelines and information about contributing to this project. Please read it before submitting any contributions.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
    - [Reporting Bugs](#-reporting-bugs)
    - [Suggesting Features](#-suggesting-features)
    - [Translations](#-translations)
    - [Code Contributions](#-code-contributions)
- [Development Setup](#-development-setup)
- [Project Structure](#-project-structure)
- [Code Standards](#-code-standards)
- [Pull Request Process](#-pull-request-process)
- [Recognition](#-recognition)

---

## 📜 Code of Conduct

This project follows a simple code of conduct:

- **Be respectful** — Treat everyone with respect. No harassment, discrimination, or toxic behavior.
- **Be constructive** — Criticism is welcome when it's constructive and helps improve the project.
- **Be patient** — This is a one-person project maintained in spare time. Responses may take a few days.
- **Be collaborative** — We're all here to make Minecraft Bedrock better.

> ⚠️ **Note**: This addon is inspired by TerraFirmaCraft but is NOT affiliated with it. Please don't create issues comparing features or requesting exact replicas of TFC mechanics.

---

## 🌟 How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Here's how to report it effectively:

1. **Search existing issues** — Check if the bug has already been reported.
2. **Create a new issue** with the `bug` label.
3. **Include this information**:
    - Minecraft Bedrock version
    - Device/platform (Windows, Android, iOS, Xbox, etc.)
    - Steps to reproduce the bug
    - Expected behavior vs actual behavior
    - Screenshots or videos if possible
    - Any error messages from the content log

**Good bug report example:**

```
Title: Crops don't grow in Cherry Grove biome

Minecraft Version: 1.21.50
Platform: Windows 11
Steps:
1. Create farmland in Cherry Grove biome
2. Plant wheat seeds
3. Wait for multiple in-game days
4. Crop never advances past stage 0

Expected: Wheat should grow normally
Actual: Wheat stays at stage 0 indefinitely

Content Log Error: None visible
```

### 💡 Suggesting Features

Have an idea? We'd love to hear it!

1. **Check the Roadmap** — Your idea might already be planned.
2. **Create an issue** with the `enhancement` label.
3. **Describe your idea** including:
    - What problem does it solve?
    - How would it work?
    - How does it fit with the addon's vision of realistic survival?

> 🎯 **Remember**: This addon aims for **realism and challenge**, not convenience. Features that make the game easier won't be considered.

### 🌍 Translations

Want to translate the addon to your language?

**In-game texts** (`Resource/texts/`):

1. Copy `en_US.lang` as a template
2. Create a new file with your locale code (e.g., `fr_FR.lang`)
3. Translate all strings while keeping the keys intact
4. Submit a PR

**Documentation**:

1. Copy the English README or other docs
2. Create translated versions in `docs/` folder
3. Use naming convention: `README_XX.md` where XX is language code

### 💻 Code Contributions

Ready to code? Awesome! Here's how:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly** in-game
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

---

## 🛠️ Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Minecraft Bedrock Edition (latest version)
- A code editor (VS Code recommended)

### Setup Steps

```bash
# 1. Clone your fork
git clone https://github.com/YOUR_USERNAME/wheel_of_creation.git
cd wheel_of_creation

# 2. Install dependencies
npm install

# 3. Start development mode (watches for changes)
npm run dev

# 4. Build for production
npm run build
```

### Linking to Minecraft

The development scripts should automatically link to your Minecraft development folders. If not:

**Windows:**

```
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs
```

**Android:**

```
/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/development_behavior_packs
/storage/emulated/0/Android/data/com.mojang.minecraftpe/files/games/com.mojang/development_resource_packs
```

---

## 📁 Project Structure

```
wheel_of_creation/
├── Behavior/                    # Behavior Pack
│   ├── blocks/                  # Block JSON definitions
│   ├── items/                   # Item JSON definitions
│   ├── scripts/                 # TypeScript source code
│   │   ├── config.ts            # Biome configuration data
│   │   ├── main.ts              # Entry point
│   │   ├── features/            # Game mechanics
│   │   │   ├── blocks/          # Block components
│   │   │   │   ├── Crop.ts      # Base crop class
│   │   │   │   ├── StemCrop.ts  # Pumpkin/Melon logic
│   │   │   │   ├── ColumnCrop.ts# Sugar cane logic
│   │   │   │   ├── Farmland.ts  # Soil hydration
│   │   │   │   └── crops/       # Crop configurations
│   │   │   ├── items/           # Item behaviors
│   │   │   └── environment/     # Weather system
│   │   ├── data/                # Data persistence
│   │   └── utils/               # Utility functions
│   ├── loot_tables/             # Drop tables
│   ├── recipes/                 # Crafting recipes
│   └── trading/                 # Villager trades
├── Resource/                    # Resource Pack
│   ├── models/                  # 3D models
│   ├── textures/                # Textures
│   └── texts/                   # Localization
├── scripts/                     # Build scripts
├── docs/                        # Documentation
└── build/                       # Build output
```

---

## 📏 Code Standards

### TypeScript

- Use **TypeScript** for all script files
- Follow existing code patterns and naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Use `safeExecute()` wrapper for error handling

```typescript
// ✅ Good
private handleRandomTick(e: BlockComponentRandomTickEvent) {
    const { block, dimension } = e;
    const biome = dimension.getBiome(block.location);
    const temperature = getBiomeTemperature(biome.id, block.location);
    // ...
}

// ❌ Bad
private tick(e: any) {
    var t = e.block.dimension.getBiome(e.block.location);
    // ...
}
```

### JSON Files

- Use proper formatting (2 spaces indentation)
- Follow Minecraft's schema conventions
- Keep identifiers consistent with `woc:` namespace

### Commits

Use clear, descriptive commit messages:

```
✅ Good:
feat: add rice crop with paddy water requirements
fix: crops not growing in Pale Garden biome
docs: update Spanish translation

❌ Bad:
fixed stuff
update
asdfgh
```

---

## 🔄 Pull Request Process

1. **Ensure your code works** — Test in-game thoroughly
2. **Update documentation** if needed
3. **Fill out the PR template** completely
4. **Wait for review** — I'll review as soon as possible
5. **Address feedback** if any changes are requested
6. **Celebrate** when merged! 🎉

### PR Checklist

- [ ] Code compiles without errors
- [ ] Tested in Minecraft Bedrock (latest version)
- [ ] No console errors in content log
- [ ] Follows existing code style
- [ ] Documentation updated if needed
- [ ] Commit messages are clear

---

## 🏆 Recognition

All contributors will be recognized! Your GitHub username will be added to:

- The README credits section
- In-game credits (for significant contributions)
- Release notes when your contribution is included

---

## ❓ Questions?

- **GitHub Issues** — For bugs and feature requests
- **GitHub Discussions** — For questions and ideas

---

<div align="center">

**Thank you for helping make Wheel of Creation better!** 🌾

_Every contribution, no matter how small, is valued and appreciated._

</div>
