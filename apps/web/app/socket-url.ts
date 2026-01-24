export const getSocketUrl = () => {
  if (
    process.env['NODE_ENV'] !== 'production' &&
    process.env['NODE_ENV'] !== 'staging'
  ) {
    return `ws://localhost:3000`;
  }

  const protocol = process.env['BACKEND_PROTOCOL'];
  const host = process.env['BACKEND_HOST'];
  const port = process.env['BACKEND_PORT'];

  return `${protocol}://${host}:${port}`;
};
export const socketUrl = getSocketUrl();
