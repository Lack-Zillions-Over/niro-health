import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import useUser from '@/atom/user';
import UserCookies from '@/cache/cookies/user';

declare type ISocket = Socket | null;

declare interface Props {
  children: React.ReactNode;
}

const SocketContext = createContext<{
  socket: ISocket;
}>({ socket: null });

const WebSocketProvider = (props: Props) => {
  const [socket, setSocket] = useState<ISocket>(null);

  const user = useUser();
  const cookies = UserCookies();

  useEffect(() => {
    if (user.isLoaded() && user.get().id.length > 0) {
      if (!socket) {
        const newSocket = io(
          process.env.NEXT_PUBLIC_APPLICATION_URI || 'http://localhost:4000',
          {
            auth: {
              session: {
                user_id: user.get().id,
                ...cookies.login.get(),
              },
            },
          },
        );

        setSocket(newSocket);
      } else {
        if (socket.disconnected) socket.connect();
      }
    }

    return () => {
      socket && socket.disconnect();
    };
  }, [socket, cookies, user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

function useSocket() {
  const context = useContext(SocketContext);
  return context.socket;
}

export { WebSocketProvider, useSocket };

export default SocketContext;
