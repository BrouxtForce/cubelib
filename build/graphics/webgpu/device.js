const adapter = await navigator.gpu?.requestAdapter();
const device = await adapter?.requestDevice();
export default device;
