import { RadiomapLayer } from './config.interface.ts';
import type RadiomapConfig  from './config.interface.ts';

const config: RadiomapConfig = {
    layers: [RadiomapLayer.Radiolines, RadiomapLayer.CellTowers],
    maxElements: {
        [RadiomapLayer.Radiolines]: 1000,
        [RadiomapLayer.CellTowers]: 1000
    },
};

export default config;