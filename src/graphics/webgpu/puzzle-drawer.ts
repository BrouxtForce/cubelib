import device from "./device.js";
import { matrixMult, createTransformMatrix, createPerspectiveMatrix, createScaleMatrix } from "../math.js";

export default class PuzzleDrawer {
    private readonly context: GPUCanvasContext;
    private depthTexture: GPUTexture;
    private readonly renderPassDescriptor: GPURenderPassDescriptor;
    private readonly module: GPUShaderModule;
    private readonly renderPipeline: GPURenderPipeline;
    private readonly cameraDataBuffer: GPUBuffer;
    private readonly bindGroups: GPUBindGroup[];

    private static depthTextureFormat: GPUTextureFormat = "depth16unorm";

    constructor(canvas: HTMLCanvasElement) {
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
                view: null as any,
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
        this.module = PuzzleDrawer.createShader();
        this.renderPipeline = PuzzleDrawer.createRenderPipeline(this.module, preferredFormat);

        this.cameraDataBuffer = device.createBuffer({
            size: 80,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM
        });

        this.bindGroups = [
            device.createBindGroup({
                layout: this.renderPipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: { buffer: this.cameraDataBuffer } }
                ]
            })
        ];
    }

    render(positionBuffer: GPUBuffer, indexBuffer: GPUBuffer, indexCount: number): void {
        const commandEncoder = device.createCommandEncoder({ label: "Puzzle Drawer Command Encoder" });

        // @ts-expect-error
        this.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();

        const pass = commandEncoder.beginRenderPass(this.renderPassDescriptor);
        pass.setPipeline(this.renderPipeline);
        pass.setVertexBuffer(0, positionBuffer);
        for (let i = 0; i < this.bindGroups.length; i++) {
            pass.setBindGroup(i, this.bindGroups[i]);
        }
        pass.setIndexBuffer(indexBuffer, "uint16");
        pass.drawIndexed(indexCount);
        pass.end();

        device.queue.submit([commandEncoder.finish()]);
    }

    setCameraTransform(position: number[], rotation: number[], scale: number[]): void {
        const viewMatrix = createTransformMatrix(position, rotation, scale);
        const projMatrix = createPerspectiveMatrix(1, this.context.canvas.width / this.context.canvas.height, 0.01);

        const cameraData = new ArrayBuffer(80);
        const viewProjMatrix = new Float32Array(cameraData, 0, 16);
        const worldPosition = new Float32Array(cameraData, 64, 3);

        // viewProjMatrix.set(matrixMult(projMatrix, viewMatrix));
        viewProjMatrix.set(projMatrix);
        worldPosition.set([0, 0, 0]);

        device.queue.writeBuffer(this.cameraDataBuffer, 0, cameraData);
    }

    static createCubeBuffers(): { positionBuffer: GPUBuffer, indexBuffer: GPUBuffer, indexCount: number } {
        const positions =  new Float32Array([
            -1, -1, -1,
             1, -1, -1,
             1, -1,  1,
            -1, -1,  1,
            -1,  1,  1,
             1,  1,  1,
             1,  1, -1,
            -1,  1, -1
        ]);
        const indices = new Uint16Array([
            0, 1, 2, 2, 3, 0,
            0, 3, 4, 4, 7, 0,
            3, 2, 5, 5, 4, 3,
            2, 1, 6, 6, 5, 2,
            1, 0, 7, 7, 6, 1,
            4, 5, 6, 6, 7, 4
        ]);

        const positionBuffer = device.createBuffer({
            label: "Cube Position Buffer",
            size: positions.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
        const indexBuffer = device.createBuffer({
            label: "Cube Index Buffer",
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
        });

        device.queue.writeBuffer(positionBuffer, 0, positions);
        device.queue.writeBuffer(indexBuffer, 0, indices);

        return { positionBuffer, indexBuffer, indexCount: indices.length };
    }
    
    private static createDepthTexture(width: number, height: number): GPUTexture {
        return device.createTexture({
            size: { width, height },
            format: this.depthTextureFormat,
            dimension: "2d",
            usage: GPUTextureUsage.RENDER_ATTACHMENT
        });
    }
    
    private static createShader(): GPUShaderModule {
        const source = `
            struct CameraData {
                viewProjMatrix: mat4x4f,
                worldPosition: vec3f,
            };
        
            @group(0) @binding(0) var<uniform> cameraData: CameraData;
    
            // @group(1) @binding(0) var<storage, read> rotations: array<vec4f>;
        
            struct VertexOut {
                @builtin(position) position: vec4f,
            };
    
            @vertex
            fn vert_main(@builtin(vertex_index) vertexId: u32, @builtin(instance_index) instanceId: u32, @location(0) position: vec3f) -> VertexOut {
                var out: VertexOut;
    
                out.position = cameraData.viewProjMatrix * vec4f(position, 1);
    
                return out;
            }
    
            @fragment
            fn frag_main() -> @location(0) vec4f {
                return vec4f(1, 0, 0, 1);
            }
        `;
    
        return device.createShaderModule({
            label: "puzzle shader module",
            code: source
        });
    }
    
    private static createRenderPipeline(module: GPUShaderModule, format: GPUTextureFormat): GPURenderPipeline {
        return device.createRenderPipeline({
            label: "Draw Puzzle Render Pipeline",
            layout: "auto",
            vertex: {
                module,
                entryPoint: "vert_main",
                buffers: [{
                    arrayStride: 12, // sizeof(vec3f)
                    attributes: [
                        { shaderLocation: 0, offset: 0, format: "float32x3"}
                    ]
                }]
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
            }
        });
    }
}
