import { Vector3 } from '@minecraft/server';

export class CoordUtils {
    /**
     * Obtiene la coordenada base (esquina noroeste) del Chunk.
     * Soporta coordenadas negativas correctamente.
     */
    static getChunkBase(val: number): number {
        return Math.floor(val / 16) * 16;
    }

    /**
     * Obtiene el centro del chunk en coordenadas de mundo.
     */
    static getChunkCenter(loc: Vector3, yLevel: number): Vector3 {
        return {
            x: this.getChunkBase(loc.x) + 8,
            y: yLevel,
            z: this.getChunkBase(loc.z) + 8,
        };
    }

    /**
     * Genera una clave local "x:y:z" relativa al chunk (0-15).
     * Esto ahorra bytes valiosos en la DB.
     * Ejemplo: -17 -> "15" (Local)
     */
    static getLocalKey(loc: Vector3): string {
        const x = ((loc.x % 16) + 16) % 16;
        const z = ((loc.z % 16) + 16) % 16;
        const y = Math.floor(loc.y);
        return `${x}:${y}:${z}`;
    }
}
