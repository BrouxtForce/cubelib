export function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.log((type === gl.VERTEX_SHADER) ? "vertex shader" : "fragment shader", "\n", source);
        const log = gl.getShaderInfoLog(shader);
        console.log(`shader compilation log: ${log}`);
        gl.deleteShader(shader);
    }
    throw new Error("Failed to compile WebGL shader.");
}
export function createShaderProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    if (program) {
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.warn(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
    throw new Error("Failed to create WebGL program.");
}
