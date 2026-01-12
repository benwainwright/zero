const protocol = process.env['BACKEND_PROTOCOL'];
const host = process.env['BACKEND_HOST'];
const port = process.env['BACKEND_PORT'];

export const socketUrl = `${protocol}://${host}:${port}`;
