export class TextColor {
    // Colores básicos
    static black(text: string) {
        return `§0${text}`;
    }
    static darkBlue(text: string) {
        return `§1${text}`;
    }
    static darkGreen(text: string) {
        return `§2${text}`;
    }
    static darkAqua(text: string) {
        return `§3${text}`;
    }
    static darkRed(text: string) {
        return `§4${text}`;
    }
    static darkPurple(text: string) {
        return `§5${text}`;
    }
    static gold(text: string) {
        return `§6${text}`;
    }
    static gray(text: string) {
        return `§7${text}`;
    }
    static darkGray(text: string) {
        return `§8${text}`;
    }
    static blue(text: string) {
        return `§b${text}`;
    }
    static green(text: string) {
        return `§a${text}`;
    }
    static aqua(text: string) {
        return `§b${text}`;
    }
    static red(text: string) {
        return `§c${text}`;
    }
    static lightPurple(text: string) {
        return `§d${text}`;
    }
    static yellow(text: string) {
        return `§e${text}`;
    }
    static white(text: string) {
        return `§f${text}`;
    }

    // Estilos
    static bold(text: string) {
        return `§l${text}`;
    }
    static italic(text: string) {
        return `§o${text}`;
    }
    static underline(text: string) {
        return `§n${text}`;
    }
    static strikethrough(text: string) {
        return `§m${text}`;
    }
    static obfuscated(text: string) {
        return `§k${text}`;
    }

    // Reset
    static reset(text: string) {
        return `§r${text}`;
    }
}
