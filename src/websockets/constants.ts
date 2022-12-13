const WebSocketConstants = {
  cors: {
    origin:
      process.env.NODE_ENV === 'production' ? process.env.WEBAPP_URI : '*',
  },
};

export default WebSocketConstants;
