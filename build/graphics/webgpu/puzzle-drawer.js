import device from "./device.js";
import { matrixMult, createPerspectiveMatrix, transpose, createTranslationMatrix, matrixRotationX, matrixRotationY } from "../math.js";
export default class PuzzleDrawer {
    layerCount;
    context;
    depthTexture;
    renderPassDescriptor;
    module;
    renderPipeline;
    cameraDataBuffer;
    bindGroupLayout;
    pipelineLayout;
    bindGroups;
    stickerBuffer;
    static depthTextureFormat = "depth16unorm";
    constructor(canvas, layerCount) {
        this.layerCount = layerCount;
        const context = canvas.getContext("webgpu");
        if (!context) {
            throw new Error("Failed to initialize WebGPU canvas context.");
        }
        const preferredFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({ device, format: preferredFormat });
        this.context = context;
        this.depthTexture = PuzzleDrawer.createDepthTexture(canvas.width, canvas.height);
        this.renderPassDescriptor = {
            label: "Draw Puzzle Render Pass",
            colorAttachments: [{
                    view: null,
                    clearValue: [1, 1, 1, 1],
                    loadOp: "clear",
                    storeOp: "store"
                }],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),
                depthClearValue: 1,
                depthLoadOp: "clear",
                depthStoreOp: "store"
            }
        };
        this.module = PuzzleDrawer.createShader(this.layerCount);
        this.cameraDataBuffer = device.createBuffer({
            size: 80,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
        });
        this.stickerBuffer = PuzzleDrawer.createStickerBuffer(this.layerCount);
        this.bindGroupLayout = device.createBindGroupLayout({
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
                }
            ]
        });
        this.pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [this.bindGroupLayout]
        });
        this.bindGroups = [
            device.createBindGroup({
                layout: this.bindGroupLayout,
                entries: [
                    { binding: 0, resource: { buffer: this.cameraDataBuffer } },
                    { binding: 1, resource: { buffer: this.stickerBuffer } }
                ]
            })
        ];
        this.renderPipeline = PuzzleDrawer.createRenderPipeline(this.module, preferredFormat, this.pipelineLayout);
        this.initStickerBuffer();
    }
    render() {
        const commandEncoder = device.createCommandEncoder({ label: "Puzzle Drawer Command Encoder" });
        this.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();
        const pass = commandEncoder.beginRenderPass(this.renderPassDescriptor);
        pass.setPipeline(this.renderPipeline);
        for (let i = 0; i < this.bindGroups.length; i++) {
            pass.setBindGroup(i, this.bindGroups[i]);
        }
        pass.draw(4, 6);
        pass.end();
        device.queue.submit([commandEncoder.finish()]);
    }
    setCameraTransform(position, rotationX, rotationY, scale) {
        const viewMatrix = matrixMult(matrixMult(matrixRotationY(rotationY), matrixRotationX(rotationX)), createTranslationMatrix(position));
        const projMatrix = createPerspectiveMatrix(1, this.context.canvas.width / this.context.canvas.height, 0.01);
        const cameraData = new ArrayBuffer(80);
        const viewProjMatrix = new Float32Array(cameraData, 0, 16);
        const worldPosition = new Float32Array(cameraData, 64, 3);
        viewProjMatrix.set(matrixMult(viewMatrix, transpose(projMatrix)));
        worldPosition.set([0, 0, 0]);
        device.queue.writeBuffer(this.cameraDataBuffer, 0, cameraData);
    }
    static createDepthTexture(width, height) {
        return device.createTexture({
            size: { width, height },
            format: this.depthTextureFormat,
            dimension: "2d",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
    }
    static createShader(layerCount) {
        const stickerBufferLength = this.getStickerBufferLength(layerCount);
        const source = `
            struct CameraData {
                viewProjMatrix: mat4x4f,
                worldPosition: vec3f,
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
        
            struct VertexOut {
                @builtin(position) position: vec4f,
                @location(0) uv: vec2f,
                @location(1) @interpolate(flat) face: u32,
            };
    
            @vertex
            fn vert_main(@builtin(vertex_index) vertexId: u32, @builtin(instance_index) instanceId: u32) -> VertexOut {
                var out: VertexOut;

                var vertex = vertices[vertexId];
                let normal = normals[instanceId];

                var position = vec3f(vertex, 0.0);
                if (normal.x != 0) { position = position.zxy + normal; }
                if (normal.y != 0) { position = position.xzy + normal; }
                if (normal.z != 0) { position += normal; }

                out.position = cameraData.viewProjMatrix * vec4f(position * 0.1, 1);
                out.uv = vertex;
                out.face = instanceId;

                switch (instanceId) {
                    case 0: { out.uv = vec2f(-out.uv.y, -out.uv.x); break; }
                    case 1: { out.uv = vec2f(out.uv.y, -out.uv.x); break; }
                    case 3: { out.uv.y *= -1; break; }
                    case 4: { out.uv.y *= -1; break; }
                    case 5: { out.uv *= -1; break; }
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
    static createRenderPipeline(module, format, pipelineLayout) {
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
                format: this.depthTextureFormat,
                depthWriteEnabled: true,
                depthCompare: "less"
            },
            primitive: {
                topology: "triangle-strip"
            }
        });
    }
    static createStickerBuffer(layerCount) {
        return device.createBuffer({
            label: "Sticker Buffer",
            size: this.getStickerBufferByteLength(layerCount),
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
        });
    }
    static getStickerBufferLength(layerCount) {
        return Math.ceil(6 * layerCount * layerCount / 10);
    }
    static getStickerBufferByteLength(layerCount) {
        return this.getStickerBufferLength(layerCount) * 4;
    }
    initStickerBuffer() {
        const commandEncoder = device.createCommandEncoder({ label: "Puzzle Drawer Init Stickers Buffer" });
        const stickerComputePipeline = device.createComputePipeline({
            layout: this.pipelineLayout,
            compute: {
                module: this.module,
                entryPoint: "initStickers"
            }
        });
        const pass = commandEncoder.beginComputePass();
        pass.setPipeline(stickerComputePipeline);
        for (let i = 0; i < this.bindGroups.length; i++) {
            pass.setBindGroup(i, this.bindGroups[i]);
        }
        pass.dispatchWorkgroups(Math.ceil(this.stickerBuffer.size / 256));
        pass.end();
        device.queue.submit([commandEncoder.finish()]);
    }
}
