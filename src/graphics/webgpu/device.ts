const adapter = await navigator.gpu?.requestAdapter();
const device = await adapter?.requestDevice() as GPUDevice;

export default device;