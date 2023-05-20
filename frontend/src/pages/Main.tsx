import { Box, Divider, Typography } from '@mui/joy';
import { FC, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Socket } from 'socket.io-client';
import Chat from '../components/Chat';
import ColorSchemeToggle from '../components/ColorSchemeToggle';
import DialogList from '../components/DialogList';
import { useAppDispatch, useAppSelector } from '../hooks/index';
import { setIsDialogsOpened } from '../store/slices/dialogsSlice';
import { setUsersList } from '../store/slices/usersSlice';

const Main: FC<{ socketio: Socket }> = ({ socketio }) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [isResize, setIsResize] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDialogsOpened = useAppSelector((state) => state.dialogs.isDialogsOpened);

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

    window.addEventListener('mousemove', resizeSidebar);
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
          maxWidth: {
            xs: '100%',
            md: '500px',
          },
          minWidth: '320px',
          maxHeight: '100vh',
          flex: 1,
        }}
        ref={sidebarRef}>
        <DialogList />
      </Box>
      <Divider
        onMouseDown={() => setIsResize(true)}
        orientation="vertical"
        sx={{
          width: '7px',
          display: {
            xs: 'none',
            md: 'flex',
          },
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.softHoverBg,
            cursor: 'resize',
          },
          '&:active': {
            cursor: 'resize',
          },
        }}
      />
      <Box
        sx={{
          width: '100%',
          backgroundColor: (theme) => theme.palette.primary[400],
          flex: 1,
          height: '100vh',
          flexDirection: 'column',
          display: {
            xs: !isDialogsOpened ? 'flex' : 'none',
            md: 'flex',
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
