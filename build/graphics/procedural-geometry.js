;
export var ProceduralGeometry;
(function (ProceduralGeometry) {
    function cube() {
        return {
            vertices: new Float32Array([
                -1, -1, -1,
                1, -1, -1,
                1, -1, 1,
                -1, -1, 1,
                -1, 1, 1,
                1, 1, 1,
                1, 1, -1,
                -1, 1, -1
            ]),
            indices: new Uint16Array([
                0, 1, 2, 2, 3, 0,
                0, 3, 4, 4, 7, 0,
                3, 2, 5, 5, 4, 3,
                2, 1, 6, 6, 5, 2,
                1, 0, 7, 7, 6, 1,
                4, 5, 6, 6, 7, 4
            ])
        };
    }
    ProceduralGeometry.cube = cube;
})(ProceduralGeometry || (ProceduralGeometry = {}));
