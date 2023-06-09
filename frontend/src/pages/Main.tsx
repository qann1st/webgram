import { Box, Divider, Typography, useColorScheme } from '@mui/joy';
import { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Socket } from 'socket.io-client';
import Chat from '../components/Chat';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import DialogList from '../components/DialogList';
import { useAppDispatch, useAppSelector } from '../hooks/index';
import { setIsDialogsOpened } from '../store/slices/dialogsSlice';

const Main: FC<{ socketio: Socket }> = ({ socketio }) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [isResize, setIsResize] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDialogsOpened = useAppSelector((state) => state.dialogs.isDialogsOpened);
  const { mode } = useColorScheme();

  useEffect(() => {
    if (!params.id) {
      dispatch(setIsDialogsOpened(true));
    }

    // eslint-disable-next-line
  }, [params.id]);

  useEffect(() => {
    const resize = () => {
      setIsResize(false);
    };

    if (isResize) {
      window.addEventListener('mousemove', resizeSidebar);
    }
    window.addEventListener('mouseup', resize);

    return () => {
      window.removeEventListener('mousemove', resizeSidebar);
      window.removeEventListener('mouseup', resize);
    };
    // eslint-disable-next-line
  }, [isResize]);

  const resizeSidebar = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sidebarRef.current && isResize) {
      sidebarRef.current.style.maxWidth = e.clientX + 'px';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <ColorSchemeToggle />
      <Box
        sx={{
          display: {
            xs: isDialogsOpened ? 'block' : 'none',
            md: 'block',
          },
          position: 'relative',
          borderRight: mode === 'dark' ? '1px solid #21262d' : '1px solid gray',
          maxWidth: {
            xs: '100%',
            md: '500px',
          },
          minWidth: '320px',
          maxHeight: '100vh',
          flex: 1,
        }}
        ref={sidebarRef}>
        <DialogList socketio={socketio} />
        <Divider
          onMouseDown={() => setIsResize(true)}
          orientation="vertical"
          sx={{
            width: '10px',
            position: 'absolute',
            top: 0,
            right: '-5px',
            zIndex: 2,
            bottom: 0,
            backgroundColor: 'transparent',
            display: {
              xs: 'none',
              md: 'flex',
            },
            '&:hover': {
              cursor: 'col-resize',
            },
            '&:active': {
              cursor: 'col-resize',
            },
          }}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          background:
            mode === 'dark'
              ? '#0f0f0f'
              : "url('https://web.telegram.org/a/chat-bg-br.f34cc96fbfb048812820.png')",
          backgroundSize: 'cover',
          flex: 1,
          zIndex: 1,
          height: '100vh',
          position: 'relative',
          flexDirection: 'column',
          display: {
            xs: !isDialogsOpened ? 'flex' : 'none',
            md: 'flex',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            backgroundSize: '700px auto',
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            filter: mode === 'dark' ? 'contrast(0.5)' : '',
            backgroundImage:
              "url('https://web.telegram.org/a/chat-bg-pattern-light.ee148af944f6580293ae.png')",
          },
        }}>
        {params.id ? (
          <Chat socketio={socketio} />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Typography>Выберите чат</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Main;
