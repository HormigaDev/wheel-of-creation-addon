import { world, WeatherChangeAfterEvent } from '@minecraft/server';

const WEATHER_PROPERTY_ID = 'woc:world_weather_raining';

class WeatherManager {
    private _isRaining: boolean = false;

    constructor() {
        world.afterEvents.weatherChange.subscribe((e: WeatherChangeAfterEvent) => {
            const isWet = e.newWeather === 'Rain' || e.newWeather === 'Thunder';

            if (this._isRaining !== isWet) {
                this._isRaining = isWet;
                world.setDynamicProperty(WEATHER_PROPERTY_ID, isWet);
            }
        });
        world.afterEvents.worldLoad.subscribe(() => {
            const savedState = world.getDynamicProperty(WEATHER_PROPERTY_ID) as boolean;
            this._isRaining = savedState ?? false;
        });
    }

    public get isRaining(): boolean {
        return this._isRaining;
    }
}

export const weatherManager = new WeatherManager();
