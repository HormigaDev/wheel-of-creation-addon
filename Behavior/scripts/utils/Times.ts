export class Times {
    static hour = 1000;
    static day = this.hour * 24;
    static week = this.day * 7;
    static month = this.day * 30;
    static year = this.day * 365;

    static hours(t: number) {
        return this.hour * t;
    }
    static days(t: number) {
        return this.day * t;
    }
    static weeks(t: number) {
        return this.week * t;
    }
    static months(t: number) {
        return this.month * t;
    }
    static years(t: number) {
        return this.year * t;
    }
}
