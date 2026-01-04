const RadiomapLayer = {
    Radiolines: "Radiolines",
    CellTowers: "CellTowers"
} as const;

type RadiomapLayer = (typeof RadiomapLayer)[keyof typeof RadiomapLayer];

export { RadiomapLayer };

export default interface RadiomapConfig {
    layers: RadiomapLayer[];
    maxElements: { [layer in RadiomapLayer]: number };
}