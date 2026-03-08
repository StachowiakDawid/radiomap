const RadiomapLayer = {
    Radiolines: "Radiolines",
    CellTowers: "CellTowers"
} as const;

type RadiomapLayer = (typeof RadiomapLayer)[keyof typeof RadiomapLayer];

const DetailsDisplayMode = {
    Horizontal: "Horizontal",
    Vertical: "Vertical"
} as const;

type DetailsDisplayMode = (typeof DetailsDisplayMode)[keyof typeof DetailsDisplayMode];

export { RadiomapLayer, DetailsDisplayMode };

export default interface RadiomapConfig {
    layers: RadiomapLayer[];
    maxElements: { [layer in RadiomapLayer]: number };
    detailsDisplayMode: { [layer in RadiomapLayer]: DetailsDisplayMode };
}