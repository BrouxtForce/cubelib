import { compileShader, createShaderProgram } from "./webgl-utils.js";
;
export function createPuzzleProgram(gl, stickerCount) {
    const vertexSource = `#version 300 es
in vec4 a_position;

void main() {
    gl_Position = a_position;
}`;
    const fragmentSource = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
    outColor = vec4(1, 0, 0, 1);
}`;
    const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
    return createShaderProgram(gl, vertexShader, fragmentShader);
}
