import { Dispatch, FC, memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IMessage } from '../utils/types';
import { Box, Typography } from '@mui/joy';
import { socket } from './AppRouter';
import NewMessage from './NewMessage';
import Message from './Message';
import { getRoomMessages } from '../utils/Api';
import Loader from './Loader';

interface IChatProps {
  messages: IMessage[];
  setMessages: Dispatch<React.SetStateAction<IMessage[]>>;
}

const Chat: FC<IChatProps> = ({ messages, setMessages }) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRoomMessages(params.id)
      .then((data) => {
        setMessages(data);
      })
      .finally(() => {
        setIsLoading(false);
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
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
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
        <Box
          sx={{
            overflowY: 'scroll',
            height: '100vh',
            paddingBottom: '70px',
          }}>
          {messages.map((message: IMessage, i) => (
            <Message
              key={message._id}
              owner={message.owner}
              text={message.text}
              timestamp={message.timestamp}
            />
          ))}
        </Box>
      )}
      <NewMessage />
    </>
  );
};

export default memo(Chat);
