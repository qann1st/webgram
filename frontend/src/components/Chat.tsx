import { ArrowBack } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography, useColorScheme } from '@mui/joy';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../hooks/index';
import { setIsDialogsOpened } from '../store/slices/dialogsSlice';
import { addMessage, setMessages } from '../store/slices/messagesSlice';
import { getRoomMessages } from '../utils/Api';
import { IMessage, Months } from '../utils/types';
import Message from './Message';
import NewMessage from './NewMessage';
import { Socket } from 'socket.io-client';
import Skeleton from './Skeleton';

const Chat: FC<{ socketio: Socket }> = ({ socketio }) => {
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const messages = useAppSelector((state) => state.messages.messages);
  const isDialogsOpened = useAppSelector((state) => state.dialogs.isDialogsOpened);
  const currentEnemy = useAppSelector((state) => state.currentEnemy.currentEnemy);

  const date = currentEnemy ? new Date(currentEnemy.lastOnline) : new Date();
  const rtf = `${date.getDate()} ${
    Months[date.getMonth() + 1]
  } ${date.getFullYear()} года, ${date.getHours()}:${
    date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()
  }`;
  const { mode } = useColorScheme();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView();
    }
  }, [messages, isLoading, isDialogsOpened]);

  useEffect(() => {
    setIsLoading(true);
    if (params.id) {
      const arr = sessionStorage.getItem(params.id);
      if (arr) {
        if (arr.length > 2) {
          const messages: IMessage[] = JSON.parse(arr);
          setIsLoading(false);
          dispatch(setMessages(messages));
        } else {
          setIsLoading(true);
          getRoomMessages(params.id)
            .then((data) => {
              if (params.id) {
                sessionStorage.setItem(params.id, JSON.stringify(data));
              }
              dispatch(setMessages(data));
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      } else {
        setIsLoading(true);
        getRoomMessages(params.id)
          .then((data) => {
            if (params.id) {
              sessionStorage.setItem(params.id, JSON.stringify(data));
            }
            dispatch(setMessages(data));
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }

    socketio.emit('join', { roomId: params.id });

    socketio.on('message', (message: IMessage) => {
      if (message.roomId === params.id) {
        dispatch(addMessage(message));
      }
    });

    return () => {
      socketio.emit('leave', { roomId: params.id });
    };
    // eslint-disable-next-line
  }, [params.id]);

  return (
    <>
      <IconButton
        onClick={() => {
          dispatch(setIsDialogsOpened(true));
          navigate('/messages');
        }}
        id="toggle-mode"
        size="sm"
        variant="plain"
        sx={{
          fontFamily: 'sans-serif, Noto Color Emoji',
          position: 'absolute',
          zIndex: 10,
          left: '10px',
          top: '10px',
          display: {
            xs: 'flex',
            md: 'none',
          },
          backgroundColor: (theme) => theme.palette.primary[400],
        }}
        color="neutral">
        <ArrowBack sx={{ color: 'black' }}></ArrowBack>
      </IconButton>
      <Box
        sx={{
          padding: '8px 10px',
          borderBottom: mode === 'dark' ? '1px solid #21262d' : '1px solid gray',
          paddingLeft: { xs: '55px', md: '8px' },
          backgroundColor: mode === 'dark' ? 'var(--joy-palette-background-body)' : '#fff',
          zIndex: 1,
          display: 'flex',
        }}>
        {isLoading ? (
          <Skeleton
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
            <Skeleton.Circle sx={{ width: '40px', height: '40px' }} />
            <Box>
              <Skeleton.Rectangle sx={{ width: '60px', height: '18px' }} />
              <Skeleton.Rectangle sx={{ width: '209px', height: '12px', marginTop: '5px' }} />
            </Box>
          </Skeleton>
        ) : (
          <>
            <Avatar src={currentEnemy?.avatar} sx={{ marginRight: '10px' }} />
            <Box>
              <Typography
                sx={{
                  fontSize: '18px',
                  fontFamily: 'sans-serif',
                }}>
                {currentEnemy?.name}
              </Typography>
              <Typography
                sx={{
                  wordWrap: 'break-word',
                  fontFamily: 'sans-serif',
                  fontSize: 14,
                  lineHeight: 1,
                }}>
                {currentEnemy?.isOnline ? 'в сети' : `был(-а) ${rtf}`}
              </Typography>
            </Box>
          </>
        )}
      </Box>
      <Box
        sx={{
          overflowY: 'scroll',
          boxSizing: 'border-box',
          flex: 1,
          paddingBottom: {
            xs: '5px',
            md: '5px',
          },
        }}>
        {isLoading
          ? new Array(30).fill(null).map((_, i) => (
              <Skeleton
                key={i}
                sx={{
                  padding: '0 10px',
                  display: 'flex',
                  justifyContent: Math.random() > 0.5 ? 'flex-start' : 'flex-end',
                }}>
                <Skeleton.Rectangle
                  sx={{
                    width: '100px',
                    height: '29px',
                    marginTop: '17px',
                  }}
                />
              </Skeleton>
            ))
          : messages?.map((message: IMessage, i) => {
              const msgDate = new Date(message.timestamp);
              const msgsDate = new Date(messages[i - 1]?.timestamp);
              const date =
                msgDate.getDate() !== msgsDate.getDate()
                  ? msgDate.getDate() + ' ' + Months[msgDate.getMonth() + 1]
                  : '';
              return (
                <div key={message._id}>
                  {date && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                      <Typography
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '10px',
                          padding: '1px 5px',
                          color: '#fff',
                          fontFamily: 'sans-serif',
                          fontSize: '13px',
                          margin: '10px 0',
                        }}>
                        {date}
                      </Typography>
                    </Box>
                  )}
                  <Message
                    scrollRef={scrollRef.current}
                    owner={message.owner}
                    text={message.text}
                    timestamp={message.timestamp}
                    audio={message.audio}
                    duration={message.duration}
                  />
                </div>
              );
            })}
        <div ref={scrollRef}></div>
      </Box>
      <NewMessage socketio={socketio} />
    </>
  );
};

export default memo(Chat);
