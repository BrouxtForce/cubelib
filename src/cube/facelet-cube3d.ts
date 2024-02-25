import { assert } from "../utils";

export default class FaceletCube3D {
    public readonly facelets: number[];

    constructor(layerCount: number) {
        assert(Number.isInteger(layerCount) && layerCount > 1);

        this.facelets = [];
    }
}