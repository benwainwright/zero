const host = process.env['VITE_ZERO_BACKEND_SOCKET_HOST'];
const port = process.env['VITE_ZERO_CONFIG_SOCKET_PORT'];

export const socketUrl = `ws://${host}:${port}`;
