import { assert } from "../utils";
export default class FaceletCube3D {
    facelets;
    constructor(layerCount) {
        assert(Number.isInteger(layerCount) && layerCount > 1);
        this.facelets = [];
    }
}
