import { world, system } from '@minecraft/server';

/**
 * Nivel de severidad para los logs
 */
export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

/**
 * Opciones para el logger
 */
interface LoggerOptions {
    prefix: string;
    showInChat: boolean;
    minLevel: LogLevel;
}

/**
 * Resultado de una operación segura
 */
export type SafeResult<T> = { success: true; value: T } | { success: false; error: Error };

/**
 * Clase para manejar logs y errores del addon
 * Usa world.sendMessage para debug ya que console no está disponible en Bedrock Script API
 */
export class Logger {
    private static readonly LOG_LEVELS: Record<LogLevel, number> = {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 1,
        [LogLevel.WARN]: 2,
        [LogLevel.ERROR]: 3,
    };

    private options: LoggerOptions;
    private logBuffer: string[] = [];
    private readonly MAX_BUFFER_SIZE = 50;

    constructor(options: Partial<LoggerOptions> = {}) {
        this.options = {
            prefix: options.prefix ?? 'WoC',
            showInChat: options.showInChat ?? false,
            minLevel: options.minLevel ?? LogLevel.WARN,
        };
    }

    private shouldLog(level: LogLevel): boolean {
        return Logger.LOG_LEVELS[level] >= Logger.LOG_LEVELS[this.options.minLevel];
    }

    private formatMessage(level: LogLevel, message: string, context?: string): string {
        const contextStr = context ? `[${context}]` : '';
        return `[${this.options.prefix}][${level}]${contextStr} ${message}`;
    }

    private log(level: LogLevel, message: string): void {
        console.log(message);
    }

    debug(message: string, context?: string): void {
        if (!this.shouldLog(LogLevel.DEBUG)) return;
        this.log(LogLevel.DEBUG, this.formatMessage(LogLevel.DEBUG, message, context));
    }

    info(message: string, context?: string): void {
        if (!this.shouldLog(LogLevel.INFO)) return;
        this.log(LogLevel.INFO, this.formatMessage(LogLevel.INFO, message, context));
    }

    warn(message: string, context?: string): void {
        if (!this.shouldLog(LogLevel.WARN)) return;
        this.log(LogLevel.WARN, this.formatMessage(LogLevel.WARN, message, context));
    }

    error(message: string, error?: unknown, context?: string): void {
        if (!this.shouldLog(LogLevel.ERROR)) return;

        const errorMessage = this.extractErrorMessage(error);
        const fullMessage = error ? `${message}: ${errorMessage}` : message;
        const formattedMessage = this.formatMessage(LogLevel.ERROR, fullMessage, context);

        this.log(LogLevel.ERROR, formattedMessage);

        if (this.options.showInChat) {
            this.notifyPlayers(fullMessage);
        }
    }

    private extractErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.stack ?? error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        return String(error);
    }

    private notifyPlayers(message: string): void {
        try {
            for (const player of world.getAllPlayers()) {
                if (player.hasTag('woc:admin')) {
                    player.sendMessage(`§c[WoC Error] ${message}`);
                }
            }
        } catch {}
    }

    /**
     * Envía los últimos logs a un jugador específico (para debug)
     */
    sendLogsToPlayer(playerName: string, count: number = 10): void {
        try {
            const player = world.getAllPlayers().find((p) => p.name === playerName);
            if (!player) return;

            const logs = this.logBuffer.slice(-count);
            player.sendMessage(`§e--- Últimos ${logs.length} logs ---`);
            for (const log of logs) {
                player.sendMessage(`§7${log}`);
            }
        } catch {}
    }

    /**
     * Limpia el buffer de logs
     */
    clearBuffer(): void {
        this.logBuffer = [];
    }

    /**
     * Obtiene los logs almacenados
     */
    getLogs(): string[] {
        return [...this.logBuffer];
    }
}

export const logger = new Logger({
    prefix: 'WoC',
    showInChat: false,
    minLevel: LogLevel.WARN,
});

/**
 * Ejecuta una función de forma segura, capturando errores
 * @param fn Función a ejecutar
 * @param context Contexto para el log de errores
 * @returns SafeResult con el valor o el error
 */
export function safeExecute<T>(fn: () => T, context?: string): SafeResult<T> {
    try {
        const value = fn();
        return { success: true, value };
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        world.sendMessage(`Error during execution ${context}`);
        logger.error('Error during execution', error, context);
        return { success: false, error };
    }
}

/**
 * Ejecuta una función de forma segura, retornando un valor por defecto en caso de error
 * @param fn Función a ejecutar
 * @param defaultValue Valor por defecto si hay error
 * @param context Contexto para el log de errores
 * @returns El resultado de la función o el valor por defecto
 */
export function safeExecuteWithDefault<T>(fn: () => T, defaultValue: T, context?: string): T {
    const result = safeExecute(fn, context);
    return result.success ? result.value : defaultValue;
}

/**
 * Wrapper para hacer seguro un handler de evento de componente de bloque
 * @param handler El handler original
 * @param context Contexto para identificar el handler
 * @returns Un handler envuelto que captura errores
 */
export function safeHandler<E>(handler: (event: E) => void, context: string): (event: E) => void {
    return (event: E) => {
        try {
            handler(event);
        } catch (err) {
            logger.error(`Handler failed`, err, context);
        }
    };
}

/**
 * Decorador para hacer métodos seguros (para uso en clases)
 * @param context Contexto para el log
 */
export function Safe(context?: string) {
    return function (
        target: object,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: unknown[]) {
            try {
                return originalMethod.apply(this, args);
            } catch (err) {
                logger.error(
                    `Method ${propertyKey} failed`,
                    err,
                    context ?? target.constructor.name,
                );
                return undefined;
            }
        };

        return descriptor;
    };
}

/**
 * Valida que un valor no sea null o undefined
 * @param value El valor a validar
 * @param name Nombre del valor para el mensaje de error
 * @throws Error si el valor es null o undefined
 */
export function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error(`${name} is required but was ${value}`);
    }
}

/**
 * Valida que una condición sea verdadera
 * @param condition La condición a validar
 * @param message Mensaje de error si la condición es falsa
 * @throws Error si la condición es falsa
 */
export function assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}
