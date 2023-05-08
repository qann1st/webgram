import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/joy';
import { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../hooks/index';
import { setIsDialogsOpened } from '../store/slices/dialogsSlice';
import { addMessage, setMessages } from '../store/slices/messagesSlice';
import { getRoomMessages } from '../utils/Api';
import { IMessage } from '../utils/types';
import { socket } from './AppRouter';
import Loader from './Loader';
import Message from './Message';
import NewMessage from './NewMessage';

const Chat: FC = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.messages.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDialogsOpened = useAppSelector((state) => state.dialogs.isDialogsOpened);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({});
    }
  }, [messages, isLoading, isDialogsOpened]);

  useEffect(() => {
    setIsLoading(true);
    if (params.id) {
      getRoomMessages(params.id)
        .then((data) => {
          dispatch(setMessages(data));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    socket.emit('join', { roomId: params.id });

    socket.on('message', (message: IMessage) => {
      if (message.roomId === params.id) {
        dispatch(addMessage(message));
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
        onClick={() => dispatch(setIsDialogsOpened(true))}
        id="toggle-mode"
        size="sm"
        variant="plain"
        sx={{
          position: 'absolute',
          zIndex: 10,
          left: '10px',
          top: '10px',
          display: {
            xs: 'flex',
            md: 'none',
          },
          backgroundColor: (theme) => theme.palette.primary[100],
        }}
        color="neutral">
        <ArrowBack sx={{ color: 'black' }}></ArrowBack>
      </IconButton>
      {messages?.length === 0 ? (
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
            boxSizing: 'border-box',
            flex: 1,
            paddingBottom: {
              xs: '20px',
              md: '30px',
            },
          }}>
          {messages?.map((message: IMessage, i) => (
            <Message
              key={message._id}
              owner={message.owner}
              text={message.text}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={scrollRef}></div>
        </Box>
      )}
      <NewMessage />
    </>
  );
};

export default Chat;
