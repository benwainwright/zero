export const getSocketUrl = () => {
  if (import.meta.env.DEV) {
    return `ws://localhost:3000`;
  }

  const protocol = process.env['BACKEND_PROTOCOL'];
  const host = process.env['BACKEND_HOST'];
  const port = process.env['BACKEND_PORT'];

  return `${protocol}://${host}:${port}`;
};
export const socketUrl = getSocketUrl();
