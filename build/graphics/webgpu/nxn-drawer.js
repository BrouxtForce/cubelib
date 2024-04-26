import device from "./device.js";
import { matrixMult, createPerspectiveMatrix, transpose, createTranslationMatrix, matrixRotationX, matrixRotationY, createScaleMatrix } from "../math.js";
export default class NxNDrawer {
    layerCount;
    canvas;
    context;
    depthTexture;
    renderPassDescriptor;
    shaderModule;
    renderPipeline;
    computePipeline;
    stickerBuffer;
    cameraDataBuffer;
    blockDataBuffer;
    numBlocks = 1;
    bindGroups;
    constructor(canvas, layerCount) {
        this.layerCount = layerCount;
        this.canvas = canvas;
        let preferredFormat;
        [this.context, preferredFormat] = NxNDrawer.initCanvasContext(canvas);
        this.depthTexture = NxNDrawer.createDepthTexture(canvas.width, canvas.height);
        this.renderPassDescriptor = NxNDrawer.createRenderPassDescriptor(this.depthTexture);
        this.shaderModule = NxNDrawer.createShaderModule(layerCount);
        const bindGroupLayout = NxNDrawer.createBindGroupLayout();
        const piplineLayout = NxNDrawer.createPipelineLayout(bindGroupLayout);
        this.renderPipeline = NxNDrawer.createRenderPipeline(this.shaderModule, piplineLayout, preferredFormat, this.depthTexture.format);
        this.computePipeline = NxNDrawer.createComputePipeline(this.shaderModule, piplineLayout);
        this.stickerBuffer = NxNDrawer.createStickerBuffer(layerCount);
        this.cameraDataBuffer = NxNDrawer.createCameraDataBuffer();
        this.blockDataBuffer = NxNDrawer.createBlockDataBuffer();
        this.bindGroups = NxNDrawer.createBindGroups(bindGroupLayout, this.cameraDataBuffer, this.stickerBuffer, this.blockDataBuffer);
        this.reset();
        this.clearAnimation();
    }
    render() {
        this.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        const commandEncoder = device.createCommandEncoder({ label: "Draw NxN" });
        this.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();
        const pass = commandEncoder.beginRenderPass(this.renderPassDescriptor);
        pass.setPipeline(this.renderPipeline);
        for (let i = 0; i < this.bindGroups.length; i++) {
            pass.setBindGroup(i, this.bindGroups[i]);
        }
        pass.draw(4, 6 * this.numBlocks);
        pass.end();
        device.queue.submit([commandEncoder.finish()]);
    }
    reset() {
        const commandEncoder = device.createCommandEncoder({ label: "Reset NxN" });
        const pass = commandEncoder.beginComputePass();
        pass.setPipeline(this.computePipeline);
        for (let i = 0; i < this.bindGroups.length; i++) {
            pass.setBindGroup(i, this.bindGroups[i]);
        }
        pass.dispatchWorkgroups(Math.ceil(this.stickerBuffer.size / 256));
        pass.end();
        device.queue.submit([commandEncoder.finish()]);
    }
    setCameraTransform(position, rotationX, rotationY) {
        const viewMatrix = matrixMult(createScaleMatrix(Array(3).fill(0.8)), matrixMult(matrixMult(matrixRotationY(rotationY), matrixRotationX(rotationX)), createTranslationMatrix(position)));
        const projMatrix = createPerspectiveMatrix(2, this.canvas.width / this.canvas.height, 0.01);
        const viewProjMatrix = new Float32Array(16);
        viewProjMatrix.set(matrixMult(viewMatrix, transpose(projMatrix)));
        device.queue.writeBuffer(this.cameraDataBuffer, 0, viewProjMatrix);
    }
    set(cube) {
        const arrayBuffer = new ArrayBuffer(this.stickerBuffer.size);
        const view = new Uint32Array(arrayBuffer);
        let index = 0;
        let shift = 0;
        for (let i = 0; i < cube.stickers.length; i++) {
            for (let j = 0; j < cube.stickers[i].length; j++) {
                view[index] |= cube.stickers[i][j] << shift;
                shift += 3;
                if (shift >= 30) {
                    index++;
                    shift = 0;
                }
            }
        }
        device.queue.writeBuffer(this.stickerBuffer, 0, arrayBuffer);
    }
    static makeBlock(rotation, scale, translation, axis) {
        if (scale <= 0)
            return [];
        return [rotation | (scale << 16), translation | (axis << 16)];
    }
    animateMove(move, t) {
        function mod(a, b) {
            return ((a % b) + b) % b;
        }
        const face = "ULFRBD".indexOf(move.face.toUpperCase());
        if (face === -1) {
            throw new Error(`Unsupported face '${move.face}'`);
        }
        const data = [];
        const rotation = mod(Math.floor(0xffff * t * move.amount / 4), 0xffff);
        if (move.shallow === 1) {
            data.push(...NxNDrawer.makeBlock(rotation, move.deep, this.layerCount - move.deep, face));
            data.push(...NxNDrawer.makeBlock(0, this.layerCount - move.deep, 0, face));
        }
        else {
            data.push(...NxNDrawer.makeBlock(0, move.shallow - 1, this.layerCount - move.shallow + 1, face));
            data.push(...NxNDrawer.makeBlock(rotation, move.deep - move.shallow + 1, this.layerCount - move.deep, face));
            data.push(...NxNDrawer.makeBlock(0, this.layerCount - move.deep, 0, face));
        }
        this.numBlocks = data.length / 2;
        device.queue.writeBuffer(this.blockDataBuffer, 0, new Uint32Array(data));
    }
    clearAnimation() {
        const data = new Uint32Array(NxNDrawer.makeBlock(0, this.layerCount, 0, 0));
        this.numBlocks = 1;
        device.queue.writeBuffer(this.blockDataBuffer, 0, new Uint32Array(data));
    }
    destroy() {
        this.context.unconfigure();
        this.depthTexture.destroy();
        this.stickerBuffer.destroy();
        this.cameraDataBuffer.destroy();
    }
    resize(width, height) {
        if (this.canvas.width === width && this.canvas.height === height) {
            return;
        }
        this.canvas.width = width;
        this.canvas.height = height;
        this.depthTexture.destroy();
        this.depthTexture = NxNDrawer.createDepthTexture(width, height);
        const attachment = this.renderPassDescriptor.depthStencilAttachment;
        attachment.view = this.depthTexture.createView();
    }
    static initCanvasContext(canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const context = canvas.getContext("webgpu");
        if (!context) {
            throw new Error("Failed to initialize WebGPU canvas context");
        }
        const preferredFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({ device, format: preferredFormat });
        return [context, preferredFormat];
    }
    static createDepthTexture(width, height) {
        return device.createTexture({
            size: { width, height },
            format: "depth16unorm",
            dimension: "2d",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
    }
    static createRenderPassDescriptor(depthTexture) {
        return {
            label: "Draw NxN Render Pass Descriptor",
            colorAttachments: [{
                    view: null,
                    clearValue: [1, 1, 1, 1],
                    loadOp: "clear",
                    storeOp: "store"
                }],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthClearValue: 1,
                depthLoadOp: "clear",
                depthStoreOp: "store"
            }
        };
    }
    static createShaderModule(layerCount) {
        const stickerBufferLength = NxNDrawer.getStickerBufferByteLength(layerCount) / 4;
        const source = `
            struct CameraData {
                viewProjMatrix: mat4x4f,
            };

            struct BlockData {
                packedRotationScale: u32,
                packedAxisTranslation: u32,
            };

            const vertices = array<vec2f, 4>(
                vec2f(-1.0, -1.0),
                vec2f(-1.0,  1.0),
                vec2f( 1.0, -1.0),
                vec2f( 1.0,  1.0),
            );
            const normals = array<vec3f, 6>(
                vec3f( 0.0,  1.0,  0.0),
                vec3f(-1.0,  0.0,  0.0),
                vec3f( 0.0,  0.0,  1.0),
                vec3f( 1.0,  0.0,  0.0),
                vec3f( 0.0,  0.0, -1.0),
                vec3f( 0.0, -1.0,  0.0)
            );
            const colors = array<vec4f, 8>(
                vec4f(1.0, 1.0, 1.0, 1.0),
                vec4f(1.0, 0.6, 0.0, 1.0),
                vec4f(0.0, 1.0, 0.0, 1.0),
                vec4f(1.0, 0.0, 0.0, 1.0),
                vec4f(0.0, 0.0, 1.0, 1.0),
                vec4f(1.0, 1.0, 0.0, 1.0),
                // unused
                vec4f(0.0, 0.0, 0.0, 1.0),
                vec4f(0.0, 0.0, 0.0, 1.0),
            );
        
            @group(0) @binding(0) var<uniform> cameraData: CameraData;
            @group(0) @binding(1) var<storage, read_write> stickers: array<u32, ${stickerBufferLength}>;
            @group(0) @binding(2) var<storage, read> blocks: array<BlockData>;
        
            struct VertexOut {
                @builtin(position) position: vec4f,
                @location(0) uv: vec2f,
                @location(1) @interpolate(flat) face: u32,
                @location(2) @interpolate(flat) fill: u32,
            };
    
            @vertex
            fn vert_main(@builtin(vertex_index) vertexId: u32, @builtin(instance_index) instanceId: u32) -> VertexOut {
                var out: VertexOut;

                var vertex = vertices[vertexId];
                let normal = normals[instanceId % 6];

                let block = blocks[instanceId / 6];

                let scaleU32 = (block.packedRotationScale >> 16) & 0xffff;
                let translationU32 = block.packedAxisTranslation & 0xffff;

                let rotation: f32 = -f32(block.packedRotationScale & 0xffff) / f32(0xffff) * 6.2831853072;
                let halfScale: f32 = f32(scaleU32) / f32(${layerCount});
                let translation: f32 = -1 + 2 * f32(translationU32) / f32(${layerCount});
                let axis: vec3f = normals[(block.packedAxisTranslation >> 16) & 0x7];

                var position = vec3f(vertex, 0.0);
                if (normal.x != 0) { position = position.zxy + normal; }
                if (normal.y != 0) { position = position.xzy + normal; }
                if (normal.z != 0) { position += normal; }

                let normalDotAxis = dot(normal, axis);
                out.fill = u32(
                    (normalDotAxis == 1.0 && translationU32 + scaleU32 < ${layerCount}) ||
                    (normalDotAxis == -1.0 && translationU32 != 0)
                );

                if (normalDotAxis > 0.1) {
                    position -= position * abs(axis);
                    position += axis * (translation + halfScale * 2);
                } else if (normalDotAxis < -0.1) {
                    position -= position * abs(axis);
                    position += axis * translation;
                } else {
                    let positionDotAxis = dot(position, axis);
                    if (positionDotAxis > 0.1) {
                        position -= position * abs(axis);
                        position += axis * (translation + halfScale * 2);
                    } else {
                        position -= position * abs(axis);
                        position += axis * translation;
                    }

                    let scale = halfScale * 2.0;

                    if (axis.x != 0.0) {
                        vertex.x *= halfScale;
                        vertex.x += axis.x * (halfScale + translation);
                    } else if (axis.y != 0.0) {
                        let i = instanceId % 6;
                        if (i == 1 || i == 3) {
                            vertex.x *= halfScale;
                            vertex.x += axis.y * (halfScale + translation);
                        } else {
                            vertex.y *= halfScale;
                            vertex.y += axis.y * (halfScale + translation);
                        }
                    } else if (axis.z != 0.0) {
                        vertex.y *= halfScale;
                        vertex.y += axis.z * (halfScale + translation);
                    }
                }

                // https://en.wikipedia.org/wiki/Axis-angle_representation#Rotating_a_vector
                position =
                    cos(rotation) * position +
                    sin(rotation) * cross(axis, position) +
                    (1 - cos(rotation)) * dot(axis, position) * axis;

                out.position = cameraData.viewProjMatrix * vec4f(position * 0.1, 1);
                out.uv = vertex;
                out.face = instanceId % 6;

                switch (instanceId % 6) {
                    case 1: { out.uv = vec2f(out.uv.y, -out.uv.x); break; }
                    case 2: { out.uv.y *= -1; break; }
                    case 3: { out.uv = vec2f(-out.uv.y, -out.uv.x); break; }
                    case 4: { out.uv *= -1; break; }
                    case 5: { out.uv.y *= -1; break; }
                    default: { break; }
                }

                out.uv = (out.uv + 1) / 2;
    
                return out;
            }
    
            @fragment
            fn frag_main(in: VertexOut) -> @location(0) vec4f {
                const lineWidth = vec2f(0.1);
                const gridRepeat = vec2f(${layerCount});

                // https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8
                var gridAA = max(abs(dpdx(in.uv)), abs(dpdy(in.uv))) * 1;

                if (bool(in.fill)) {
                    return vec4f(0, 0, 0, 1);
                }

                var drawWidth = clamp(lineWidth, gridAA, vec2f(0.5));
                var gridUV = 1.0 - abs(fract(in.uv * gridRepeat) * 2.0 - 1.0);
                var grid2 = smoothstep(drawWidth + gridAA, drawWidth - gridAA, gridUV);
                grid2 *= saturate(lineWidth / drawWidth);
                grid2 = mix(grid2, lineWidth, saturate(gridAA * 2.0 - 1.0));
                var grid = max(grid2.x, grid2.y);

                var i2 = vec2u(floor(in.uv * gridRepeat));
                var index =
                    in.face * u32(gridRepeat.x) * u32(gridRepeat.y) +
                    i2.y * u32(gridRepeat.x) + i2.x;
                var colorIndex = (stickers[index / 10] >> ((index % 10) * 3)) & 0x7;

                return mix(colors[colorIndex], vec4f(0, 0, 0, 1), grid);
            }

            @compute @workgroup_size(64) fn initStickers(
                @builtin(global_invocation_id) gid: vec3<u32>
            ) {
                if (gid.x < ${stickerBufferLength}) {
                    let id = gid.x * 10;
                    var value: u32 = 0;
                    for (var i: u32 = 0; i < 10; i++) {
                        value |= ((i + id) / ${layerCount * layerCount}) << (i * 3);
                    }
                    stickers[gid.x] = value;
                }
            }
        `;
        return device.createShaderModule({
            label: "puzzle shader module",
            code: source
        });
    }
    static createBindGroupLayout() {
        return device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: "uniform" }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                    buffer: { type: "storage" }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: "read-only-storage" }
                }
            ]
        });
    }
    static createPipelineLayout(bindGroupLayout) {
        return device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] });
    }
    static createRenderPipeline(module, pipelineLayout, format, depthTextureFormat) {
        return device.createRenderPipeline({
            label: "Draw Puzzle Render Pipeline",
            layout: pipelineLayout,
            vertex: {
                module,
                entryPoint: "vert_main",
            },
            fragment: {
                module,
                entryPoint: "frag_main",
                targets: [{ format }]
            },
            depthStencil: {
                format: depthTextureFormat,
                depthWriteEnabled: true,
                depthCompare: "less"
            },
            primitive: {
                topology: "triangle-strip"
            }
        });
    }
    static createComputePipeline(module, pipelineLayout) {
        return device.createComputePipeline({
            layout: pipelineLayout,
            compute: {
                module,
                entryPoint: "initStickers"
            }
        });
    }
    static getStickerBufferByteLength(layerCount) {
        return Math.ceil(6 * layerCount * layerCount / 10) * 4;
    }
    static createStickerBuffer(layerCount) {
        return device.createBuffer({
            label: "Sticker Buffer",
            size: NxNDrawer.getStickerBufferByteLength(layerCount),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
    }
    static createCameraDataBuffer() {
        return device.createBuffer({
            size: 80,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
    static createBlockDataBuffer() {
        return device.createBuffer({
            size: 24,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });
    }
    static createBindGroups(bindGroupLayout, cameraDataBuffer, stickerBuffer, blockDataBuffer) {
        return [
            device.createBindGroup({
                layout: bindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: cameraDataBuffer } },
                    { binding: 1, resource: { buffer: stickerBuffer } },
                    { binding: 2, resource: { buffer: blockDataBuffer } }
                ]
            })
        ];
    }
}
