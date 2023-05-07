import { Dispatch, FC, memo, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { IMessage } from '../utils/types';
import { Box, IconButton, Typography } from '@mui/joy';
import { socket } from './AppRouter';
import NewMessage from './NewMessage';
import Message from './Message';
import { getRoomMessages } from '../utils/Api';
import Loader from './Loader';
import { ArrowBack } from '@mui/icons-material';

interface IChatProps {
  messages: IMessage[];
  setMessages: Dispatch<React.SetStateAction<IMessage[]>>;
  setIsDialogsOpened: Dispatch<React.SetStateAction<boolean>>;
}

const Chat: FC<IChatProps> = ({ messages, setMessages, setIsDialogsOpened }) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, []);

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
  }, [params.id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <IconButton
        onClick={() => setIsDialogsOpened(true)}
        id="toggle-mode"
        size="sm"
        variant="plain"
        sx={{
          position: 'absolute',
          zIndex: 10,
          left: '10px',
          top: '10px',
          backgroundColor: (theme) => theme.palette.primary[400],
        }}
        color="neutral">
        <ArrowBack></ArrowBack>
      </IconButton>
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
            overflowY: 'auto',
            height: '100vh',
            paddingBottom: '120px',
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
