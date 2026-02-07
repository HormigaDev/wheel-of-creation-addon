/**
 * Garantiza relación 1:1 entre K y V
 */
export class BiMap {
    private forward: Map<string, number>;
    private reverse: Map<number, string>;

    constructor(opts?: Record<string, number>) {
        this.forward = new Map<string, number>();
        this.reverse = new Map<number, string>();

        if (opts) {
            Object.entries(opts).forEach(([key, value]) => this.set(key, value));
        }
    }

    set(key: string, value: number): void {
        if (this.forward.has(key)) {
            const oldValue = this.forward.get(key)!;
            this.reverse.delete(oldValue);
        }
        if (this.reverse.has(value)) {
            const oldKey = this.reverse.get(value)!;
            this.forward.delete(oldKey);
        }

        this.forward.set(key, value);
        this.reverse.set(value, key);
    }

    getByKey(key: string): number | undefined {
        return this.forward.get(key);
    }

    getByValue(value: number): string | undefined {
        return this.reverse.get(value);
    }

    hasKey(key: string): boolean {
        return this.forward.has(key);
    }
    hasValue(value: number): boolean {
        return this.reverse.has(value);
    }
}
