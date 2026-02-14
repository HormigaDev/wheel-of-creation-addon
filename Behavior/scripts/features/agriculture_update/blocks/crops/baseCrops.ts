import { ColumnCrop } from '../ColumnCrop';
import { Crop } from '../Crop';
import { StemCrop } from '../StemCrop';
import { WaterCrop } from '../WaterCrop';
import {
    BASE_CROPS_CONFIG,
    STEM_CROPS_CONFIG,
    COLUMN_CROPS_CONFIG,
    WATER_CROPS_CONFIG,
} from './configs';

const baseCrops: (Crop | StemCrop | ColumnCrop | WaterCrop)[] = [];
BASE_CROPS_CONFIG.forEach((c) => baseCrops.push(new Crop(c)));
STEM_CROPS_CONFIG.forEach((c) => baseCrops.push(new StemCrop(c)));
COLUMN_CROPS_CONFIG.forEach((c) => baseCrops.push(new ColumnCrop(c)));
WATER_CROPS_CONFIG.forEach((c) => baseCrops.push(new WaterCrop(c)));

export default baseCrops;
