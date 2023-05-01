import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getRoomMessages } from '../utils/Api';
import { IMessage } from '../utils/types';
import { Box, Typography } from '@mui/joy';
import { socket } from './AppRouter';
import NewMessage from './NewMessage';
import Message from './Message';

const Chat = () => {
  const params = useParams();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    getRoomMessages(params.id).then((data) => {
      setMessages(data);
    });

    socket.emit('join', { roomId: params.id });

    socket.on('message', (message: IMessage) => {
      if (message.roomId === params.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.emit('leave', { roomId: params.id });
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <Typography>Пока сообщений нет</Typography>
          </Box>
        ) : (
          <>
            {messages.map((message: IMessage) => (
              <Message
                key={message._id}
                owner={message.owner}
                text={message.text}
                timestamp={message.timestamp}
              />
            ))}
          </>
        )}
      </Box>
      <NewMessage />
    </>
  );
};

export default memo(Chat);
