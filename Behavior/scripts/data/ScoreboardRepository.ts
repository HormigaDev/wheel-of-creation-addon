import { Block, world, ScoreboardObjective } from '@minecraft/server';
import { logger, safeExecute } from '../utils/ErrorHandler';

export class ScoreboardRepository {
    private static readonly OBJ_LAST_TICK_LOW = 'wofc_tick_low'; // 31 bits bajos del timestamp
    private static readonly OBJ_LAST_TICK_HIGH = 'wofc_tick_high'; // Bits altos del timestamp (overflow)
    private static readonly OBJ_DATA = 'wofc_data'; // Progreso + Hidratación Cacheada

    // Constantes para bit-splitting de 64 bits
    private static readonly BITS_LOW = 31n; // Aquí uso 31 bits para evitar problemas con signo
    private static readonly MASK_LOW = 0x7fffffffn; // Máscara para 31 bits

    private static tickLowObj: ScoreboardObjective | undefined;
    private static tickHighObj: ScoreboardObjective | undefined;
    private static dataObj: ScoreboardObjective | undefined;

    private static getObjectives(): boolean {
        if (this.tickLowObj && this.tickHighObj && this.dataObj) return true;

        const result = safeExecute(() => {
            const sb = world.scoreboard;

            this.tickLowObj = sb.getObjective(this.OBJ_LAST_TICK_LOW);
            if (!this.tickLowObj)
                this.tickLowObj = sb.addObjective(this.OBJ_LAST_TICK_LOW, 'WoFC Tick Low');

            this.tickHighObj = sb.getObjective(this.OBJ_LAST_TICK_HIGH);
            if (!this.tickHighObj)
                this.tickHighObj = sb.addObjective(this.OBJ_LAST_TICK_HIGH, 'WoFC Tick High');

            this.dataObj = sb.getObjective(this.OBJ_DATA);
            if (!this.dataObj) this.dataObj = sb.addObjective(this.OBJ_DATA, 'WoFC Storage');

            return true;
        }, 'ScoreboardRepository.getObjectives');

        return result.success;
    }

    private static getKey(block: Block): string {
        return `${Math.floor(block.x)}:${Math.floor(block.y)}:${Math.floor(block.z)}:${block.dimension.id}`;
    }

    static save(block: Block, lastTick: number, progress: number, hydrationCache: number): boolean {
        if (!this.getObjectives()) {
            logger.warn('Failed to get objectives for save operation', 'ScoreboardRepository');
            return false;
        }

        const result = safeExecute(() => {
            const key = this.getKey(block);

            // TIMESTAMP 64-BIT SPLIT (BigInt → 2x32 bits)
            // Aquí divido el timestamp en parte baja (31 bits) y alta (resto)
            const timestamp = BigInt(lastTick);
            const tickLow = Number(timestamp & this.MASK_LOW); // 31 bits bajos
            const tickHigh = Number(timestamp >> this.BITS_LOW); // Bits restantes

            // BIT-PACKING DE ALTA EFICIENCIA
            // Limpio el progreso para asegurar que no invada los bits de hidratación (mask 28 bits)
            // Y aquí coloco la hidratación en los 4 bits más altos (shift 28)
            const safeProgress = progress & 0x0fffffff;
            const packedData = safeProgress | (hydrationCache << 28);

            this.tickLowObj?.setScore(key, tickLow);
            this.tickHighObj?.setScore(key, tickHigh);
            this.dataObj?.setScore(key, packedData);
            return true;
        }, 'ScoreboardRepository.save');

        return result.success;
    }

    static load(block: Block): { lastTick: number; progress: number; hydration: number } | null {
        if (!this.getObjectives()) {
            logger.warn('Failed to get objectives for load operation', 'ScoreboardRepository');
            return null;
        }

        const key = this.getKey(block);

        try {
            const tickLow = this.tickLowObj?.getScore(key);
            if (tickLow === undefined) return null;

            const tickHigh = this.tickHighObj?.getScore(key) ?? 0;

            // RECONSTRUIR TIMESTAMP 64-BIT (2x32 bits → BigInt → number)
            // Combino la parte alta y baja para obtener el timestamp original
            const fullTimestamp = (BigInt(tickHigh) << this.BITS_LOW) | BigInt(tickLow);
            const lastTick = Number(fullTimestamp);

            const packedData = this.dataObj?.getScore(key) ?? 0;

            const hydration = (packedData >>> 28) & 0xf; // Shift derecha sin signo
            const progress = packedData & 0x0fffffff; // Máscara de los primeros 28 bits

            return { lastTick, progress, hydration };
        } catch (err) {
            world.sendMessage(`Error: ${err}`);
            logger.error('Failed to load scoreboard data', err, 'ScoreboardRepository.load');
            return null;
        }
    }

    static delete(block: Block): boolean {
        if (!this.getObjectives()) {
            world.sendMessage('Error al obtener objetivos');
            logger.warn('Failed to get objectives for delete operation', 'ScoreboardRepository');
            return false;
        }

        const result = safeExecute(() => {
            const key = this.getKey(block);
            this.tickLowObj?.removeParticipant(key);
            this.tickHighObj?.removeParticipant(key);
            this.dataObj?.removeParticipant(key);
            return true;
        }, 'ScoreboardRepository.delete');

        return result.success;
    }
}
