import { createPuzzleProgram } from "./draw-data.js";
import { ProceduralGeometry } from "./procedural-geometry.js";
export var Cube3D;
(function (Cube3D) {
    let shaderProgram = null;
    function getProgram(gl) {
        if (shaderProgram) {
            return shaderProgram;
        }
        shaderProgram = createPuzzleProgram(gl, 54);
        return shaderProgram;
    }
    let vao = null;
    let triangleCount = 0;
    function getVAO(gl, program) {
        if (vao) {
            return vao;
        }
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const cubeGeometry = ProceduralGeometry.cube();
        triangleCount = cubeGeometry.indices.length / 3;
        gl.bufferData(gl.ARRAY_BUFFER, cubeGeometry.vertices, gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeGeometry.indices, gl.STATIC_DRAW);
        vao = gl.createVertexArray();
        if (!vao) {
            throw new Error("Failed to create WebGL vertex array object.");
        }
        gl.bindVertexArray(vao);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        return vao;
    }
    function draw(gl, rotationX, rotationY) {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        const program = getProgram(gl);
        gl.useProgram(program);
        const vao = getVAO(gl, program);
        gl.bindVertexArray(vao);
        gl.drawElements(gl.TRIANGLES, triangleCount, gl.UNSIGNED_SHORT, 0);
    }
    Cube3D.draw = draw;
})(Cube3D || (Cube3D = {}));
