import { Dispatch, FC, memo, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { getRoomMessages } from '../utils/Api';
import { IMessage } from '../utils/types';
import { Box, Typography } from '@mui/joy';
import { socket } from './AppRouter';
import NewMessage from './NewMessage';
import Message from './Message';

interface IChatProps {
  messages: IMessage[];
  setMessages: Dispatch<React.SetStateAction<IMessage[]>>;
}

const Chat: FC<IChatProps> = ({ messages, setMessages }) => {
  const params = useParams();
  const scrollRef = useRef<HTMLDivElement>();

  useEffect(() => {
    getRoomMessages(params.id).then((data) => {
      setMessages(data);
    });

    socket.emit('join', { roomId: params.id });

    socket.on('message', (message: IMessage) => {
      if (message.roomId === params.id) {
        console.log([...messages, message]);

        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.emit('leave', { roomId: params.id });
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [messages]);

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
          {messages.map((message: IMessage) => (
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
